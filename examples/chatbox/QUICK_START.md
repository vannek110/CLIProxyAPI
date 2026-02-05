# 🚀 HƯỚNG DẪN NHANH - Tích hợp Chatbox vào Dự Án

## ✅ Bạn đã có gì?
- CLIProxyAPI đang chạy trên: `http://localhost:8317/v1`
- API Key: `your-api-key-1` (trong file config.yaml)

## 📦 Files để sử dụng

### 1️⃣ **simple-chatbox.html** - KHUYÊN DÙNG ⭐
**File HTML hoàn chỉnh, chỉ cần mở và dùng!**

```bash
# Mở file này trong browser
d:\CLIProxyAPI\examples\chatbox\simple-chatbox.html
```

**Cách dùng:**
1. Mở file `simple-chatbox.html` trong browser
2. Nhập tin nhắn và gửi
3. Xong! Không cần cài đặt gì thêm

**Tùy chỉnh:**
Mở file và sửa phần CONFIG:
```javascript
const CONFIG = {
    apiUrl: 'http://localhost:8317/v1/chat/completions',
    apiKey: 'your-api-key-1',
    model: 'gemini-3-flash-preview',
    useStreaming: true  // true = từng chữ, false = cả câu
};
```

---

### 2️⃣ **simple-integration.js** - Cho dự án JavaScript
**Class JavaScript để tích hợp vào dự án của bạn**

**Cách dùng:**

```html
<!-- Trong HTML của bạn -->
<script src="simple-integration.js"></script>
<script>
    // Khởi tạo
    const chatbox = new ChatboxAPI(
        'http://localhost:8317/v1/chat/completions',
        'your-api-key-1'
    );

    // Gửi tin nhắn
    async function chat() {
        const response = await chatbox.sendMessage('Xin chào!');
        console.log(response);
    }
</script>
```

**Ví dụ đầy đủ:**
```javascript
// Khởi tạo chatbox
const chatbox = new ChatboxAPI(
    'http://localhost:8317/v1/chat/completions',
    'your-api-key-1'
);

// CÁCH 1: Không streaming (nhận cả câu)
async function example1() {
    const response = await chatbox.sendMessage('Xin chào!');
    console.log('AI:', response);
}

// CÁCH 2: Có streaming (nhận từng chữ)
async function example2() {
    await chatbox.sendMessageStreaming(
        'Kể câu chuyện',
        (chunk) => {
            console.log(chunk); // Mỗi chữ nhận được
        }
    );
}

// CÁCH 3: Cuộc trò chuyện nhiều lượt
async function example3() {
    await chatbox.sendMessage('Tên tôi là Nam');
    const response = await chatbox.sendMessage('Tên tôi là gì?');
    console.log(response); // AI sẽ nhớ tên bạn
}
```

---

### 3️⃣ **chatbox.py** - Cho dự án Python
**Script Python để test hoặc tích hợp**

**Cài đặt:**
```bash
pip install requests
```

**Chạy:**
```bash
cd d:\CLIProxyAPI\examples\chatbox
python chatbox.py
```

**Hoặc tích hợp vào code:**
```python
import requests

def send_message(message):
    response = requests.post(
        'http://localhost:8317/v1/chat/completions',
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key-1'
        },
        json={
            'model': 'gemini-3-flash-preview',
            'messages': [{'role': 'user', 'content': message}],
            'stream': False
        }
    )
    return response.json()['choices'][0]['message']['content']

# Sử dụng
print(send_message('Xin chào!'))
```

---

## 🎯 Tích hợp vào dự án của bạn

### Nếu dự án của bạn là HTML/JavaScript:

**CÁCH 1: Copy toàn bộ code từ `simple-chatbox.html`**
- Mở file `simple-chatbox.html`
- Copy phần `<style>` vào CSS của bạn
- Copy phần HTML vào trang của bạn
- Copy phần `<script>` vào JavaScript của bạn

**CÁCH 2: Dùng class ChatboxAPI**
```html
<!-- Trong HTML của bạn -->
<div id="chat-messages"></div>
<input id="user-input" type="text">
<button id="send-btn">Gửi</button>

<script src="simple-integration.js"></script>
<script>
    const chatbox = new ChatboxAPI(
        'http://localhost:8317/v1/chat/completions',
        'your-api-key-1'
    );

    document.getElementById('send-btn').onclick = async () => {
        const input = document.getElementById('user-input');
        const message = input.value;
        
        // Hiển thị tin nhắn người dùng
        document.getElementById('chat-messages').innerHTML += 
            `<div>Bạn: ${message}</div>`;
        
        // Gửi và nhận phản hồi
        const response = await chatbox.sendMessage(message);
        
        // Hiển thị phản hồi
        document.getElementById('chat-messages').innerHTML += 
            `<div>AI: ${response}</div>`;
        
        input.value = '';
    };
</script>
```

