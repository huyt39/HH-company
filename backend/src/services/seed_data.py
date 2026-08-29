"""Seed content, taken from the company registration and capability profile.

Sources:
  - Business registration no. 0106346833, 8th amendment, 2025-12-16.
  - Capability profile HSNL-HH 2026.06.23 R5 (Hanoi, 2026).

Loaded once into an empty database (see `src/services/seed_service.py`); after
that the admin UI is the source of truth, not this file.

Uses the `*Create` types rather than response types because these records have
no id yet — MongoDB assigns it on insert.
"""

from src.types import (
    BusinessFieldCreate,
    CompanyMilestone,
    CompanyProfile,
    ContactInfo,
    FinancialCreate,
    Leader,
    OrgUnit,
    PartnerCreate,
    ProductCreate,
    ProjectCreate,
)

# --------------------------------------------------------------------------- #
# Company profile
# --------------------------------------------------------------------------- #

COMPANY_PROFILE = CompanyProfile(
    name="Công ty TNHH Đầu tư Xây dựng và Dịch vụ Thương mại Hòa Hoàng",
    name_en="Hoa Hoang Construction Investment and Trade Service Company Limited",
    short_name="HOA HOANG INTRA CO., LTD",
    tagline="Cáp dự ứng lực — Gối cầu — Khe co giãn cho công trình hạ tầng giao thông",
    tax_code="0106346833",
    established="Tháng 10 năm 2013",
    charter_capital="6.000.000.000 VNĐ (Sáu tỷ đồng)",
    status="Đang hoạt động",
    employees="25 – 99 nhân sự",
    main_business_line="4212 — Xây dựng công trình đường bộ",
    business_lines_count=41,
    intro=[
        "Công ty TNHH Đầu tư xây dựng và dịch vụ thương mại Hòa Hoàng (Hoa Hoang Intra "
        "Co., Ltd) là đơn vị chuyên cung cấp và thi công lắp đặt hệ cáp neo dự ứng lực "
        "ngoài, neo dự ứng lực trong, hệ cáp cho cầu dây võng, dây văng và cầu vòm, gối "
        "cầu các loại, khe co giãn các loại cùng những thiết bị liên quan cho các dự án "
        "hạ tầng giao thông tại Việt Nam từ năm 2014 (trước đây công ty mang tên TCC).",
        "Chúng tôi phân phối sản phẩm của các thương hiệu hàng đầu Trung Quốc, cáp hãng "
        "SHINKO Nhật Bản, cáp và gối hãng Hirun của Italy. Các sản phẩm này đã được sử "
        "dụng cho nhiều dự án cầu đường bộ và tuyến cao tốc trọng điểm: cao tốc Sài Gòn "
        "– Long Thành – Dầu Giây, Bến Lức – Long Thành, Hà Nội – Lào Cai, cầu Móng Sến "
        "– Sa Pa, cầu Tân Đệ, cầu Nguyễn Hữu Cảnh, cầu Trà Khúc 2, cầu Xóm Củi, cầu "
        "Nhơn Trạch, cầu Đại Ngãi 2 và nhiều công trình khác.",
        "Hòa Hoàng đang hợp tác với các Viện thiết kế đường sắt Trung Quốc và các nhà "
        "máy cung cấp thiết bị thi công đường sắt cao tốc, phối hợp cùng chuyên gia để "
        "cung cấp thiết bị và tư vấn chuyển giao công nghệ thi công kết cấu hạ tầng "
        "đường sắt tốc độ cao cũng như tàu điện ngầm.",
    ],
    vision=(
        "Trở thành nhà cung cấp hàng đầu Việt Nam về hệ cáp dự ứng lực, gối cầu và khe "
        "co giãn cho công trình cầu đường, đồng thời làm chủ công nghệ thi công đường "
        "sắt tốc độ cao và hầm bằng máy TBM."
    ),
    mission=(
        "Cung cấp vật tư đạt chuẩn quốc tế cùng dịch vụ kỹ thuật tận nơi, cam kết chất "
        "lượng sản phẩm và thời gian giao hàng, đáp ứng tiến độ thi công của dự án."
    ),
    core_values=[
        "Chất lượng sản phẩm đạt tiêu chuẩn ASTM, ISO và tiêu chuẩn dự án",
        "Đáp ứng đúng tiến độ giao hàng và thi công",
        "Dịch vụ kỹ thuật và hỗ trợ hiện trường xuyên suốt",
        "Minh bạch trong hồ sơ pháp lý, xuất xứ và thí nghiệm vật liệu",
    ],
    leaders=[
        Leader(name="Bà Vũ Bảo Ngọc", title="Chủ tịch Hội đồng thành viên, người đại diện pháp luật"),
        Leader(name="Ông Nguyễn Xuân Thắng", title="Tổng giám đốc điều hành"),
    ],
    org_units=[
        OrgUnit(name="Tổng giám đốc", name_en="General Manager"),
        OrgUnit(name="Phòng Kế toán", name_en="Accounting Dept."),
        OrgUnit(name="Phòng Hành chính", name_en="Administration Dept."),
        OrgUnit(name="Phòng Kinh doanh", name_en="Marketing Dept."),
        OrgUnit(name="Phòng Kỹ thuật", name_en="Technical Dept."),
        OrgUnit(name="Phòng Dự án", name_en="Project Dept."),
        OrgUnit(name="Phòng Dịch vụ", name_en="Service Dept.", children=["Kho sản phẩm"]),
    ],
    milestones=[
        CompanyMilestone(
            year=2013,
            title="Thành lập công ty",
            description="Đăng ký doanh nghiệp lần đầu ngày 25/10/2013, mã số 0106346833.",
        ),
        CompanyMilestone(
            year=2014,
            title="Tham gia thị trường hạ tầng giao thông",
            description="Bắt đầu cung cấp vật tư cho các dự án cầu đường bộ và cao tốc tại Việt Nam.",
        ),
        CompanyMilestone(
            year=2015,
            title="Dự án gối cầu đầu tiên",
            description="Cung cấp gối chậu cho cầu vượt đường Hoàng Minh Giám, Hà Nội.",
        ),
        CompanyMilestone(
            year=2021,
            title="Cầu Móng Sến — cầu cạn cao nhất Việt Nam",
            description="Lắp đặt và căng kéo 190 tấn cáp dự ứng lực cho dầm cầu liên tục.",
        ),
        CompanyMilestone(
            year=2023,
            title="Tham gia dự án vốn ODA",
            description="Cung cấp cáp dự ứng lực ngoài cho Vành đai 3 TP. Hồ Chí Minh (hiệp định vay VNM-58).",
        ),
        CompanyMilestone(
            year=2025,
            title="Các dự án trọng điểm quốc gia",
            description="Cầu Phong Châu mới, cầu Đại Ngãi 2, cầu Nhơn Trạch, cầu Máy Chai.",
        ),
        CompanyMilestone(
            year=2026,
            title="Đường sắt tốc độ cao",
            description="Được chấp thuận là nhà cung cấp gối cầu cho tuyến đường sắt tốc độ cao Hà Nội – Quảng Ninh.",
        ),
    ],
)

