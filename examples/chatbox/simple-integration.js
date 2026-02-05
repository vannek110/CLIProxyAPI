/**
 * SIMPLE CHATBOX INTEGRATION
 * Tích hợp chatbox đơn giản cho dự án của bạn
 * 
 * Chỉ cần copy code này vào dự án và sử dụng!
 */

// ============================================
// CÁCH 1: Vanilla JavaScript (Dùng cho HTML)
// ============================================

class ChatboxAPI {
    constructor(apiUrl = 'http://localhost:8317/v1/chat/completions', apiKey = 'your-api-key-1') {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.conversationHistory = [];
    }

    /**
     * Gửi tin nhắn và nhận phản hồi (KHÔNG streaming)
     * Dùng khi bạn muốn nhận toàn bộ câu trả lời một lần
     */
    async sendMessage(userMessage, model = 'gemini-3-flash-preview') {
        // Thêm tin nhắn người dùng vào lịch sử
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: this.conversationHistory,
                    stream: false,
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Lưu phản hồi vào lịch sử
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    /**
     * Gửi tin nhắn với STREAMING (hiển thị từng chữ)
     * Dùng khi bạn muốn hiển thị câu trả lời từng chữ một
     */
    async sendMessageStreaming(userMessage, onChunk, model = 'gemini-3-flash-preview') {
        // Thêm tin nhắn người dùng vào lịch sử
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: this.conversationHistory,
                    stream: true,
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                fullResponse += content;
                                // Gọi callback với mỗi phần nhận được
                                if (onChunk) onChunk(content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            // Lưu phản hồi đầy đủ vào lịch sử
            this.conversationHistory.push({
                role: 'assistant',
                content: fullResponse
            });

            return fullResponse;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    /**
     * Xóa lịch sử cuộc trò chuyện
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Lấy lịch sử cuộc trò chuyện
     */
    getHistory() {
        return this.conversationHistory;
    }
}

// ============================================
// VÍ DỤ SỬ DỤNG
// ============================================

// Khởi tạo chatbox
const chatbox = new ChatboxAPI('http://localhost:8317/v1/chat/completions', 'your-api-key-1');

// VÍ DỤ 1: Gửi tin nhắn KHÔNG streaming
async function example1() {
    try {
        const response = await chatbox.sendMessage('Xin chào!');
        console.log('AI:', response);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// VÍ DỤ 2: Gửi tin nhắn VỚI streaming
async function example2() {
    try {
        let fullMessage = '';
        
        await chatbox.sendMessageStreaming(
            'Kể cho tôi một câu chuyện ngắn',
            (chunk) => {
                // Callback này được gọi mỗi khi nhận được một phần
                fullMessage += chunk;
                console.log('Nhận được:', chunk);
                // Bạn có thể cập nhật UI ở đây
            }
        );
        
        console.log('Toàn bộ:', fullMessage);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// VÍ DỤ 3: Cuộc trò chuyện nhiều lượt
async function example3() {
    try {
        // Lượt 1
        const response1 = await chatbox.sendMessage('Tên tôi là Nam');
        console.log('AI:', response1);
        
        // Lượt 2
        const response2 = await chatbox.sendMessage('Tên tôi là gì?');
        console.log('AI:', response2); // AI sẽ nhớ tên bạn
        
        // Xem lịch sử
        console.log('Lịch sử:', chatbox.getHistory());
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// ============================================
// TÍCH HỢP VÀO HTML
// ============================================

/*
<!DOCTYPE html>
<html>
<head>
    <title>My Chatbox</title>
</head>
<body>
    <div id="chat-messages"></div>
    <input type="text" id="user-input" placeholder="Nhập tin nhắn...">
    <button id="send-btn">Gửi</button>

    <script src="simple-integration.js"></script>
    <script>
        const chatbox = new ChatboxAPI('http://localhost:8317/v1/chat/completions', 'your-api-key-1');
        const messagesDiv = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        sendBtn.addEventListener('click', async () => {
            const message = userInput.value.trim();
            if (!message) return;

            // Hiển thị tin nhắn người dùng
            messagesDiv.innerHTML += `<div>Bạn: ${message}</div>`;
            userInput.value = '';

            // Tạo div cho phản hồi AI
            const aiDiv = document.createElement('div');
            aiDiv.textContent = 'AI: ';
            messagesDiv.appendChild(aiDiv);

            // Gửi tin nhắn với streaming
            try {
                await chatbox.sendMessageStreaming(message, (chunk) => {
                    aiDiv.textContent += chunk;
                });
            } catch (error) {
                aiDiv.textContent = 'Lỗi: ' + error.message;
            }
        });
    </script>
</body>
</html>
*/

// ============================================
// EXPORT (nếu dùng module)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatboxAPI;
}
