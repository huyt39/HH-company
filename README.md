# Website Công ty Hòa Hoàng

Website giới thiệu **Công ty TNHH Đầu tư Xây dựng và Dịch vụ Thương mại Hòa Hoàng**
(Hoa Hoang Intra Co., Ltd) — cung cấp và thi công hệ cáp dự ứng lực, gối cầu, khe co giãn
cho công trình hạ tầng giao thông.

Stack: **FastAPI + MongoDB (Beanie)** (backend) + **React + Vite** (frontend). Giao diện
tham khảo cấu trúc của deoca.vn. Có **trang quản trị** tại `/admin` để tự sửa nội dung.

Nội dung ban đầu trích từ hai tài liệu công ty, nạp vào database qua
`backend/src/services/seed_data.py`:

- Giấy chứng nhận ĐKKD số 0106346833 (thay đổi lần 8, ngày 16/12/2025)
- Hồ sơ năng lực HSNL-HH 2026.06.23 R5
- Nguồn công khai trên web (xem mục *Nguồn tham khảo* bên dưới)

Đã có dữ liệu: hồ sơ công ty, 11 lĩnh vực hoạt động, 10 nhóm sản phẩm, 34 dự án
(2015–2026), số liệu tài chính 3 năm, 24 khách hàng/nhà sản xuất.
Chưa có dữ liệu: **tin tức** và **tuyển dụng** (hai tài liệu nguồn không có nội dung này) —
giao diện hai mục đó tự hiển thị trạng thái "đang cập nhật".

## Cấu trúc

```
company/
├── api/index.py                  # điểm vào Vercel — re-export backend/src/main.py
├── backend/
│   ├── src/
│   │   ├── main.py               # FastAPI app: lifespan, middleware, xử lý lỗi
│   │   ├── configs/              # mỗi mối quan tâm một lớp BaseSettings
│   │   │   ├── app.py            #   tên app, prefix, CORS, môi trường
│   │   │   ├── mongo.py          #   chuỗi kết nối MongoDB
│   │   │   ├── security.py       #   SECRET_KEY, JWT, tài khoản admin khởi tạo
│   │   │   ├── storage.py        #   nơi lưu ảnh (local hay Vercel Blob)
│   │   │   └── constants.py      #   hằng số dùng chung (SETTING_KEY…)
│   │   ├── models/               # 🗄️ schema database (Beanie Document) — CHỈ database
│   │   ├── types/                # 📦 kiểu request/response của API — CHỈ API
│   │   ├── repositories/         # tầng truy vấn; chỉ nơi này biết đến MongoDB
│   │   ├── services/             # nghiệp vụ + client dịch vụ ngoài
│   │   │   ├── content_service.py   # nội dung công khai
│   │   │   ├── auth_service.py      # đăng nhập, đổi mật khẩu
│   │   │   ├── storage_service.py   # lưu ảnh: local ⇄ Vercel Blob cùng một giao diện
│   │   │   ├── image_service.py     # nén ảnh, xoá EXIF, sinh thumbnail
│   │   │   ├── seed_data.py         # 📄 NỘI DUNG trích từ ĐKKD + hồ sơ năng lực
│   │   │   └── seed_service.py      # nạp dữ liệu lần đầu, tạo admin
│   │   ├── routers/              # endpoint; admin/ dùng chung một factory CRUD
│   │   ├── dependencies/         # DI: xác thực Bearer token
│   │   └── utils/logger.py       # logger singleton, có màu, ghi file theo ngày
│   ├── scripts/                  # CLI: manage_users, optimize_images
│   ├── data/uploads/             # ảnh tải lên khi chạy local (gitignored)
│   └── .env.example
├── requirements.txt              # deps Python — Vercel cài từ gốc repo
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.js         # wrapper fetch + toàn bộ endpoint
    │   │   └── useFetch.js       # hook fetch có AbortController
    │   ├── admin/                # 🔐 khu vực quản trị
    │   │   ├── adminApi.js       # fetch có Bearer token, 401 tự đăng xuất
    │   │   ├── AuthContext.jsx   # phiên đăng nhập
    │   │   ├── resources.js      # ⚙️ CẤU HÌNH bảng + form của 7 loại nội dung
    │   │   ├── ResourcePage.jsx  # trang CRUD dùng chung
    │   │   └── pages/            # Dashboard, ProfileEditor, Messages, Account…
    │   ├── components/
    │   │   ├── layout/           # Header (menu + submenu + mobile), Footer, Layout
    │   │   └── ui/               # PageBanner, SectionHeading, Card, Pagination, StateBlock
    │   ├── pages/                # 12 trang, xem bảng route bên dưới
    │   ├── styles/
    │   │   ├── tokens.css        # 🎨 màu sắc, font, spacing — sửa nhận diện ở đây
    │   │   └── global.css        # reset + class dùng chung (.container, .section, .btn…)
    │   └── App.jsx               # định tuyến
    └── vite.config.js            # proxy /api → http://127.0.0.1:8000
```

