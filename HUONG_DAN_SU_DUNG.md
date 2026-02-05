# Hướng Dẫn Sử Dụng CLIProxyAPI

## ✅ Đã Cấu Hình Xong

CLIProxyAPI của bạn đã được cấu hình với:
- **Gemini API Key**: AIzaSyCkXUCs5If9lwMkfKvyVngoaN-0Ao_7Jxw
- **Mật khẩu quản lý**: admin123
- **Port**: 8317

## 🚀 Các Lệnh Docker Cơ Bản

### Khởi động container
```bash
docker-compose up -d
```

### Dừng container
```bash
docker-compose down
```

### Khởi động lại container
```bash
docker-compose down
docker-compose up -d
```

### Xem logs
```bash
docker logs cli-proxy-api --tail 100 -f
```

### Kiểm tra trạng thái
```bash
docker ps
```

## 🌐 Truy Cập API

### 1. API Endpoint
Bạn có thể sử dụng API tại:
```
http://localhost:8317
```

### 2. Ví dụ sử dụng với cURL
```bash
curl http://localhost:8317/v1/models
```

### 3. Ví dụ Chat Completion
```bash
curl http://localhost:8317/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key-1" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Xin chào!"
      }
    ]
  }'
```

## 🔧 Quản Lý Web UI

CLIProxyAPI có giao diện quản lý web. Để truy cập:

1. Mở trình duyệt
2. Truy cập: `http://localhost:8317`
3. Đăng nhập với mật khẩu: `admin123`

## 📝 Cấu Hình

### File config.yaml
File cấu hình chính nằm tại: `d:\CLIProxyAPI\config.yaml`

Để thay đổi cấu hình:
1. Chỉnh sửa file `config.yaml`
2. Khởi động lại container:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Thêm API Key khác
Mở file `config.yaml` và thêm vào phần `gemini-api-key`:
```yaml
gemini-api-key:
  - api-key: "AIzaSyCkXUCs5If9lwMkfKvyVngoaN-0Ao_7Jxw"
    prefix: ""
    base-url: "https://generativelanguage.googleapis.com"
  - api-key: "YOUR_NEW_API_KEY_HERE"
    prefix: "key2"
    base-url: "https://generativelanguage.googleapis.com"
```

## 🔑 API Keys cho Client

Trong file `config.yaml`, có 2 API keys mặc định để client kết nối:
- `your-api-key-1`
- `your-api-key-2`

Bạn nên thay đổi chúng thành các key bảo mật hơn.

## 📊 Các Port Đang Sử Dụng

- **8317**: API chính
- **8085**: Port phụ
- **1455**: Port phụ
- **54545**: Port phụ
- **51121**: Port phụ
- **11451**: Port phụ

## 🐛 Xử Lý Lỗi

### Container không khởi động
```bash
# Xem logs để tìm lỗi
docker logs cli-proxy-api

# Kiểm tra cấu hình
docker-compose config
```

### API không phản hồi
```bash
# Kiểm tra container có chạy không
docker ps

# Xem logs real-time
docker logs cli-proxy-api -f
```

## 📚 Tài Liệu Thêm

- Tài liệu chính thức: https://help.router-for.me/
- GitHub: https://github.com/router-for-me/CLIProxyAPI

## 💡 Lưu Ý Quan Trọng

1. **Bảo mật**: Không chia sẻ API key của bạn với người khác
2. **Backup**: Sao lưu file `config.yaml` trước khi thay đổi
3. **Logs**: Kiểm tra logs thường xuyên tại thư mục `logs/`
4. **Update**: Cập nhật image Docker thường xuyên:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## 🎯 Sử Dụng với Các Công Cụ AI

CLIProxyAPI tương thích với:
- Claude Code
- Cursor
- Cline
- Roo Code
- Và nhiều công cụ AI khác

Chỉ cần cấu hình endpoint là `http://localhost:8317` và sử dụng một trong các API keys đã cấu hình.
