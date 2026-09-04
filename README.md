# Website Công ty Hòa Hoàng

Website giới thiệu **Công ty TNHH Đầu tư Xây dựng và Dịch vụ Thương mại Hòa Hoàng**
(Hoa Hoang Intra Co., Ltd) — cung cấp và thi công hệ cáp dự ứng lực, gối cầu, khe co giãn
cho công trình hạ tầng giao thông.

Gồm hai phần: trang giới thiệu công khai và **trang quản trị** tại `/admin` để tự cập nhật
nội dung, không cần lập trình viên và không cần build lại.

Stack: **FastAPI + MongoDB (Beanie)** cho backend, **React + Vite** cho frontend,
deploy trên Vercel.

Slogan: **Công nghệ vươn tầm, hợp tác thành công** — hiện ở footer và lưu trong trường
`tagline` của hồ sơ công ty (sửa được ở `/admin`). Logo và favicon ở `frontend/public/`,
cắt từ file gốc trong `docs/brand/`; `logo-full.png` là bản kèm slogan cho ấn phẩm in.

Dữ liệu ban đầu nạp qua `backend/src/services/seed_data.py`: hồ sơ công ty, 11 lĩnh vực
hoạt động, 10 nhóm sản phẩm, 34 dự án (2015–2026), số liệu tài chính 3 năm,
24 khách hàng/nhà sản xuất. Tin tức và tuyển dụng chưa có dữ liệu — hai mục đó tự hiển thị
trạng thái "đang cập nhật" cho tới khi nhập trong trang quản trị.

## Cấu trúc

```
company/
├── api/index.py            # điểm vào Vercel — re-export backend/src/main.py
├── requirements.txt        # deps Python (Vercel cài từ gốc repo)
├── docs/                   # tài liệu nguồn: ĐKKD, hồ sơ năng lực, báo cáo thương hiệu
│   └── brand/              # file logo gốc do bên thiết kế giao
├── backend/src/
│   ├── main.py             # FastAPI app: lifespan, middleware, xử lý lỗi
│   ├── configs/            # BaseSettings: app, mongo, security, storage
│   ├── models/             # schema database (Beanie Document)
│   ├── types/              # kiểu request/response của API
│   ├── repositories/       # tầng truy vấn — chỉ nơi này biết đến MongoDB
│   ├── services/           # nghiệp vụ: nội dung, auth, lưu ảnh, nén ảnh, seed
│   ├── routers/            # endpoint; routers/admin dùng chung một factory CRUD
│   └── utils/logger.py
└── frontend/src/
    ├── lib/                # api client, auth context, hooks, constants (menu, resources)
    ├── components/         # layout (header/footer), ui dùng chung, admin
    ├── pages/              # từng trang một thư mục, kèm _components riêng
    ├── styles/tokens.css   # màu sắc, font, spacing — sửa nhận diện ở đây
    └── app.jsx             # định tuyến
```

## Kiến trúc backend

Phân tầng, mỗi tầng chỉ nói chuyện với tầng ngay dưới:

```
router  →  service  →  repository  →  MongoDB
   ↑                        ↑
 types/                 models/
(API DTO)          (schema database)
```

Ba quy ước quan trọng:

1. **`models/` và `types/` không lẫn nhau.** Nhờ tách đôi mà trường chỉ dành cho database —
   ví dụ `password_hash` — không bao giờ lọt ra API. Collection mới → `models/`;
   body request/response → `types/`.
2. **Chỉ `repositories/` biết đến MongoDB.** Đổi cách truy vấn chỉ sửa một tầng.
3. **Mọi response dùng chung vỏ `BaseApiResponse`** — `{ success, detail, data }`, lỗi cũng
   cùng khuôn và kèm `job_id` để tra log. HTTP status code vẫn giữ đúng ngữ nghĩa.
   Mỗi request được middleware gắn một `job_id` nên lần từ báo lỗi về dòng log rất nhanh.

## Chạy dự án

Cần **hai terminal**, và một MongoDB đang chạy (mặc định `mongodb://localhost:27017`).

```bash
# 1. Backend — cổng 8000
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r ../requirements.txt
cp .env.example .env          # nhớ đặt SECRET_KEY: openssl rand -hex 32
uvicorn src.main:app --reload --port 8000
```

```bash
# 2. Frontend — cổng 5173
cd frontend
npm install
npm run dev
```

- Website: http://localhost:5173 — Trang quản trị: http://localhost:5173/admin
- API docs: http://127.0.0.1:8000/docs — Health check: http://127.0.0.1:8000/health

Lần chạy đầu tiên tự nạp nội dung mẫu và tạo tài khoản admin. Nếu `ADMIN_PASSWORD` để
trống, mật khẩu được sinh ngẫu nhiên và **in ra console đúng một lần** — lưu lại ngay.

Frontend gọi API qua proxy `/api` của Vite nên không cần cấu hình URL khi chạy local;
khi deploy thì đặt `VITE_API_BASE_URL`.

## Trang quản trị

Đăng nhập tại `/admin`, quản lý được: dự án, sản phẩm, lĩnh vực, tin tức, tuyển dụng,
đối tác (thêm/sửa/xoá/ẩn-hiện/đổi thứ tự/tìm kiếm), số liệu tài chính theo năm, hồ sơ công
ty, thông tin liên hệ, hộp thư liên hệ, thư viện ảnh và mật khẩu tài khoản. Thay đổi hiện
ngay trên website.

