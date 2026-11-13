# User Management API

REST API quản lý người dùng, xây dựng bằng **Node.js, Express 5, Sequelize và MySQL**. Dự án tổ chức theo các lớp Route → Controller → Service → Model.

## Chức năng

- Thêm, xem danh sách, xem chi tiết, cập nhật và xóa người dùng.
- Tìm kiếm theo tên hoặc email; hỗ trợ sắp xếp và phân trang.
- Kiểm tra dữ liệu đầu vào bằng Yup và kiểm tra email trùng lặp.
- Băm mật khẩu bằng bcrypt trước khi lưu khi tạo mới hoặc cập nhật mật khẩu người dùng.
- Quản lý cấu trúc cơ sở dữ liệu bằng Sequelize migrations.

## Cài đặt và chạy

**Yêu cầu:** Node.js, npm và MySQL đang hoạt động.

**1. Cài đặt thư viện** tại thư mục gốc dự án:

```bash
npm install
```

**2. Tạo database và chạy migrations:**

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

Bỏ qua `db:create` nếu database đã tồn tại.

**3. Khởi động server:**

```bash
node server.js
```

API sử dụng tiền tố `/api`. Cổng chạy được hiển thị trong terminal khi server khởi động.

Để tự động khởi động lại khi sửa mã nguồn, cài Nodemon rồi sử dụng script có sẵn:

```bash
npm install --save-dev nodemon
npm start
```

## API endpoints

| Phương thức | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/users` | Danh sách người dùng |
| GET | `/api/users/:id` | Chi tiết người dùng |
| POST | `/api/users` | Tạo người dùng |
| PATCH | `/api/users/:id` | Cập nhật người dùng |
| DELETE | `/api/users/:id` | Xóa người dùng |

`GET /api/users` hỗ trợ các query parameters: `q`, `_sort` (mặc định `id`), `_order` (`ASC`), `_page` (`1`) và `_limit` (`2`).

Ví dụ: `GET /api/users?q=Nguyen&_sort=id&_order=DESC`

Body mẫu cho `POST /api/users`, sử dụng `Content-Type: application/json`:

```json
{
  "name": "Nguyen Van An",
  "email": "an@example.com",
  "password": "example123",
  "status": "true"
}
```

## Cấu trúc chính

| Đường dẫn | Vai trò |
| --- | --- |
| `server.js`, `src/app.js` | Khởi động và cấu hình Express |
| `src/routes/` | Khai báo endpoints |
| `src/controllers/` | Xử lý request, validation và response |
| `src/services/` | Xử lý nghiệp vụ và truy vấn dữ liệu |
| `src/models/` | Định nghĩa Sequelize models |
| `src/config/`, `src/database/` | Cấu hình database, migrations và seeders |
| `src/utils/` | Tiện ích phản hồi JSON và băm mật khẩu |

## Trạng thái

Dự án phục vụ học tập và thực hành xây dựng REST API. Chưa triển khai xác thực, phân quyền và kiểm thử tự động.