## Kiến trúc backend

Phân tầng, mỗi tầng chỉ nói chuyện với tầng ngay dưới:

```
router  →  service  →  repository  →  MongoDB
   ↑                        ↑
 types/                 models/
(API DTO)          (schema database)
```

Bốn quy ước quan trọng:

**1. `models/` và `types/` không được lẫn nhau.** `models/` là schema database
(Beanie Document), `types/` là kiểu request/response của API. Nhờ tách đôi mà
trường chỉ dành cho database — ví dụ `password_hash` — không bao giờ lọt ra API.

| Thêm cái gì | Đặt ở đâu |
|---|---|
| Collection mới | `src/models/` |
| Body của request | `src/types/` |
| Body của response | `src/types/` |

**2. Chỉ `repositories/` biết đến MongoDB.** Router và service không gọi thẳng
Beanie. Đổi cách truy vấn (thêm index, đổi bộ lọc, thêm cache) chỉ sửa một tầng.

**3. Mọi response dùng chung một vỏ `BaseApiResponse`:**

```jsonc
{
  "success": true,          // yêu cầu thành công hay không
  "detail": "Danh sách dự án",  // thông báo đọc được cho người dùng
  "data": { }               // payload thật sự
}
```

Lỗi cũng cùng khuôn đó, kèm `job_id` để tra log:

```jsonc
{ "success": false, "detail": "Không tìm thấy dự án", "data": { "job_id": "…" } }
```

HTTP status code vẫn giữ đúng ngữ nghĩa (404, 409, 422, 500) — vỏ response
không thay thế status code.

**4. Mỗi request có một `job_id`.** Middleware gắn UUID vào `request.state.job_id`,
log và response lỗi đều mang mã này, nên lần ngược từ báo lỗi của người dùng về
đúng dòng log rất nhanh.

## Chạy dự án

Cần **hai terminal**.

### 1. Backend (cổng 8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
cp .env.example .env          # nhớ đặt SECRET_KEY: openssl rand -hex 32
uvicorn src.main:app --reload --port 8000
```

Cần một MongoDB đang chạy (mặc định `mongodb://localhost:27017`).
Lần chạy đầu tiên sẽ nạp nội dung mẫu và tạo tài khoản admin.
Nếu `ADMIN_PASSWORD` trong `.env` để trống, mật khẩu được sinh ngẫu nhiên và
**in ra console đúng một lần** — lưu lại ngay.

- API docs (Swagger): http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

### 2. Frontend (cổng 5173)

```bash
cd frontend
npm install
npm run dev
```

- Website: http://localhost:5173
- Trang quản trị: http://localhost:5173/admin

## Trang quản trị

Đăng nhập tại `/admin`. Quản lý được:

| Mục | Thao tác |
|---|---|
| Dự án, Sản phẩm, Lĩnh vực, Tin tức, Tuyển dụng, Đối tác | thêm / sửa / xoá / ẩn-hiện / đổi thứ tự / tìm kiếm |
| Số liệu tài chính | thêm sửa xoá theo năm |
| Hồ sơ công ty | thông tin chung, đoạn giới thiệu, ban lãnh đạo, cơ cấu tổ chức, mốc lịch sử |
| Thông tin liên hệ | địa chỉ, điện thoại, email, link bản đồ |
| Hộp thư liên hệ | đọc, đánh dấu đã đọc, trả lời qua email, xoá |
| Ảnh | tải lên, chọn lại từ thư viện, đặt mô tả (alt), sắp xếp thư viện ảnh dự án |
| Tài khoản | đổi mật khẩu |

