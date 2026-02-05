// ============================================
// CODE TỐI GIẢN NHẤT - COPY VÀ DÙNG NGAY
// ============================================

// CÁCH 1: Gửi 1 tin nhắn đơn giản
async function chatSimple(message) {
    const response = await fetch('http://localhost:8317/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key-1'
        },
        body: JSON.stringify({
            model: 'gemini-3-flash-preview',
            messages: [{ role: 'user', content: message }],
            stream: false
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Sử dụng:
// chatSimple('Xin chào!').then(response => console.log(response));


// ============================================
// CÁCH 2: Với lịch sử cuộc trò chuyện
// ============================================

let history = [];

async function chat(message) {
    // Thêm tin nhắn người dùng
    history.push({ role: 'user', content: message });

    // Gọi API
    const response = await fetch('http://localhost:8317/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key-1'
        },
        body: JSON.stringify({
            model: 'gemini-3-flash-preview',
            messages: history,
            stream: false
        })
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Lưu phản hồi
    history.push({ role: 'assistant', content: aiMessage });

    return aiMessage;
}

// Sử dụng:
// chat('Tên tôi là Nam').then(r => console.log(r));
// chat('Tên tôi là gì?').then(r => console.log(r)); // AI sẽ nhớ


// ============================================
// CÁCH 3: Với streaming (hiển thị từng chữ)
// ============================================

async function chatStreaming(message, onChunk) {
    const response = await fetch('http://localhost:8317/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key-1'
        },
        body: JSON.stringify({
            model: 'gemini-3-flash-preview',
            messages: [{ role: 'user', content: message }],
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

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
                        fullText += content;
                        if (onChunk) onChunk(content);
                    }
                } catch (e) { }
            }
        }
    }

    return fullText;
}

// Sử dụng:
// chatStreaming('Kể câu chuyện', (chunk) => {
//     console.log(chunk); // In từng chữ
// });


// ============================================
// CÁCH 4: Dùng async/await với try/catch
// ============================================

async function chatSafe(message) {
    try {
        const response = await fetch('http://localhost:8317/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer your-api-key-1'
            },
            body: JSON.stringify({
                model: 'gemini-3-flash-preview',
                messages: [{ role: 'user', content: message }],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Lỗi:', error);
        return 'Xin lỗi, có lỗi xảy ra: ' + error.message;
    }
}

// Sử dụng:
// chatSafe('Xin chào!').then(r => console.log(r));


// ============================================
// CÁCH 5: Với cấu hình tùy chỉnh
// ============================================

const CONFIG = {
    apiUrl: 'http://localhost:8317/v1/chat/completions',
    apiKey: 'your-api-key-1',
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    maxTokens: 2048
};

async function chatCustom(message) {
    const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: CONFIG.model,
            messages: [{ role: 'user', content: message }],
            stream: false,
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.maxTokens
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Sử dụng:
// chatCustom('Xin chào!').then(r => console.log(r));