CONTACT_INFO = ContactInfo(
    address=(
        "Tầng 23, Tòa nhà hỗn hợp MD Complex Tower, Khu đô thị Mỹ Đình 1, "
        "Phường Từ Liêm, Thành phố Hà Nội, Việt Nam"
    ),
    phone="024 2200 8708",
    email="vnhoahoang@gmail.com",
    tax_code="0106346833",
    map_embed_url=None,
)

# --------------------------------------------------------------------------- #
# Business fields (section 6 of the capability profile)
# --------------------------------------------------------------------------- #

_FIELDS: list[tuple[str, str, str, str]] = [
    (
        "duong-sat-toc-do-cao",
        "Chuyển giao công nghệ đường sắt tốc độ cao",
        "Chuyển giao công nghệ thi công dầm đường sắt tốc độ cao và công nghệ thi công "
        "hầm bằng máy TBM; cung cấp thiết bị thi công đồng bộ.",
        "◈",
    ),
    (
        "he-cap-cau",
        "Hệ cáp cho cầu dây văng, cầu vòm, cầu treo",
        "Nhập khẩu và thi công hệ cáp treo, cáp giằng cho cầu vòm, hệ cáp dây văng cho "
        "cầu dây văng và cầu extradosed, hệ cáp chủ và cáp treo cho cầu dây võng.",
        "◇",
    ),
    (
        "cap-dul-ngoai",
        "Hệ cáp dự ứng lực ngoài",
        "Nhập khẩu và thi công hệ cáp dự ứng lực ngoài cho các cầu dầm hộp; cung cấp "
        "cáp DƯL cho dự án xây dựng cầu đường.",
        "◆",
    ),
    (
        "goi-cau-duong-bo",
        "Gối cầu đường bộ và cao tốc",
        "Nhập khẩu, thi công lắp đặt các loại gối cầu cao su, gối chậu cao su và gối "
        "thép (gối chậu, gối chỏm cầu) cho dự án cầu đường bộ và đường cao tốc.",
        "▣",
    ),
    (
        "goi-cau-duong-sat",
        "Gối cầu đường sắt",
        "Nhập khẩu và thi công lắp đặt gối thép (gối chậu, gối chỏm cầu) cho các dự án "
        "đường sắt và đường sắt đô thị.",
        "▤",
    ),
    (
        "goi-cao-su-ben-cang",
        "Gối cao su chống va chạm bến cảng",
        "Nhập khẩu và thi công lắp đặt các loại gối cao su chống va chạm phục vụ dự án "
        "bến cảng.",
        "▥",
    ),
    (
        "khe-co-gian",
        "Khe co giãn",
        "Nhập khẩu và thi công lắp đặt các loại khe co giãn (loại thép, nhôm) cho dự án "
        "đường bộ, đường sắt và đường sắt trên cao.",
        "▦",
    ),
    (
        "neo-cang-keo",
        "Sản phẩm neo căng kéo",
        "Nhập khẩu và kinh doanh các sản phẩm neo căng kéo phục vụ công trình xây dựng: "
        "neo chủ động, neo cố định, neo dẹt, neo nối, neo công cụ.",
        "◉",
    ),
    (
        "may-moc-thiet-bi",
        "Máy móc thiết bị xây dựng",
        "Nhập khẩu và kinh doanh máy móc thiết bị xây dựng: bơm thủy lực, kích thủy "
        "lực, máy bơm vữa, máy trộn vữa và các thiết bị liên quan.",
        "⚙",
    ),
    (
        "sua-chua-cau-cu",
        "Thi công, tăng cường và sửa chữa cầu cũ",
        "Thi công, tăng cường hoặc sửa chữa cầu cũ; nhập khẩu và lắp đặt phao nổi chống "
        "va xô cho trụ cầu.",
        "⚒",
    ),
    (
        "dich-vu-ky-thuat",
        "Dịch vụ kỹ thuật và hỗ trợ",
        "Dịch vụ kỹ thuật và hỗ trợ hiện trường cho các sản phẩm được nhà sản xuất ủy "
        "quyền, bao gồm hướng dẫn lắp đặt và nghiệm thu.",
        "◐",
    ),
]