Nội dung lưu thay đổi hiện **ngay lập tức** trên website, không cần build lại.
Bấm nhãn “Đang hiện / Đang ẩn” trong bảng để bật tắt nhanh mà không mở form.

**Quên mật khẩu / thêm tài khoản:**

```bash
cd backend && source .venv/bin/activate
python -m scripts.manage_users list
python -m scripts.manage_users reset-password admin@hoahoang.vn   # tự sinh mật khẩu
python -m scripts.manage_users create-user nguoimoi@hoahoang.vn
```

**Thêm trường mới cho một loại nội dung** cần sửa 3 chỗ:
trường trong `backend/src/models/<thực_thể>.py` → trường trong
`backend/src/types/<thực_thể>.py` → mục trong `frontend/src/admin/resources.js`.

> Frontend gọi API qua proxy `/api` của Vite nên **không cần** cấu hình URL khi chạy local.
> Khi deploy, đặt `VITE_API_BASE_URL` trong file `.env` của frontend.

## Các trang & route

| Đường dẫn | Trang | Nguồn dữ liệu |
|---|---|---|
| `/` | Trang chủ | `/fields`, `/projects`, `/news`, `/company/financials`, `/company/partners` |
| `/gioi-thieu` | Tổng quan, tầm nhìn, ban lãnh đạo, sơ đồ tổ chức, lịch sử | `/company/profile`, `/company/partners` |
| `/linh-vuc` | Lĩnh vực hoạt động | `/fields` |
| `/du-an` | 34 dự án, nhóm theo năm, lọc trạng thái | `/projects` |
| `/du-an/:slug` | Chi tiết dự án | `/projects/{slug}` |
| `/tin-tuc` | Danh sách tin tức (có phân trang) | `/news` |
| `/tin-tuc/:slug` | Chi tiết bài viết | `/news/{slug}` |
| `/san-pham` | Danh mục 10 nhóm sản phẩm | `/products` |
| `/nang-luc-tai-chinh` | Số liệu tài chính 3 năm | `/company/financials` |
| `/tuyen-dung` | Danh sách tuyển dụng | `/careers` |
| `/tuyen-dung/:slug` | Chi tiết vị trí | `/careers/{slug}` |
| `/lien-he` | Liên hệ + form gửi tin | `/company/contact-info`, `POST /contact` |
| `*` | 404 | — |

## API endpoints

Tất cả nằm dưới prefix `/api/v1`, và mọi response đều bọc trong
`BaseApiResponse` (xem *Kiến trúc backend*) — dữ liệu thật nằm ở khoá `data`.

| Method | Path | Mô tả |
|---|---|---|
| GET | `/company/profile` | Hồ sơ công ty (tầm nhìn, sứ mệnh, mốc lịch sử) |
| GET | `/company/contact-info` | Địa chỉ, điện thoại, email, MST |
| GET | `/company/financials` | Số liệu tài chính 3 năm gần nhất |
| GET | `/company/partners` | Khách hàng và nhà sản xuất — lọc `role` |
| GET | `/fields` | Danh sách lĩnh vực hoạt động |
| GET | `/products` | Danh mục nhóm sản phẩm |
| GET | `/products/{slug}` | Chi tiết nhóm sản phẩm |
| GET | `/projects` | Danh sách dự án — `page`, `page_size`, `status` |
| GET | `/projects/{slug}` | Chi tiết dự án |
| GET | `/news` | Danh sách tin tức — `page`, `page_size`, `category` |
| GET | `/news/{slug}` | Chi tiết bài viết |
| GET | `/careers` | Danh sách tin tuyển dụng |
| GET | `/careers/{slug}` | Chi tiết vị trí |
| POST | `/contact` | Nhận thông tin liên hệ (lưu vào DB) |

Nhóm quản trị — **mọi endpoint yêu cầu Bearer token**:

| Method | Path | Mô tả |
|---|---|---|
| POST | `/auth/login` | Đăng nhập, trả JWT |
| GET | `/auth/me` | Tài khoản hiện tại |
| POST | `/auth/change-password` | Đổi mật khẩu |
| CRUD | `/admin/{fields,products,projects,news,careers,financials,partners}` | list / create / read / update / delete |
| POST | `/admin/{resource}/reorder` | Sắp xếp lại thứ tự hiển thị |
| GET PUT | `/admin/settings/{profile,contact-info}` | Hồ sơ công ty, thông tin liên hệ |
| GET PATCH DELETE | `/admin/messages` | Hộp thư liên hệ |
| POST GET DELETE | `/admin/uploads` | Tải ảnh (tự nén + sinh thumbnail), thư viện, xoá |

## Ảnh

Chạy local: ảnh nằm trong `backend/data/uploads/`, phục vụ tĩnh qua `/uploads/...`.
Trên Vercel: có `BLOB_READ_WRITE_TOKEN` thì ảnh được đẩy lên Vercel Blob Storage.
Hai cách dùng chung một giao diện `StorageService`, endpoint và frontend không đổi.
Tải lên trong trang quản trị (JPG, PNG, GIF, WEBP, tối đa 20 MB). Định dạng được kiểm bằng magic byte chứ
không tin phần mở rộng; SVG bị chặn vì có thể chứa script. Tên file gắn hash nội dung
nên tải cùng một ảnh hai lần không tạo bản sao.

### Xử lý tự động khi tải lên

`backend/src/services/image_service.py` xử lý mọi ảnh trước khi lưu:

| Bước | Lý do |
|---|---|
| Xoay theo cờ EXIF Orientation rồi bỏ cờ | ảnh dọc từ điện thoại không bị nằm ngang |
| **Xoá toàn bộ metadata EXIF** | ảnh điện thoại nhúng toạ độ GPS và model máy — không nên public |
| Thu nhỏ cạnh dài về ≤ 1600px | ảnh 4000px vài MB làm trang tải rất chậm |
| Nén JPEG quality 82, progressive | giảm dung lượng, ảnh hiện dần khi tải |
| Sinh bản thu nhỏ ≤ 480px | dùng cho thẻ dự án và danh sách |

Thực đo với ảnh 4000×3000 từ điện thoại: **7,6 MB → 770 KB (giảm 90%)**, thumbnail 39 KB.

Hai điểm cần biết:

- Ảnh chỉ vượt giới hạn chút ít (ví dụ 1652px) thì **không** thu nhỏ, vì tái mã hoá từ
  nguồn đã nén chỉ làm file phình ra mà không tiết kiệm gì.
- Nếu bản đã xử lý nặng hơn bản gốc thì giữ nguyên bản gốc.
- GIF động được giữ nguyên (thu nhỏ sẽ làm mất animation).

### Nén lại ảnh đã có

```bash
cd backend && source .venv/bin/activate
python -m scripts.optimize_images --dry-run   # xem trước sẽ tiết kiệm bao nhiêu
python -m scripts.optimize_images             # thực hiện
```

Ghi đè tại chỗ nên URL trong database không đổi; script tự bổ sung khoá `thumb`
vào các bản ghi `cover`/`gallery`.

**38 ảnh thi công** (đã nén, 29 ảnh có bản thu nhỏ) được trích từ hồ sơ năng lực (`pdfimages`) và gắn cho 10 dự án:
Xóm Củi, Trà Khúc 2, Móng Sến, Giới Phiên, Phú Thịnh, Sông Vân, Đại Ngãi 2, Nhơn Trạch,
Phong Châu mới, Nguyễn Hữu Cảnh. Logo công ty ở `frontend/public/logo.png` (kèm favicon).

24 dự án còn lại chưa có ảnh — hồ sơ năng lực không có ảnh cho các dự án đó.

## SEO — giới hạn cần biết