---

### Nếu dự án của bạn là React:

```jsx
import { useState } from 'react';

function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        // Thêm tin nhắn người dùng
        setMessages([...messages, { role: 'user', content: input }]);

        // Gọi API
        const response = await fetch('http://localhost:8317/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer your-api-key-1'
            },
            body: JSON.stringify({
                model: 'gemini-3-flash-preview',
                messages: [...messages, { role: 'user', content: input }],
                stream: false
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Thêm phản hồi AI
        setMessages([
            ...messages,
            { role: 'user', content: input },
            { role: 'assistant', content: aiMessage }
        ]);

        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, i) => (
                    <div key={i}>{msg.role}: {msg.content}</div>
                ))}
            </div>
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
        </div>
    );
}
```

---

### Nếu dự án của bạn là Vue:

```vue
<template>
  <div>
    <div v-for="(msg, i) in messages" :key="i">
      {{ msg.role }}: {{ msg.content }}
    </div>
    <input v-model="input" @keyup.enter="sendMessage">
    <button @click="sendMessage">Gửi</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      input: ''
    }
  },
  methods: {
    async sendMessage() {
      this.messages.push({ role: 'user', content: this.input });

      const response = await fetch('http://localhost:8317/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-api-key-1'
        },
        body: JSON.stringify({
          model: 'gemini-3-flash-preview',
          messages: this.messages,
          stream: false
        })
      });

      const data = await response.json();
      this.messages.push({
        role: 'assistant',
        content: data.choices[0].message.content
      });

      this.input = '';
    }
  }
}
</script>
```

---

## 🔧 API Endpoint

```
POST http://localhost:8317/v1/chat/completions
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your-api-key-1
```

**Body (Không streaming):**
```json
{
  "model": "gemini-3-flash-preview",
  "messages": [
    {"role": "user", "content": "Xin chào!"}
  ],
  "stream": false
}
```

**Body (Có streaming):**
```json
{
  "model": "gemini-3-flash-preview",
  "messages": [
    {"role": "user", "content": "Xin chào!"}
  ],
  "stream": true
}
```

---

## 📝 Models có sẵn

- `gemini-3-flash-preview` - Nhanh nhất ⚡
- `gemini-3-pro-preview` - Chất lượng cao
- `gemini-2.5-flash` - Mới nhất

---

## ❓ Câu hỏi thường gặp

### 1. Làm sao để nhớ ngữ cảnh cuộc trò chuyện?
Gửi toàn bộ lịch sử tin nhắn trong mảng `messages`:
```javascript
const messages = [
    { role: 'user', content: 'Tên tôi là Nam' },
    { role: 'assistant', content: 'Xin chào Nam!' },
    { role: 'user', content: 'Tên tôi là gì?' }  // AI sẽ nhớ
];
```

### 2. Streaming hay không streaming?
- **Streaming**: Hiển thị từng chữ một (như ChatGPT) - trải nghiệm tốt hơn
- **Không streaming**: Nhận cả câu một lúc - đơn giản hơn

### 3. Làm sao thay đổi API key?
Sửa trong file `config.yaml`:
```yaml
api-keys:
  - "your-new-api-key"
```

### 4. API có hoạt động từ xa không?
Hiện tại chỉ `localhost`. Để dùng từ xa, cần:
- Deploy CLIProxyAPI lên server
- Thay `http://localhost:8317` bằng URL server của bạn

---

## 🎉 Bắt đầu ngay!

**Cách nhanh nhất:**
1. Mở file `simple-chatbox.html` trong browser
2. Nhập tin nhắn
3. Xong!

**Để tích hợp vào dự án:**
1. Copy code từ `simple-integration.js`
2. Thay đổi API URL và API Key nếu cần
3. Tích hợp vào dự án của bạn

---

## 📚 Tài liệu đầy đủ

Xem file `README.md` trong thư mục này để biết thêm chi tiết về:
- Tất cả parameters
- Error handling
- Advanced features
- Nhiều ví dụ code hơn

---

**Chúc bạn code vui vẻ! 🚀**