Quên mật khẩu hoặc thêm tài khoản:

```bash
cd backend && source .venv/bin/activate
python -m scripts.manage_users list
python -m scripts.manage_users reset-password admin@hoahoang.vn
python -m scripts.manage_users create-user nguoimoi@hoahoang.vn
```

Sửa `seed_data.py` **không** tự tới được database đã seed. Ảnh dự án đẩy bằng
`python -m scripts.apply_project_images`; một trường lẻ của hồ sơ công ty (khẩu hiệu, mã số
thuế…) đẩy bằng `python -m scripts.apply_profile_field <tên trường>`. Cả hai đều có
`--dry-run`, và script hồ sơ từ chối ghi các trường dạng danh sách (ban lãnh đạo, mốc lịch
sử…) vì đó là nội dung sửa qua `/admin`.

Thêm một trường mới cho loại nội dung nào đó cần sửa 3 chỗ:
`backend/src/models/<thực_thể>.py` → `backend/src/types/<thực_thể>.py` →
`frontend/src/lib/constants/admin-resources.js`.

## API

Tất cả nằm dưới prefix `/api/v1`, dữ liệu thật nằm ở khoá `data` của `BaseApiResponse`.

| Nhóm | Endpoint |
|---|---|
| Công khai | `/company/{profile,contact-info,financials,partners}`, `/fields`, `/products`, `/projects`, `/news`, `/careers` (kèm `/{slug}`), `POST /contact` |
| Xác thực | `/auth/login`, `/auth/me`, `/auth/change-password` |
| Quản trị (cần Bearer token) | CRUD `/admin/{fields,products,projects,news,careers,financials,partners}` + `/reorder`, `/admin/settings/{profile,contact-info}`, `/admin/messages`, `/admin/uploads` |

Danh sách đầy đủ kèm tham số xem tại `/docs`.

## Ảnh

Chạy local ảnh nằm trong `backend/data/uploads/`, phục vụ qua `/uploads/...`; trên Vercel
thì đẩy lên Blob Storage khi có `BLOB_READ_WRITE_TOKEN`. Hai cách dùng chung giao diện
`StorageService` nên endpoint và frontend không đổi.

Ảnh tải lên (JPG, PNG, GIF, WEBP, ≤ 20 MB) được `image_service.py` xử lý trước khi lưu:
xoay theo EXIF rồi **xoá sạch metadata** (ảnh điện thoại có nhúng toạ độ GPS), thu nhỏ cạnh
dài về ≤ 1600px, nén JPEG progressive và sinh bản thu nhỏ ≤ 480px. Thực đo ảnh 4000×3000:
7,6 MB → 770 KB. Định dạng kiểm bằng magic byte chứ không tin phần mở rộng; SVG bị chặn vì
có thể chứa script. Tên file gắn hash nội dung nên tải trùng ảnh không tạo bản sao.

Nén lại ảnh đã có: `python -m scripts.optimize_images --dry-run` để xem trước, bỏ cờ để
thực hiện (ghi đè tại chỗ nên URL trong database không đổi).

## Giới hạn đã biết

- **SEO**: `use-document-meta.js` đổi `<title>`/`description` phía client, nên crawler không
  chạy JavaScript (Facebook, Zalo) chỉ đọc thẻ tĩnh trong `index.html` — link chia sẻ của
  mọi trang hiện cùng một tiêu đề. Muốn preview riêng từng dự án cần SSR hoặc prerender.
  `robots.txt` đã chặn `/admin`; sitemap chưa tạo vì cần domain thật.
- **Liên hệ mới** chỉ lưu vào DB và hiện ở hộp thư, chưa gửi email thông báo (cần gắn SMTP).
- Cả 34 dự án đều có ảnh thật (87 ảnh). Riêng `cung-cap-vat-tu-thi-cong-cau-2018` chỉ có
  ảnh dạng poster chữ nên vẫn dùng hình vẽ `CardPlaceholder` cho thẻ — poster cắt vào khung
  16:10 thì không đọc được. Cơ chế này khai báo ở `_MONTAGE_ONLY` trong `seed_data.py`.
- Thông tin cá nhân của thành viên góp vốn trong giấy ĐKKD (số định danh, địa chỉ, ngày
  sinh, tỷ lệ góp vốn) **cố ý không đưa lên website**; chỉ giữ tên và chức danh người đại
  diện pháp luật.

## Trước khi deploy

- [ ] Đặt `SECRET_KEY` thật (`openssl rand -hex 32`) — app **từ chối khởi động** ở
      `ENVIRONMENT=production` nếu còn giá trị mặc định
- [ ] Đổi mật khẩu admin, rồi xoá `ADMIN_PASSWORD` khỏi `.env`
- [ ] Cập nhật `BACKEND_CORS_ORIGINS` theo domain thật
- [ ] Chạy sau HTTPS (token JWT nằm trong `localStorage`)
- [ ] Sao lưu định kỳ database MongoDB **và** ảnh đã tải lên
- [ ] Khi tự host: cho nginx phục vụ `/uploads` trực tiếp thay vì qua FastAPI