BUSINESS_FIELDS = [
    BusinessFieldCreate(slug=slug, name=name, description=desc, icon=icon)
    for (slug, name, desc, icon) in _FIELDS
]

# --------------------------------------------------------------------------- #
# Product groups ("Các sản phẩm cung cấp" section of the capability profile)
# --------------------------------------------------------------------------- #

_PRODUCTS: list[dict] = [
    {
        "slug": "cap-thanh-pham-cau-day-vang",
        "name": "Cáp thành phẩm cho cầu dây văng, cầu vòm, cầu treo dây võng",
        "description": "Bó cáp thành phẩm dùng sợi thép mạ kẽm loại song song (PWS), ép đùn HDPE hai lớp, hai đầu bó chế tạo kiểu neo hệ bắt đai ốc.",
        "specs": ["Loại PWS: 31W7, 35W7, 49W7, 55W7", "Ép đùn HDPE 2 lớp", "Neo hệ bắt đai ốc"],
        "applications": ["Cầu dây văng", "Cầu vòm ống thép", "Cầu treo dây võng"],
        "icon": "◇",
    },
    {
        "slug": "cap-epoxy-hdpe",
        "name": "Cáp mạ kẽm / ép đùn epoxy có vỏ bọc HDPE",
        "description": "Cáp thành phẩm mạ kẽm hoặc ép đùn epoxy từng tao, bọc HDPE cả bó, dùng cho hệ cáp ngoài.",
        "specs": ["Bọc epoxy từng tao + HDPE cả bó", "Bó 3T, 7T, 15T, 18T, 19T, 22T-15.2"],
        "applications": ["Cầu đúc hẫng", "Cầu vòm dây treo", "Cầu extradosed"],
        "icon": "◆",
    },
    {
        "slug": "cap-du-ung-luc",
        "name": "Cáp dự ứng lực (PC Strand)",
        "description": "Cáp trần, cáp mạ kẽm, cáp ép đùn epoxy và cáp có vỏ bọc HDPE.",
        "specs": [
            "Đường kính: 2.9 / 9.5 / 11.1 / 12.7 / 15.2 / 15.7 mm",
            "Lớp phủ epoxy FECSxx-G, FECSxx-GP, FECSxx-B",
            "Cáp phun epoxy theo ASTM A822/A822M",
        ],
        "applications": ["Dầm cầu dự ứng lực", "Kết cấu bê tông dự ứng lực"],
        "icon": "≡",
    },
    {
        "slug": "neo-du-ung-luc",
        "name": "Neo dự ứng lực",
        "description": "Hệ neo đồng bộ cho công tác căng kéo cáp dự ứng lực.",
        "specs": ["Bộ neo chủ động", "Bộ neo cố định (đầu ép chết)", "Neo dẹt", "Neo nối", "Neo công cụ"],
        "applications": ["Dầm cầu", "Hệ cáp DƯL ngoài", "Neo đất, neo mái dốc"],
        "icon": "◉",
    },
    {
        "slug": "goi-cau",
        "name": "Gối cầu các loại",
        "description": "Gối cầu cho đường bộ, cao tốc, đường sắt và đường sắt đô thị, gồm cả các loại gối công năng đặc biệt.",
        "specs": [
            "Gối chậu, gối chỏm cầu, gối bản cao su, gối cao su chì",
            "Gối cách ly địa chấn, gối chống nhổ, gối chống gió, gối khóa tốc độ",
            "Gối chỏm cầu chống ăn mòn khí hậu biển loại HFQZ",
            "Gối chỏm cầu thép giảm chấn tải trọng thẳng đứng tới 24.650 tấn",
            "Gối bi cho cầu quay, gối cho đường sắt đô thị",
        ],
        "applications": ["Cầu đường bộ, cao tốc", "Cầu đường sắt", "Cầu giàn thép, cầu quay"],
        "icon": "▣",
    },
    {
        "slug": "khe-co-gian",
        "name": "Khe co giãn các loại",
        "description": "Khe co giãn ray thép mô đun và khe răng lược cho cầu đường bộ, đường sắt.",
        "specs": [
            "Khe ray thép mô đun loại SSFB",
            "Khe ray LR27 (SSFC2160) độ chuyển tới 2.160 mm",
            "Khe răng lược loại cân bằng và loại lệch tâm",
            "Khe cho đường sắt nhẹ và đường sắt trên cao",
        ],
        "applications": ["Cầu đường bộ", "Cầu đường sắt", "Đường sắt trên cao"],
        "icon": "▦",
    },
    {
        "slug": "thiet-bi-cang-keo",
        "name": "Thiết bị căng kéo dự ứng lực",
        "description": "Thiết bị phục vụ công tác căng kéo tại hiện trường.",
        "specs": ["Máy bơm thủy lực (hệ thống bơm thông minh)", "Kích thủy lực", "Máy bơm vữa, máy trộn vữa"],
        "applications": ["Thi công căng kéo cáp DƯL", "Bơm vữa ống ghen"],
        "icon": "⚙",
    },
    {
        "slug": "neo-dat-mai-doc",
        "name": "Cấu kiện hệ neo đất ổn định mái dốc",
        "description": "Các cấu kiện sản phẩm cho hệ neo đất, ổn định mái dốc và kè.",
        "specs": ["Bó cáp giằng neo bờ kè", "Neo hệ bắt đai ốc"],
        "applications": ["Gia cố mái dốc", "Kè đê sông", "Công trình cảng biển"],
        "icon": "▲",
    },
    {
        "slug": "thiet-bi-duong-sat",
        "name": "Thiết bị cho cầu đường sắt",
        "description": "Thiết bị chuyên dụng phục vụ thi công và bảo trì đường sắt.",
        "specs": ["Máy hàn ray", "Máy chèn đường"],
        "applications": ["Thi công đường sắt", "Bảo trì tuyến"],
        "icon": "▬",
    },
    {
        "slug": "thiet-bi-duong-sat-cao-toc",
        "name": "Thiết bị thi công đường sắt cao tốc và hầm TBM",
        "description": "Cung cấp thiết bị và chuyển giao công nghệ thi công dầm đường sắt tốc độ cao, thi công hầm bằng máy TBM.",
        "specs": [
            "Cẩu bánh lốp 900 tấn (cẩu phiến dầm 31,5 m nặng 750–900 tấn)",
            "Giá cẩu long môn 2×100 T cho lồng cốt thép",
            "Bộ ván khuôn dầm tiêu chuẩn dài 31,5 m cao 3 m",
            "Dụng cụ móc treo cẩu lồng cốt thép chịu tải 100 tấn",
        ],
        "applications": ["Đường sắt tốc độ cao", "Hầm đường sắt / tàu điện ngầm"],
        "icon": "◈",
    },
]

