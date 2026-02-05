# 🔧 Troubleshooting CORS Error on Render

## ❌ Lỗi bạn đang gặp

```
Access to fetch at 'https://srv-d62o8g94tr6s73fj1jug.onrender.com/v1/chat/completions' 
from origin 'null' has been blocked by CORS policy
```

## 🔍 Nguyên nhân có thể

1. **Server chưa được deploy** hoặc đang bị lỗi
2. **Server đang sleep** (Render free tier tự động sleep sau 15 phút không hoạt động)
3. **Environment variables chưa được set** đúng
4. **Build failed** khi deploy

---

## ✅ Các bước khắc phục

### **Bước 1: Kiểm tra server có đang chạy không**

Mở file `test-render-server.html` trong browser và click **"Test Health Endpoint"**.

- ✅ Nếu thấy "Server is running!" → Server OK, chuyển sang Bước 3
- ❌ Nếu lỗi → Server chưa chạy, làm theo Bước 2

---

### **Bước 2: Kiểm tra Render Dashboard**

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Tìm service `srv-d62o8g94tr6s73fj1jug`
3. Kiểm tra:

#### **A. Build & Deploy Status**
- Xem tab **"Logs"** → Có lỗi build không?
- Xem tab **"Events"** → Deploy thành công chưa?

#### **B. Environment Variables**
Vào **Settings** → **Environment** và kiểm tra 4 biến sau đã được set chưa:

```
✅ GEMINI_OAUTH_CLIENT_ID
✅ GEMINI_OAUTH_CLIENT_SECRET
✅ ANTIGRAVITY_OAUTH_CLIENT_ID
✅ ANTIGRAVITY_OAUTH_CLIENT_SECRET
```

**Nếu chưa có**, thêm vào theo hướng dẫn dưới đây.

#### **C. Service Status**
- Status phải là **"Live"** (màu xanh)
- Nếu là **"Build Failed"** hoặc **"Deploy Failed"** → Xem logs để tìm lỗi

---

### **Bước 3: Thêm Environment Variables (nếu chưa có)**

Vào **Settings** → **Environment** → **Add Environment Variable**:

```env
GEMINI_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GEMINI_OAUTH_CLIENT_SECRET=your-client-secret
ANTIGRAVITY_OAUTH_CLIENT_ID=your-antigravity-client-id.apps.googleusercontent.com
ANTIGRAVITY_OAUTH_CLIENT_SECRET=your-antigravity-client-secret
```

Sau khi thêm, click **"Save Changes"** → Render sẽ tự động redeploy.

---

### **Bước 4: Đợi server wake up (nếu đang sleep)**

Render free tier tự động sleep sau 15 phút không hoạt động.

- Request đầu tiên sẽ mất **30-60 giây** để wake up
- Sau đó server sẽ hoạt động bình thường
- Mở `test-render-server.html` và test lại

---

### **Bước 5: Kiểm tra Build Command**

Vào **Settings** → **Build & Deploy**:

**Build Command** phải là:
```bash
go build -o cli-proxy-api .
```

**Start Command** phải là:
```bash
./cli-proxy-api
```

Nếu sai, sửa lại và **Manual Deploy**.

---

### **Bước 6: Kiểm tra PORT environment variable**

Render tự động set biến `PORT`, nhưng CLIProxyAPI mặc định dùng port 8317.

**Giải pháp**: Thêm environment variable:
```
PORT=10000
```

Hoặc sửa code để đọc từ `PORT` env var.

---

## 🧪 Test từng bước

Sau khi làm theo các bước trên, test lại bằng `test-render-server.html`:

1. ✅ **Test 1: Health** → Server phải trả về response
2. ✅ **Test 2: Models** → Phải list được models
3. ✅ **Test 3: Chat** → Phải chat được
4. ✅ **Test 4: Grounding** → Phải trả về ngày hiện tại

---

## 🔧 Nếu vẫn lỗi CORS

### **Kiểm tra CORS middleware**

CLIProxyAPI đã có CORS middleware cho phép tất cả origins (`*`).

Nếu vẫn lỗi, có thể do:

1. **Request từ file:// protocol** → Mở HTML qua HTTP server thay vì file://
   ```bash
   # Dùng Python
   python -m http.server 8000
   
   # Hoặc dùng Node.js
   npx http-server
   ```

2. **Browser cache** → Hard refresh (Ctrl+Shift+R)

3. **Browser extension** chặn CORS → Tắt extensions và thử lại

---

## 📞 Cần giúp thêm?

Nếu vẫn gặp vấn đề, cung cấp:

1. Screenshot của Render Dashboard → **Logs** tab
2. Screenshot của Render Dashboard → **Environment** tab
3. Screenshot của browser console (F12) khi test

---

## 🎯 Checklist nhanh

- [ ] Server status = "Live" trên Render
- [ ] 4 environment variables đã được set
- [ ] Build & Deploy thành công (xem Logs)
- [ ] Test health endpoint thành công
- [ ] Mở HTML qua HTTP server (không phải file://)
- [ ] Đợi 30-60s cho server wake up (nếu đang sleep)

---

**Tip**: Render free tier có giới hạn 750 giờ/tháng. Nếu hết quota, server sẽ không chạy được.
