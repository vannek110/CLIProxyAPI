# 🔐 HƯỚNG DẪN SỬ DỤNG OAUTH THAY VÌ API KEY

## 📋 Tổng Quan

CLIProxyAPI hỗ trợ **2 phương thức xác thực**:

| Phương thức | Ưu điểm | Nhược điểm |
|-------------|---------|------------|
| **API Key** | Dễ cấu hình, ổn định | Có giới hạn quota |
| **OAuth Login** | Không cần API key, dùng quota của tài khoản Google | Cần đăng nhập lại khi token hết hạn |

---

## 🎯 PHƯƠNG THỨC 1: OAuth Login (Đề Xuất)

### Cách Hoạt Động

```
Bạn đăng nhập Google qua CLIProxyAPI
           ↓
CLIProxyAPI lưu OAuth tokens vào thư mục auths/
           ↓
API sử dụng tokens này thay vì API key
           ↓
Không cần Gemini API key!
```

### Các Bước Thực Hiện

#### Bước 1: Mở Terminal trong Docker Container

```powershell
# Mở shell trong container
docker exec -it cli-proxy-api sh
```

#### Bước 2: Chạy Lệnh Đăng Nhập

Trong container, chạy một trong các lệnh sau tùy theo provider:

**Cho Gemini CLI:**
```bash
./CLIProxyAPI login gemini-cli
```

**Cho AI Studio:**
```bash
./CLIProxyAPI login aistudio
```

**Cho Antigravity:**
```bash
./CLIProxyAPI login antigravity
```

#### Bước 3: Làm Theo Hướng Dẫn Trên Màn Hình

1. Sẽ có một URL được hiển thị
2. Mở URL đó trong trình duyệt
3. Đăng nhập bằng tài khoản Google của bạn
4. Cho phép quyền truy cập
5. Copy authorization code và paste vào terminal

#### Bước 4: Xác Nhận Đăng Nhập Thành Công

```powershell
# Kiểm tra auths đã được tạo
docker exec cli-proxy-api ls -la /root/.cli-proxy-api
```

---

## 🍪 PHƯƠNG THỨC 2: Sử Dụng Cookie (Nâng Cao)

**LƯU Ý:** CLIProxyAPI **KHÔNG hỗ trợ nhập cookie trực tiếp** như __Secure-1PSID.

Tuy nhiên, nếu bạn muốn sử dụng cookies, có một số cách:

### Cách 2.1: Sử Dụng Project Khác (Khuyến Nghị)

Một số project hỗ trợ cookie-based authentication:

1. **[9Router](https://github.com/decolua/9router)** - Next.js implementation, hỗ trợ nhiều format

2. **[Gemini Web API](https://github.com/AIPoweredDev/gemini-web-api)** - Hỗ trợ cookie authentication

### Cách 2.2: Tạo Custom Provider (Nâng Cao)

Nếu bạn biết lập trình, có thể tạo custom provider:

```yaml
# Trong config.yaml
openai-compatibility:
  - name: "gemini-cookie"
    base-url: "YOUR_CUSTOM_ENDPOINT"
    headers:
      Cookie: "__Secure-1PSID=your_cookie_value"
    api-key-entries:
      - api-key: "dummy-key"
    models:
      - name: "gemini-pro"
        alias: "gemini-cookie-pro"
```

**Tuy nhiên**, cần có một endpoint proxy trung gian để chuyển đổi format.

---

## 🔧 CẤU HÌNH HIỆN TẠI CỦA BẠN

### Cookies Bạn Có (Từ Ảnh):

| Cookie | Giá Trị (Đã Che) |
|--------|------------------|
| __Secure-1PAPISID | aBIMDJLMjJVdNYP1/AIMUzJ6MUibApLUxd |
| __Secure-1PSID | g.a0006AiyQACjAB4blvrl0UDPUi28wceny... |
| __Secure-1PSIDCC | AKEyXzU7ZqOA9izUV2sG8SPYQMVu9uN3Kq... |
| __Secure-1PSIDTS | sidts-CjEB7I_69DQ9jT7ukQLuaRalC6PfE... |
| __Secure-3PAPISID | aBIMDJLMjJVdNYP1/AIMUzJ6MUibApLUxd |
| __Secure-3PSID | g.a0006AiyQACjAB4blvrl0UDPUi28wceny... |

### Vấn Đề:
Những cookies này **không thể dùng trực tiếp** với CLIProxyAPI vì:
1. CLIProxyAPI yêu cầu OAuth flow chuẩn
2. Cookies __Secure là session cookies từ trình duyệt
3. Cần có OAuth token (access_token, refresh_token) thay vì session cookies

---

## ✅ GIẢI PHÁP ĐỀ XUẤT

### Tiếp Tục Sử Dụng API Key (Đơn Giản Nhất)

API Key bạn đang dùng hoạt động tốt:
```
AIzaSyCkXUCs5If9lwMkfKvyVngoaN-0Ao_7Jxw
```

Ưu điểm:
- ✅ Đơn giản, ổn định
- ✅ Không cần đăng nhập lại
- ✅ Dễ quản lý

### Hoặc Thêm Tài Khoản OAuth

Nếu bạn muốn thêm nhiều tài khoản:

```powershell
# Đăng nhập OAuth trong container
docker exec -it cli-proxy-api sh -c "./CLIProxyAPI login aistudio"
```

Điều này sẽ:
1. Mở OAuth flow
2. Tự động lưu tokens
3. Kết hợp với API key hiện tại

---

## 📊 SO SÁNH 2 PHƯƠNG THỨC

| Tiêu Chí | API Key | OAuth |
|----------|---------|-------|
| Cài đặt | ⭐⭐⭐⭐⭐ Rất dễ | ⭐⭐⭐ Trung bình |
| Ổn định | ⭐⭐⭐⭐⭐ Rất ổn | ⭐⭐⭐⭐ Tốt |
| Quota | Theo API key | Theo tài khoản Google |
| Bảo mật | Cần bảo vệ key | OAuth an toàn hơn |
| Multi-account | Thêm nhiều keys | Đăng nhập nhiều accounts |

---

## 🚀 HƯỚNG DẪN NHANH - THÊM TÀI KHOẢN OAUTH

```powershell
# 1. Vào container
docker exec -it cli-proxy-api sh

# 2. Đăng nhập (chọn một trong các lệnh sau)
./CLIProxyAPI login aistudio
# hoặc
./CLIProxyAPI login gemini-cli
# hoặc
./CLIProxyAPI login antigravity

# 3. Làm theo hướng dẫn trên màn hình

# 4. Thoát container
exit

# 5. Restart container
docker-compose restart

# 6. Test API
.\test-api.ps1
```

---

## 📚 Tài Liệu Thêm

- CLIProxyAPI Docs: https://help.router-for.me/
- OAuth Setup: https://help.router-for.me/getting-started/
- GitHub: https://github.com/router-for-me/CLIProxyAPI

---

**Bạn muốn tôi hướng dẫn thêm về phương thức nào?**