PRODUCTS = [ProductCreate(**p) for p in _PRODUCTS]

# --------------------------------------------------------------------------- #
# Delivered and ongoing projects.
# Source: the "CÁC DỰ ÁN ĐÃ CUNG CẤP VÀ THI CÔNG" table plus 2025–2026 acceptance letters.
# --------------------------------------------------------------------------- #

# (slug, name, year, client, location, scope, status)
_PROJECTS: list[tuple[str, str, int, str, str, str, str]] = [
    (
        "duong-sat-toc-do-cao-ha-noi-quang-ninh",
        "Đường sắt tốc độ cao Hà Nội – Quảng Ninh — cầu vượt sông Đuống và các cầu vượt trên tuyến",
        2026,
        "Công ty TNHH Thương mại và Xây dựng Trung Chính (HĐ 0602/2026/ĐV/HĐ/VINSPEED-LDSGCTC)",
        "Hà Nội – Bắc Ninh",
        "Được chấp thuận là nhà cung cấp gối cầu cho hạng mục thi công cầu vượt sông Đuống Km016+168 và các cầu vượt quy hoạch trên tuyến.",
        "in_progress",
    ),
    (
        "cau-giai-phong-9-rach-gia",
        "Cầu Giải Phóng 9, thành phố Rạch Giá",
        2026,
        "Liên danh Công ty TNHH Trường Phát và CTCP ĐTXD Công nghệ mới Phúc Tấn",
        "Rạch Giá, Kiên Giang",
        "Được Tư vấn giám sát chấp thuận là đơn vị cung cấp gối cầu cho Gói thầu số 03 — thi công xây dựng cầu.",
        "in_progress",
    ),
    (
        "cau-long-thanh-khe-co-gian-p26",
        "Sửa chữa khe co giãn trụ P26 Km12+907 cầu Long Thành, cao tốc TP. Hồ Chí Minh – Long Thành – Dầu Giây",
        2025,
        "Tổng Công ty Đầu tư phát triển đường cao tốc Việt Nam (VEC)",
        "TP. Hồ Chí Minh – Đồng Nai",
        "Cung cấp, sửa chữa và lắp đặt khe co giãn mô đun SSFB320.",
        "completed",
    ),
    (
        "cau-song-rang-long-son-cai-mep",
        "Đường Long Sơn – Cái Mép, hạng mục cầu Sông Rạng",
        2025,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)",
        "TP. Vũng Tàu và TX. Phú Mỹ, Bà Rịa – Vũng Tàu",
        "Cung cấp và thi công hệ cáp treo cầu vòm thép: cáp treo 11 tấn, 195 bộ neo cáp, 337 m ống thép inox D89.",
        "completed",
    ),
    (
        "cau-can-giuoc-thay-he-cap",
        "Thay thế hệ cáp cầu vòm cầu Cần Giuộc, tuyến SF đường Nguyễn Văn Linh",
        2025,
        "Công ty TNHH Phát triển Phú Mỹ Hưng",
        "TP. Hồ Chí Minh",
        "Cung cấp và thi công hệ cáp giằng 51 tấn và cáp treo 10 tấn.",
        "completed",
    ),
    (
        "cau-phong-chau-moi-ql32c",
        "Thi công xây dựng cầu Phong Châu mới – QL32C",
        2025,
        "Tổng Công ty Xây dựng Trường Sơn — Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Tỉnh Phú Thọ",
        "Cung cấp và hướng dẫn lắp đặt gối chậu nhịp chính: 6 gối 3.250 T và 6 gối 550 T.",
        "completed",
    ),
    (
        "cau-may-chai-vu-yen",
        "Đầu tư xây dựng cầu Máy Chai, đảo Vũ Yên",
        2025,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Hải Phòng",
        "Cung cấp khe co giãn dạng ray mô đun, độ dịch chuyển 380–740 mm, tổng chiều dài 18,85 m.",
        "completed",
    ),
    (
        "cau-nhon-trach-vanh-dai-3",
        "Dự án thành phần 1A đoạn Tân Vạn – Nhơn Trạch giai đoạn 1, đường Vành đai 3 TP. Hồ Chí Minh — cầu Nhơn Trạch",
        2025,
        "CTCP Xây dựng Đạt Phương số 2 — CTCP Xây dựng công trình 525 — CTCP ĐTXD Thương mại Trường Thành",
        "TP. Hồ Chí Minh – Đồng Nai",
        "Cung cấp, thi công lắp đặt và căng kéo hệ cáp DƯL ngoài: bó cáp 19T-15.2 bọc epoxy và PE từng tao, khối lượng khoảng 150 tấn.",
        "completed",
    ),
    (
        "cau-dai-ngai-2-ql60",
        "Cầu Đại Ngãi trên QL60 — Gói thầu 11-XL thi công cầu Đại Ngãi 2, phần tuyến và các công trình trên tuyến",
        2025,
        "Liên danh Tổng Công ty Xây dựng số 1 – CTCP, CTCP ĐTXD Trường Sơn, CTCP Tập đoàn Đạt Phương, CTCP Tập đoàn Thuận An – TAG",
        "Trà Vinh – Sóc Trăng",
        "Cung cấp, thi công lắp đặt và căng kéo hệ cáp DƯL ngoài: bó cáp 19T-15.2 bọc epoxy và PE từng tao, tao cáp chạy trong ống HDPE, khối lượng khoảng 104 tấn.",
        "completed",
    ),
    (
        "cau-tra-khuc-ql1",
        "Sửa chữa đột xuất đảm bảo ATGT cầu Trà Khúc Km1056+076, Quốc lộ 1",
        2024,
        "Công ty TNHH ĐTXD & DVTM Hòa Hoàng (nhà thầu thi công)",
        "Tỉnh Quảng Ngãi",
        "Cung cấp, lắp đặt và căng kéo hệ cáp DƯL ngoài: bó cáp 15T-15.2 bọc epoxy và HDPE từng tao, khối lượng 36,97 tấn.",
        "completed",
    ),
    (
        "cau-vuot-song-van-ninh-binh",
        "Đầu tư xây dựng cầu vượt sông Vân và đường dẫn phía tây sông Vân",
        2024,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO) — CTCP Đầu tư và Xây dựng Tín Thịnh",
        "Tỉnh Ninh Bình",
        "Cung cấp và thi công hệ neo cáp treo vòm: bó cáp 3T-15.2 bọc epoxy, ép đùn HDPE 2 lớp, khối lượng 5,71 tấn.",
        "completed",
    ),
    (
        "cau-non-nuoc-ql10",
        "Sửa chữa cầu Non Nước Km135+905, Quốc lộ 10",
        2024,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO) — CTCP Đầu tư và Xây dựng Tín Thịnh",
        "Tỉnh Ninh Bình",
        "Cung cấp và hướng dẫn thi công thay thế, lắp đặt gối điều chỉnh tải trọng tại hiện trường.",
        "completed",
    ),
    (
        "cau-xom-cui-thay-he-cap",
        "Thay thế hệ cáp cầu vòm cầu Xóm Củi, tuyến SF đường Nguyễn Văn Linh",
        2024,
        "Công ty TNHH Phát triển Phú Mỹ Hưng",
        "TP. Hồ Chí Minh",
        "Cung cấp và thi công hệ cáp giằng 51 tấn và cáp treo 10 tấn; cáp treo vòm loại 55W7 và 16 bó cáp giằng 22T-15.2 mm.",
        "completed",
    ),
    (
        "cau-phu-thinh-lao-cai",
        "Cầu Phú Thịnh nối Quốc lộ 4E với khu đô thị Vạn Hoà",
        2023,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)",
        "TP. Lào Cai, tỉnh Lào Cai",
        "Cung cấp và thi công hệ neo cáp treo vòm loại 49W7, 35W7, 31W7 — bó cáp thành phẩm dùng dây thép mạ kẽm song song, ép đùn HDPE 2 lớp, khối lượng 14 tấn.",
        "completed",
    ),
    (
        "cau-gioi-phien-yen-bai",
        "Đầu tư xây dựng công trình cầu Giới Phiên",
        2023,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "TP. Yên Bái, tỉnh Yên Bái",
        "Cung cấp và hướng dẫn thi công hệ neo cáp dùng bó cáp thành phẩm loại PWS 55 sợi f7, dây thép mạ kẽm cường độ cao xoắn thành bó, ép đùn HDPE 2 lớp, khối lượng 41 tấn.",
        "completed",
    ),
    (
        "cau-nguyen-huu-canh",
        "Cầu Nguyễn Hữu Cảnh",
        2022,
        "Công ty Cổ phần SBTECH",
        "TP. Hồ Chí Minh",
        "Cung cấp và thi công 8 bó cáp giằng thành phẩm loại 7x15.2, tao cáp mạ kẽm bọc HDPE từng tao và 2 lớp HDPE bọc ngoài bó; mỗi bó dài 57,6 m, khối lượng 6 tấn.",
        "completed",
    ),
    (
        "sua-chua-cau-tan-de-ql10",
        "Sửa chữa cầu Tân Đệ Km99+200, Quốc lộ 10",
        2022,
        "Tổng Công ty Xây dựng công trình giao thông 8 – CTCP",
        "Tỉnh Thái Bình",
        "Cung cấp và thi công 27 bó cáp DƯL ngoài loại 19T15.2 và 18T15.2, mỗi bó dài 73–120 m, tao cáp mạ kẽm bọc HDPE từng tao và cả bó, khối lượng 70 tấn.",
        "completed",
    ),
    (
        "ke-bo-song-cai-nha-trang",
        "Kè bờ sông Cái, TP. Nha Trang",
        2022,
        "CTCP Đầu tư Xây dựng Khánh Anh",
        "Tỉnh Khánh Hoà",
        "Cung cấp và hướng dẫn thi công 133 bó cáp giằng thành phẩm cáp epoxy vỏ bọc HDPE loại 3x15.2, hai đầu chế tạo neo hệ bắt đai ốc, mỗi bó dài 16–24,5 m, khối lượng 12 tấn.",
        "completed",
    ),
    (
        "cau-mong-sen-lao-cai",
        "Cầu Móng Sến — cầu cạn cao nhất Việt Nam",
        2021,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO) — CTCP Xuất nhập khẩu Cienco8",
        "Tỉnh Lào Cai",
        "Lắp đặt và căng kéo cáp dầm cầu liên tục: 76 bó cáp thành phẩm loại 22T15.2 bọc epoxy từng tao và HDPE cả bó, mỗi bó dài 90–284 m, khối lượng 190 tấn.",
        "completed",
    ),
    (
        "cau-vuot-ql51",
        "Cầu vượt Quốc lộ 51",
        2021,
        "Công ty Cổ phần Cầu đường Long Biên",
        "Tỉnh Bà Rịa – Vũng Tàu",
        "Cung cấp 1.500 bộ neo DƯL loại 15-15.2 và 3-15.2, 16 gối chậu 1.000 T và 20 gối chậu 600 T.",
        "completed",
    ),
    (
        "cau-hoa-binh-2-cap-day-vang",
        "Cầu Hòa Bình 2 — hệ cáp dây văng",
        2020,
        "CTCP Đầu tư Năng lượng XDTM Hoàng Sơn",
        "Tỉnh Hòa Bình",
        "Cung cấp cáp bọc epoxy 3x15.2 cho cáp dây văng, có ống bọc HDPE bảo vệ; 12 bó chiều dài 55–155 m.",
        "completed",
    ),
    (
        "cau-hoa-binh-2-goi-khe",
        "Cầu Hòa Bình 2 — gối cầu và khe co giãn",
        2020,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Tỉnh Hòa Bình",
        "Cung cấp 6 gối chậu 600 T, 120 gối cao su 350×500×130 và 100 m khe co giãn răng lược độ dịch chuyển 100 mm và 240 mm.",
        "completed",
    ),
    (
        "cau-song-hieu",
        "Cầu Sông Hiếu",
        2020,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Tỉnh Quảng Trị",
        "Cung cấp PC-bar D40.",
        "completed",
    ),
    (
        "cau-tan-de-neo-kich",
        "Cầu Tân Đệ — neo dự ứng lực và kích",
        2020,
        "Công ty Cổ phần Xây dựng số 16 Thăng Long",
        "Tỉnh Thái Bình",
        "Cung cấp neo dự ứng lực và kích căng kéo.",
        "completed",
    ),
    (
        "cau-rach-vong-long-an",
        "Cầu Rạch Vông",
        2020,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Tỉnh Long An",
        "Cung cấp gối chậu 2.000 T.",
        "completed",
    ),
    (
        "cau-tuan-hue",
        "Cầu Tuần",
        2020,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Thừa Thiên Huế",
        "Cung cấp PC-bar D40.",
        "completed",
    ),
    (
        "nut-giao-vanh-dai-3-ha-noi",
        "Nút giao Vành đai 3",
        2020,
        "Công ty TNHH Xây dựng và Thương mại Trung Chính",
        "Hà Nội",
        "Cung cấp gối chậu 400 T.",
        "completed",
    ),
    (
        "cau-ngoi-gianh-phu-tho",
        "Cầu Ngòi Giành",
        2020,
        "CTCP Đầu tư Thương mại PT CTGT Trường Thành",
        "Tỉnh Phú Thọ",
        "Cung cấp gối chậu 150 T.",
        "completed",
    ),
    (
        "tuyen-ket-noi-cau-gie-ninh-binh-ql1",
        "Tuyến đường kết nối cao tốc Cầu Giẽ – Ninh Bình với Quốc lộ 1",
        2019,
        "Công ty TNHH Đầu tư TM và XD Công trình MHT",
        "Hà Nam – Ninh Bình",
        "Cung cấp gối cầu 200 T cho dầm Super T.",
        "completed",
    ),
    (
        "cung-cap-vat-tu-thi-cong-cau-2018",
        "Cung cấp vật tư thi công cầu",
        2018,
        "Công ty Cổ phần Cầu đường Long Biên",
        "Việt Nam",
        "Cung cấp kích thủy lực 500 T.",
        "completed",
    ),
    (
        "cau-tang-long-co-khi-4",
        "Cầu Tăng Long — gói thầu Cơ khí 4 Thăng Long",
        2018,
        "Công ty Cổ phần Cơ khí 4 và Xây dựng Thăng Long – Miền Nam",
        "TP. Hồ Chí Minh",
        "Cung cấp cáp dự ứng lực, neo và gối cầu.",
        "completed",
    ),
    (
        "cau-tang-long-cau-1-thang-long",
        "Cầu Tăng Long — gói thầu Cầu 1 Thăng Long",
        2018,
        "Công ty Cổ phần Cầu 1 Thăng Long",
        "TP. Hồ Chí Minh",
        "Cung cấp cáp dự ứng lực, neo và gối cầu.",
        "completed",
    ),
    (
        "cau-vuot-o-dong-mac",
        "Cầu vượt Ô Đông Mác",
        2016,
        "Công ty Cổ phần Cơ khí Cầu đường Hà Ninh",
        "Hà Nội",
        "Cung cấp gối chậu 300 T và gối chậu 700 T.",
        "completed",
    ),
    (
        "cau-vuot-hoang-minh-giam",
        "Cầu vượt đường Hoàng Minh Giám",
        2015,
        "Công ty Cổ phần Cơ khí Cầu đường Hà Ninh",
        "Hà Nội",
        "Cung cấp gối chậu 200 T và gối chậu 650 T.",
        "completed",
    ),
]

