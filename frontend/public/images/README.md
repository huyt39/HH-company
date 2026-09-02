# Ảnh dự án

Một thư mục cho mỗi dự án, **tên thư mục đúng bằng `slug`** của dự án trong
`backend/src/services/seed_data.py`. Thư mục còn rỗng (chỉ có `.gitkeep`) là dự án
chưa có ảnh.

Bỏ ảnh gốc vào thư mục tương ứng, dung lượng và định dạng gì cũng được — đừng tự
nén hay đổi tên. Ảnh chỉ hiện lên web sau khi được xử lý và khai báo:

1. Nén, xoá metadata EXIF, sinh bản thu nhỏ, đặt tên kèm hash nội dung.
2. Khai báo `url` / `thumb` / `alt` / `width` / `height` vào `_PROJECT_MEDIA`
   trong `seed_data.py` — ảnh đầu danh sách được dùng làm ảnh bìa.
3. `python -m scripts.apply_project_images` để đẩy vào database đã seed.

Ảnh dùng chung, không thuộc dự án nào cụ thể (`cong-truong/`,
`cao-toc-ben-luc-long-thanh-j2/`…) được tham chiếu trực tiếp từ CSS hoặc JSX.