`frontend/src/utils/useDocumentMeta.js` đổi `<title>` và `description` theo từng trang,
nhưng **chạy phía client**. Crawler không thực thi JavaScript (Facebook, Zalo, Twitter)
chỉ đọc được thẻ tĩnh trong `index.html`, nên link chia sẻ của mọi trang sẽ hiện cùng một
tiêu đề và mô tả chung. Muốn preview riêng cho từng dự án/bài viết thì cần SSR
(Next.js / Remix) hoặc prerender lúc build — đây là việc lớn, chưa làm.

`robots.txt` đã chặn `/admin`. Sitemap chưa tạo vì cần domain thật.

## Nguồn tham khảo

Phần **"Bối cảnh dự án"** trên trang chi tiết của 8 dự án được tổng hợp từ nguồn tin công
khai và tách bạch rõ với phạm vi công việc của Hòa Hoàng. Mỗi mục đều kèm link nguồn
(trường `context_source` trong `seed_data.py`):

| Dự án | Nguồn |
|---|---|
| Đường sắt tốc độ cao Hà Nội – Quảng Ninh | vingroup.net |
| Cầu Phong Châu mới – QL32C | moc.gov.vn (Bộ Xây dựng) |
| Cầu Đại Ngãi 2 | thanhnien.vn |
| Cầu Nhơn Trạch – Vành đai 3 | vnexpress.net |
| Cầu Móng Sến | vnexpress.net |
| Cầu Giới Phiên | baogiaothong.vn |
| Cầu Long Thành (khe co giãn) | vnexpress.net |
| Cầu Máy Chai | chưa có nguồn chính thống — **cần rà soát** |

Ngoài ra, các trường `status`, `employees`, `main_business_line`, `business_lines_count`
trong hồ sơ công ty lấy từ masothue.com và topcv.vn — **cần công ty xác nhận**.

## Nội dung KHÔNG đưa lên web

Giấy ĐKKD có thông tin cá nhân của hai thành viên góp vốn (số định danh cá nhân, địa chỉ
căn hộ, ngày sinh, tỷ lệ góp vốn). **Cố ý không đưa vào website** vì đây là dữ liệu cá nhân,
không phù hợp công bố công khai. Chỉ giữ tên và chức danh người đại diện pháp luật.

## Bước tiếp theo

1. **Bổ sung ảnh thật** — hồ sơ năng lực có nhiều ảnh thi công (cầu Xóm Củi, Móng Sến,
   Tân Đệ, Giới Phiên, Phú Thịnh, Sông Vân, Đại Ngãi 2, Nhơn Trạch, kè sông Cái…) và logo
   công ty. Đặt vào `frontend/public/`, khai báo `cover`/`gallery` trong `seed_data.py`,
   giao diện tự hiển thị thay cho `.media-placeholder`.
2. **Kiểm tra lại nội dung** — số liệu và tên riêng do mình trích từ PDF, cần người trong
   công ty rà soát trước khi công bố.
3. **Tin tức & tuyển dụng** — chưa có dữ liệu, nhập trực tiếp trong trang quản trị.
4. **Gửi email khi có liên hệ mới** — hiện tin nhắn chỉ lưu vào DB và hiện ở hộp thư,
   không có thông báo. Cần gắn SMTP nếu muốn nhận mail.
6. **Chuyển sang PostgreSQL** khi lên production — đổi `DATABASE_URL`, thêm Alembic
   để quản lý migration (hiện dùng `create_all`, không có migration).
7. **SEO** — thêm react-helmet cho meta tag từng trang.

## Trước khi deploy

- [ ] Đặt `SECRET_KEY` thật (`openssl rand -hex 32`) — app sẽ **từ chối khởi động**
      ở `ENVIRONMENT=production` nếu còn giá trị mặc định
- [ ] Đổi mật khẩu admin khỏi giá trị trong `.env`, rồi xoá `ADMIN_PASSWORD`
- [ ] Cập nhật `BACKEND_CORS_ORIGINS` theo domain thật
- [ ] Chạy backend sau HTTPS (token JWT nằm trong `localStorage`)
- [ ] Sao lưu định kỳ database MongoDB **và** ảnh đã tải lên
- [ ] Khi tự host: cho nginx phục vụ `/uploads` trực tiếp thay vì qua FastAPI.
      Trên Vercel không cần — ảnh nằm trên Blob Storage với URL tuyệt đối.