# Project background compiled from public sources (press, government portals,
# investor sites) — kept separate from what Hoa Hoang actually supplied.
# Shape: slug -> (text, source url)
_PROJECT_CONTEXT: dict[str, tuple[str, str | None]] = {'duong-sat-toc-do-cao-ha-noi-quang-ninh': ('Tuyến đường đôi khổ 1.435 mm, điện khí hóa, dài khoảng 120 km, tốc độ thiết kế tối đa 350 km/h, đi qua Hà Nội – Bắc Ninh – Hải Phòng – Quảng Ninh. Chủ đầu tư là Công ty CP Đầu tư và Phát triển Đường sắt cao tốc VinSpeed, tổng mức đầu tư hơn 147.000 tỷ đồng (khoảng 5,6 tỷ USD, chưa gồm giải phóng mặt bằng). Khởi công ngày 12/4/2026, dự kiến hoàn thành cuối năm 2028.', 'https://vingroup.net/tin-tuc-su-kien/bai-viet/5881/vingroup-khoi-cong-du-an-tuyen-duong-sat-toc-do-cao-ha-noi-quang-ninh'), 'cau-long-thanh-khe-co-gian-p26': ('Cầu Long Thành là cầu lớn nhất trên cao tốc TP. Hồ Chí Minh – Long Thành – Dầu Giây, dài 2,3 km, rộng gần 20 m, 4 làn xe, tốc độ thiết kế 100 km/h. Đợt sửa chữa khe co giãn do VEC tổ chức bắt đầu ngày 15/7/2025 và hoàn thành ngày 25/7/2025, sớm hơn kế hoạch ban đầu.', 'https://vnexpress.net/hoan-thanh-sua-cau-lon-nhat-cao-toc-tp-hcm-long-thanh-ngay-25-7-4918554.html'), 'cau-phong-chau-moi-ql32c': ('Dự án xây dựng theo Lệnh xây dựng công trình khẩn cấp, tổng chiều dài 652,88 m (phần cầu 383,3 m), rộng 20,5 m với 4 làn xe cơ giới, thiết kế vĩnh cửu theo tiêu chuẩn đường cấp III đồng bằng, vận tốc 80 km/h. Tổng mức đầu tư được duyệt 635,392 tỷ đồng từ ngân sách Trung ương. Khánh thành ngày 28/9/2025, sớm 3 tháng so với kế hoạch.', 'https://moc.gov.vn/tl/tin-tuc/88345/thong-tin-bao-chi-ve-le-khanh-thanh-dua-vao-khai-thac-du-an-dau-tu-xay-dung-cau-phong-chau-moi---quoc-lo-32ctinh-phu-tho-theo-lenh-xay-dung-cong-trinh....aspx'), 'cau-may-chai-vu-yen': ('Cầu kết cấu dây văng nối khu đô thị trên đảo Vũ Yên với đường Lê Thánh Tông, quận Ngô Quyền. Toàn tuyến dài khoảng 2,2 km, mặt cắt ngang cầu chính rộng 21 m với 4 làn xe, vận tốc thiết kế 60 km/h; cầu dẫn hai bên rộng 17,5 m. Chủ đầu tư Vingroup, thi công bởi Tập đoàn Thuận An (TAG) và Công ty TNHH Thương mại & Xây dựng Trung Chính.', None), 'cau-nhon-trach-vanh-dai-3': ('Cầu Nhơn Trạch là cầu lớn nhất tuyến Vành đai 3 TP. Hồ Chí Minh, thuộc dự án thành phần 1A đoạn Tân Vạn – Nhơn Trạch, khởi công ngày 24/9/2022. Tổng mức đầu tư hơn 6.955 tỷ đồng từ vốn vay ODA Hàn Quốc (hiệp định VNM-58) và vốn đối ứng trong nước, nhà thầu chính Kumho E&C. Thông xe ngày 19/8/2025.', 'https://vnexpress.net/cau-nhon-trach-lon-nhat-vanh-dai-3-tp-hcm-truoc-thoi-diem-khai-thac-4888388.html'), 'cau-dai-ngai-2-ql60': ('Cầu dây văng vượt sông Hậu, cầu dây văng lớn thứ hai Việt Nam và là cầu thứ ba vượt sông Hậu sau cầu Cần Thơ và Vàm Cống. Phần cầu dài hơn 862 m, rộng 17,5 m, 13 nhịp với nhịp chính 330 m. Hợp long ngày 5/1/2025, vượt tiến độ khoảng 6 tháng.', 'https://thanhnien.vn/hop-long-cau-dai-ngai-2-tren-ql60-noi-tra-vinh-va-soc-trang-185250105151323048.htm'), 'cau-gioi-phien-yen-bai': ('Cầu vòm thép thiết kế vĩnh cửu bắc qua sông Hồng — cây cầu thứ 8 qua sông Hồng trên địa bàn tỉnh Yên Bái. Toàn cầu dài gần 520 m, rộng 20,5 m, gồm 10 nhịp: 3 nhịp vòm thép kết hợp 160 sợi dây văng và 7 nhịp dầm dẫn Super T, chịu được động đất cấp IV. Tổng mức đầu tư 650 tỷ đồng. Khánh thành ngày 24/9/2023.', 'https://www.baogiaothong.vn/yen-bai-khanh-thanh-cay-cau-thu-8-bac-qua-song-hong-192230924170431286.htm'), 'cau-mong-sen-lao-cai': ('Cầu cạn trên tuyến nối cao tốc Nội Bài – Lào Cai đi Sa Pa, có trụ chính cao 83 m — trụ cầu bê tông cao nhất Việt Nam. Cầu dài 612 m, rộng 14 m, thiết kế 5 nhịp liên tục, thi công bằng phương pháp đúc hẫng cân bằng kết hợp cáp dự ứng lực ngoài. Thông xe toàn tuyến ngày 22/9/2023.', 'https://vnexpress.net/cau-co-tru-cao-nhat-viet-nam-truoc-ngay-thong-xe-4515825.html')}

# Site photos shipped with the frontend under `frontend/public/images/`, so a
# fresh deployment has pictures before anyone opens the admin. Shape:
# slug -> list of media; the first entry doubles as the project cover.
_PROJECT_MEDIA: dict[str, list[dict]] = {
    "cau-may-chai-vu-yen": [
        {
            "url": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-f5cfdf78.jpg",
            "thumb": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-f5cfdf78-thumb.jpg",
            "alt": "Kích căng kéo bó cáp dự ứng lực ngoài trong lòng hộp dầm cầu Máy Chai",
            "width": 1280,
            "height": 960,
        },
        {
            "url": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-d60f3b0f.jpg",
            "thumb": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-d60f3b0f-thumb.jpg",
            "alt": "Hệ cáp dự ứng lực ngoài đã lắp đặt dọc lòng hộp dầm cầu Máy Chai",
            "width": 1200,
            "height": 1600,
        },
        {
            "url": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-7bdc05ad.jpg",
            "thumb": "/images/khe-co-gian-cau-may-chai/khe-co-gian-cau-may-chai-7bdc05ad-thumb.jpg",
            "alt": "Treo kích căng kéo tại ụ neo cáp dự ứng lực ngoài, cầu Máy Chai",
            "width": 960,
            "height": 1280,
        },
    ],
}


PROJECTS = [
    ProjectCreate(
        slug=slug,
        name=name,
        year=year,
        investor=client,
        location=location,
        summary=scope,
        scale=scope,
        status=status,
        context=_PROJECT_CONTEXT.get(slug, (None, None))[0],
        context_source=_PROJECT_CONTEXT.get(slug, (None, None))[1],
        cover=next(iter(_PROJECT_MEDIA.get(slug, [])), None),
        gallery=_PROJECT_MEDIA.get(slug, []),
    )
    for (slug, name, year, client, location, scope, status) in _PROJECTS
]

# --------------------------------------------------------------------------- #
# Last three years of financials (forms B01a/B02 - DNN, amounts in VND)
# --------------------------------------------------------------------------- #

FINANCIALS = [
    FinancialCreate(
        year=2023,
        revenue=45_103_262_902,
        profit_after_tax=3_279_498_568,
        total_assets=27_181_661_692,
        equity=5_861_020_289,
    ),
    FinancialCreate(
        year=2024,
        revenue=77_784_440_524,
        profit_after_tax=1_407_738_997,
        total_assets=51_253_282_425,
        equity=6_653_132_249,
    ),
    FinancialCreate(
        year=2025,
        revenue=67_743_800_437,
        profit_after_tax=658_725_466,
        total_assets=53_213_766_506,
        equity=7_312_886_756,
    ),
]

# --------------------------------------------------------------------------- #
# Customers and manufacturers
# --------------------------------------------------------------------------- #

PARTNERS = [
    PartnerCreate(name="Tổng Công ty Đầu tư phát triển đường cao tốc Việt Nam (VEC)", country="Việt Nam", role="customer"),
    PartnerCreate(name="Tổng Công ty Xây dựng Trường Sơn", country="Việt Nam", role="customer"),
    PartnerCreate(name="CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)", country="Việt Nam", role="customer"),
    PartnerCreate(name="Công ty TNHH Xây dựng và Thương mại Trung Chính", country="Việt Nam", role="customer"),
    PartnerCreate(name="Công ty TNHH Phát triển Phú Mỹ Hưng", country="Việt Nam", role="customer"),
    PartnerCreate(name="CTCP Tập đoàn Đạt Phương", country="Việt Nam", role="customer"),
    PartnerCreate(name="Tổng Công ty Xây dựng số 1 – CTCP", country="Việt Nam", role="customer"),
    PartnerCreate(name="Tổng Công ty Xây dựng công trình giao thông 8 – CTCP", country="Việt Nam", role="customer"),
    PartnerCreate(name="CTCP Tập đoàn Thuận An – TAG", country="Việt Nam", role="customer"),
    PartnerCreate(name="CTCP Xây dựng công trình 525", country="Việt Nam", role="customer"),
    PartnerCreate(name="CTCP ĐTXD Thương mại Trường Thành", country="Việt Nam", role="customer"),
    PartnerCreate(name="Công ty Cổ phần Cầu đường Long Biên", country="Việt Nam", role="customer"),
    PartnerCreate(name="Công ty Cổ phần SBTECH", country="Việt Nam", role="customer"),
    PartnerCreate(name="Công ty Cổ phần Cơ khí Cầu đường Hà Ninh", country="Việt Nam", role="customer"),
    PartnerCreate(name="Kumho Engineering & Construction", country="Hàn Quốc", role="customer"),
    PartnerCreate(name="SHINKO", country="Nhật Bản", role="manufacturer"),
    PartnerCreate(name="APS", country="Nhật Bản", role="manufacturer"),
    PartnerCreate(name="Hirun", country="Italy", role="manufacturer"),
    PartnerCreate(name="Mageba (Shanghai) Bridge Products", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(name="Liuzhou OVM Machinery", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(name="CSSC Sunrui Luoyang Special Equipment (Song Thụy Lạc Dương Trung Thuyền)", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(name="Công ty cáp Quế Cầu Liễu Châu", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(name="Công ty TNHH Cơ khí DƯL HM Liễu Châu", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(name="Công ty phát triển công nghệ giao thông Vạn Cầu Trùng Khánh", country="Trung Quốc", role="manufacturer"),
]
