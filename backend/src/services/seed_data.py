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
    CapabilityStat,
    CertificateCreate,
    CompanyMilestone,
    CompanyProfile,
    ContactInfo,
    DocumentCreate,
    EquipmentCreate,
    FinancialCreate,
    Leader,
    Media,
    OrgUnit,
    PartnerCreate,
    PersonnelGroup,
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
    tagline="HOÀ HOÀNG — Công nghệ vươn tầm, hợp tác thành công",
    tax_code="0106346833",
    established="Tháng 10 năm 2013",
    charter_capital="6.000.000.000 VNĐ (Sáu tỷ đồng)",
    status="Đang hoạt động",
    employees="25 – 99 nhân sự",
    main_business_line="4212 — Xây dựng công trình đường bộ",
    business_lines_count=41,
    intro=[
        "Công ty TNHH Đầu tư xây dựng và dịch vụ thương mại Hòa Hoàng (Hoa Hoang Intra "
        "Co., Ltd) là nhà thầu chuyên ngành trong lĩnh vực kết cấu cầu: thi công lắp đặt "
        "và căng kéo hệ cáp dự ứng lực ngoài, hệ cáp cho cầu dây võng, dây văng và cầu "
        "vòm, lắp đặt gối cầu và khe co giãn cho các dự án hạ tầng giao thông tại Việt Nam.",
        "Công ty thành lập năm 2013 (trước đây mang tên TCC). Giai đoạn 2013 – 2018, Hòa "
        "Hoàng hoạt động chủ yếu ở mảng thương mại, nhập khẩu và phân phối vật tư chuyên "
        "ngành cầu đường. Từ năm 2018, công ty chuyển trọng tâm sang thi công: đưa kỹ sư, "
        "công nhân và thiết bị của chính mình ra công trường, trực tiếp đảm nhận công tác "
        "lắp đặt, căng kéo và nghiệm thu thay vì dừng lại ở khâu cung cấp.",
        "Các công trình Hòa Hoàng đã tham gia gồm cao tốc Sài Gòn – Long Thành – Dầu Giây, "
        "Bến Lức – Long Thành, Hà Nội – Lào Cai, cầu Móng Sến – Sa Pa, cầu Tân Đệ, cầu "
        "Nguyễn Hữu Cảnh, cầu Trà Khúc 2, cầu Xóm Củi, cầu Nhơn Trạch, cầu Đại Ngãi 2, "
        "cầu Phong Châu mới và nhiều dự án khác.",
        "Đi cùng năng lực thi công là hệ công nghệ công ty làm chủ và được ủy quyền tại "
        "Việt Nam: cáp hãng SHINKO (Nhật Bản), cáp và gối hãng Hirun (Italy) cùng các "
        "thương hiệu hàng đầu Trung Quốc — nhờ đó vật tư, thiết bị căng kéo và đội thi "
        "công là một khối thống nhất, không phụ thuộc vào bên thứ ba khi có sự cố hiện trường.",
        "Hòa Hoàng đang hợp tác với các Viện thiết kế đường sắt Trung Quốc và các nhà "
        "máy cung cấp thiết bị thi công đường sắt cao tốc, phối hợp cùng chuyên gia để "
        "cung cấp thiết bị và tư vấn chuyển giao công nghệ thi công kết cấu hạ tầng "
        "đường sắt tốc độ cao cũng như tàu điện ngầm.",
    ],
    vision=(
        "Trở thành nhà thầu chuyên ngành hàng đầu Việt Nam về thi công hệ cáp dự ứng lực, "
        "hệ cáp cầu, gối cầu và khe co giãn; đồng thời làm chủ công nghệ thi công đường "
        "sắt tốc độ cao và hầm bằng máy TBM."
    ),
    mission=(
        "Thi công đúng biện pháp đã được Tư vấn giám sát phê duyệt, bằng đội ngũ và thiết "
        "bị của chính công ty; bàn giao hồ sơ nghiệm thu đầy đủ và giữ đúng tiến độ đã "
        "cam kết với nhà thầu chính."
    ),
    # Wording taken from the capability profile (HSNL) — the company's own
    # statement of its values, left as written rather than rephrased.
    core_values=[
        "Chất lượng sản phẩm đạt tiêu chuẩn ASTM, ISO và tiêu chuẩn dự án",
        "Đáp ứng đúng tiến độ giao hàng và thi công",
        "Dịch vụ kỹ thuật và hỗ trợ hiện trường xuyên suốt",
        "Minh bạch trong hồ sơ pháp lý, xuất xứ và thí nghiệm vật liệu",
    ],
    # Numbers a main contractor can check against the project list on this site.
    # 750+ is the conservative rounding of 762,68 tấn — the sum of every cable
    # tonnage stated in `_PROJECTS` below.
    capability_stats=[
        CapabilityStat(value="34", label="Dự án cầu đường đã thực hiện", label_en="Bridge projects delivered"),
        CapabilityStat(value="750+", label="Tấn cáp đã cung cấp và thi công", label_en="Tonnes of cable supplied and installed"),
        CapabilityStat(value="2018", label="Bắt đầu trực tiếp thi công", label_en="Started self-performing site works"),
        CapabilityStat(value="25 – 99", label="Cán bộ, kỹ sư và công nhân", label_en="Staff, engineers and workers"),
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
    # Roles only. No source document states a headcount per role, so the page
    # lists the roles the company fields instead of showing empty count cells.
    personnel=[
        PersonnelGroup(title="Chỉ huy trưởng công trường"),
        PersonnelGroup(title="Kỹ sư cầu đường"),
        PersonnelGroup(title="Kỹ sư cơ khí — thiết bị căng kéo"),
        PersonnelGroup(title="Công nhân kỹ thuật căng kéo, lắp đặt"),
        PersonnelGroup(title="Cán bộ an toàn (HSE)"),
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
            description=(
                "Bắt đầu nhập khẩu và cung cấp vật tư chuyên ngành cho các dự án cầu "
                "đường bộ và cao tốc tại Việt Nam."
            ),
        ),
        CompanyMilestone(
            year=2015,
            title="Dự án gối cầu đầu tiên",
            description="Cung cấp gối chậu cho cầu vượt đường Hoàng Minh Giám, Hà Nội.",
        ),
        CompanyMilestone(
            year=2018,
            title="Chuyển trọng tâm sang thi công",
            description=(
                "Sau 5 năm hoạt động thương mại, công ty chuyển sang trực tiếp nhận thầu "
                "thi công: tự tổ chức đội lắp đặt, căng kéo và nghiệm thu tại công trường."
            ),
        ),
        CompanyMilestone(
            year=2021,
            title="Cầu Móng Sến — cầu cạn cao nhất Việt Nam",
            description="Lắp đặt và căng kéo 190 tấn cáp dự ứng lực cho dầm cầu liên tục.",
        ),
        CompanyMilestone(
            year=2023,
            title="Tham gia dự án vốn ODA",
            description="Thi công cáp dự ứng lực ngoài cho Vành đai 3 TP. Hồ Chí Minh (hiệp định vay VNM-58).",
        ),
        CompanyMilestone(
            year=2024,
            title="Trực tiếp đứng tên nhà thầu thi công",
            description=(
                "Đảm nhận vai trò nhà thầu thi công gói sửa chữa đột xuất cầu Trà Khúc "
                "Km1056+076 trên Quốc lộ 1."
            ),
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
    map_embed_url=(
        "https://maps.google.com/maps?q=MD+Complex+Tower,+Khu+%C4%91%C3%B4+th%E1%BB%8B+M%E1%BB%B9+%C4%90%C3%ACnh+1,+Nam+T%E1%BB%AB+Li%C3%AAm,+H%C3%A0+N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed"
    ),
)

# --------------------------------------------------------------------------- #
# Construction services
#
# Replaces the old flat "lĩnh vực kinh doanh" list. Grouped the way a specialist
# bridge contractor's clients think about the work — new build, repair and
# strengthening, technology and supply — after the structure used by Freyssinet
# and VSL, the closest international peers.
#
# `work_type` matches the entries in `_PROJECT_WORK_TYPES` below, so a service
# page can list the projects where that work was actually done.
#
# `process_steps` describe the standard sequence for each trade. `standards` and
# `deliverables` deliberately stay generic — the binding list is whatever the
# project's own specification says, and no per-project standard list exists in
# the source documents.
# --------------------------------------------------------------------------- #

_HANDOVER_DOCS = [
    "Biện pháp thi công được Tư vấn giám sát phê duyệt",
    "Chứng chỉ xuất xứ (CO), chứng chỉ chất lượng (CQ) và kết quả thí nghiệm vật tư",
    "Nhật ký thi công và biên bản nghiệm thu từng hạng mục",
    "Hồ sơ hoàn công của phần việc đã thực hiện",
]

_SERVICES: list[dict] = [
    # ---- Thi công mới ------------------------------------------------------ #
    {
        "slug": "cang-keo-du-ung-luc-ngoai",
        "name": "Thi công căng kéo cáp dự ứng lực ngoài",
        "category": "build",
        "work_type": "cang-keo-du-ung-luc-ngoai",
        "summary": "Lắp đặt, luồn cáp và căng kéo hệ cáp DƯL ngoài cho cầu dầm hộp và cầu đúc hẫng.",
        "description": (
            "Hòa Hoàng thi công trọn gói hệ cáp dự ứng lực ngoài: từ định vị ụ neo và ụ "
            "chuyển hướng, lắp đặt ống ghen, luồn cáp, đến căng kéo theo từng cấp lực "
            "thiết kế và bơm vữa bảo vệ. Đội thi công và bộ thiết bị căng kéo do công ty "
            "trực tiếp huy động."
        ),
        "process_steps": [
            "Nhận hồ sơ thiết kế, lập biện pháp thi công và trình Tư vấn giám sát phê duyệt",
            "Kiểm tra vật tư đầu vào: chứng chỉ xuất xứ, chất lượng và kết quả thí nghiệm cáp, neo",
            "Định vị ụ neo và ụ chuyển hướng, lắp đặt ống ghen theo tọa độ thiết kế",
            "Luồn cáp, lắp đầu neo; kiểm định kích và đồng hồ áp lực trước khi căng",
            "Căng kéo theo từng cấp lực, đo và đối chiếu độ giãn dài thực tế với giá trị lý thuyết",
            "Cắt cáp thừa, bơm vữa bảo vệ và bịt đầu neo",
            "Nghiệm thu, bàn giao nhật ký căng kéo và biểu đồ lực — độ giãn dài",
        ],
        "standards": [
            "Thí nghiệm cáp theo ASTM A370, cáp phun epoxy theo ASTM A822/A822M",
            "Tiêu chuẩn nghiệm thu theo hồ sơ thiết kế và chỉ dẫn kỹ thuật của từng dự án",
        ],
        "deliverables": _HANDOVER_DOCS + ["Nhật ký căng kéo và biểu đồ lực — độ giãn dài từng bó cáp"],
        "icon": "◆",
    },
    {
        "slug": "he-cap-cau",
        "name": "Lắp dựng và căng chỉnh hệ cáp cầu vòm, dây văng, dây võng",
        "category": "build",
        "work_type": "he-cap-cau",
        "summary": "Hệ cáp treo và cáp giằng cho cầu vòm, hệ dây văng cho cầu dây văng và cầu extradosed.",
        "description": (
            "Thi công hệ cáp treo và cáp giằng cho cầu vòm ống thép, hệ cáp dây văng cho "
            "cầu dây văng và cầu extradosed, hệ cáp chủ và cáp treo cho cầu dây võng. "
            "Cáp thành phẩm loại PWS dùng sợi thép mạ kẽm song song, ép đùn HDPE hai lớp."
        ),
        "process_steps": [
            "Kiểm tra kích thước hình học của kết cấu và vị trí neo trước khi lắp cáp",
            "Nghiệm thu bó cáp thành phẩm: chiều dài chế tạo, đầu neo, lớp bảo vệ HDPE",
            "Lắp dựng bó cáp, lắp neo hai đầu theo trình tự đã được phê duyệt",
            "Căng chỉnh theo từng vòng, đo lực cáp và cao độ kết cấu sau mỗi bước",
            "Hiệu chỉnh lực cáp đạt giá trị thiết kế, khóa neo và lắp thiết bị bảo vệ",
            "Nghiệm thu, bàn giao bảng lực cáp và cao độ đo đạc sau căng chỉnh",
        ],
        "standards": [
            "Bó cáp PWS 31W7, 35W7, 49W7, 55W7 — ép đùn HDPE 2 lớp, neo hệ bắt đai ốc",
            "Lực cáp và cao độ nghiệm thu theo hồ sơ thiết kế của từng dự án",
        ],
        "deliverables": _HANDOVER_DOCS + ["Bảng lực cáp và cao độ kết cấu đo sau căng chỉnh"],
        "icon": "◇",
    },
    {
        "slug": "lap-dat-goi-cau",
        "name": "Lắp đặt gối cầu đường bộ, cao tốc và đường sắt",
        "category": "build",
        "work_type": "lap-dat-goi-cau",
        "summary": "Gối chậu, gối chỏm cầu, gối cao su và gối công năng đặc biệt cho cầu đường bộ và đường sắt.",
        "description": (
            "Lắp đặt gối cao su, gối chậu cao su và gối thép (gối chậu, gối chỏm cầu) cho "
            "dự án cầu đường bộ, cao tốc, đường sắt và đường sắt đô thị — bao gồm cả gối "
            "cách ly địa chấn, gối chống nhổ, gối chống gió và gối khóa tốc độ."
        ),
        "process_steps": [
            "Đối chiếu chủng loại, tải trọng và hướng chuyển vị của gối với hồ sơ thiết kế",
            "Kiểm tra cao độ, độ phẳng và tim tuyến đá kê gối trên đỉnh trụ",
            "Định vị gối theo tim dọc — tim ngang, cân chỉnh cao độ và độ nghiêng",
            "Đổ vữa không co ngót chân gối, chờ đạt cường độ theo quy định",
            "Hạ dầm lên gối, tháo thanh khóa vận chuyển đúng trình tự",
            "Nghiệm thu vị trí, cao độ và trạng thái làm việc của gối sau khi hạ dầm",
        ],
        "standards": [
            "Thí nghiệm cao su theo ASTM D412, ASTM E376 và tiêu chuẩn riêng của dự án",
            "Dung sai lắp đặt theo chỉ dẫn kỹ thuật và hướng dẫn của nhà sản xuất",
        ],
        "deliverables": _HANDOVER_DOCS + ["Biên bản định vị, cao độ và trạng thái gối sau khi hạ dầm"],
        "icon": "▣",
    },
    {
        "slug": "lap-dat-khe-co-gian",
        "name": "Lắp đặt khe co giãn",
        "category": "build",
        "work_type": "lap-dat-khe-co-gian",
        "summary": "Khe ray thép mô đun và khe răng lược cho cầu đường bộ, đường sắt và đường sắt trên cao.",
        "description": (
            "Lắp đặt khe co giãn loại thép và nhôm cho dự án đường bộ, đường sắt và đường "
            "sắt trên cao: khe ray thép mô đun loại SSFB, khe LR27 độ chuyển tới 2.160 mm, "
            "khe răng lược loại cân bằng và lệch tâm."
        ),
        "process_steps": [
            "Xác định độ mở khe theo nhiệt độ thi công thực tế tại thời điểm lắp đặt",
            "Cắt, đục tạo hốc khe và vệ sinh bề mặt bê tông tiếp giáp",
            "Định vị khe theo cao độ mặt cầu, cố định tạm bằng hệ khung dẫn",
            "Hàn nối cốt thép chờ, đổ bê tông hốc khe theo mác thiết kế",
            "Tháo hệ khung dẫn, lắp gioăng cao su và kiểm tra độ kín nước",
            "Nghiệm thu độ mở khe, cao độ mặt khe và độ êm thuận khi thông xe",
        ],
        "standards": [
            "Độ mở khe hiệu chỉnh theo nhiệt độ thi công và bảng tra của nhà sản xuất",
            "Cao độ và độ êm thuận nghiệm thu theo chỉ dẫn kỹ thuật của dự án",
        ],
        "deliverables": _HANDOVER_DOCS + ["Biên bản độ mở khe theo nhiệt độ thi công và kết quả kiểm tra kín nước"],
        "icon": "▦",
    },
    {
        "slug": "neo-dat-mai-doc",
        "name": "Thi công hệ neo đất, ổn định mái dốc và kè",
        "category": "build",
        "work_type": "neo-dat-mai-doc",
        "summary": "Bó cáp giằng neo bờ kè, hệ neo đất gia cố mái dốc cho công trình đường bộ và cảng biển.",
        "description": (
            "Cung cấp và thi công cấu kiện hệ neo đất, ổn định mái dốc và kè: bó cáp giằng "
            "neo bờ kè, neo hệ bắt đai ốc, neo chủ động và neo cố định."
        ),
        "process_steps": [
            "Khoan tạo lỗ neo theo góc nghiêng và chiều sâu thiết kế",
            "Lắp bó cáp neo, đặt ống bơm vữa và định tâm bó trong lỗ khoan",
            "Bơm vữa bầu neo, chờ đạt cường độ theo quy định",
            "Thí nghiệm kéo nhổ neo thử theo tỷ lệ được duyệt",
            "Căng kéo neo đại trà đến lực thiết kế và khóa neo",
            "Nghiệm thu, bàn giao kết quả thí nghiệm và nhật ký căng neo",
        ],
        "standards": [
            "Lực thí nghiệm và lực khóa neo theo hồ sơ thiết kế của từng dự án",
        ],
        "deliverables": _HANDOVER_DOCS + ["Kết quả thí nghiệm kéo nhổ neo và nhật ký căng neo"],
        "icon": "▲",
    },
    # ---- Sửa chữa – tăng cường --------------------------------------------- #
    {
        "slug": "thay-the-he-cap",
        "name": "Thay thế hệ cáp cầu vòm và cầu dây văng",
        "category": "repair",
        "work_type": "thay-the-he-cap",
        "summary": "Tháo dỡ và thay mới cáp treo, cáp giằng trên cầu đang khai thác, có kiểm soát nội lực từng bước.",
        "description": (
            "Thay thế hệ cáp treo và cáp giằng cho cầu vòm đang khai thác — công tác đòi "
            "hỏi kiểm soát nội lực kết cấu qua từng bước tháo và lắp. Hòa Hoàng đã thực "
            "hiện tại cầu Xóm Củi và cầu Cần Giuộc trên tuyến đường Nguyễn Văn Linh."
        ),
        "process_steps": [
            "Khảo sát hiện trạng cáp cũ, đo lực cáp và đánh giá kết cấu trước khi thay",
            "Lập biện pháp thay cáp theo trình tự có kiểm soát nội lực, trình phê duyệt",
            "Lắp hệ giàn thao tác và thiết bị bảo đảm an toàn giao thông trong quá trình thi công",
            "Giảm lực cáp cũ theo từng cấp, tháo dỡ và đưa ra khỏi kết cấu",
            "Lắp bó cáp mới, căng chỉnh theo từng vòng, đo lực và cao độ sau mỗi bước",
            "Hiệu chỉnh đạt lực thiết kế, nghiệm thu và hoàn trả mặt cầu",
        ],
        "standards": [
            "Trình tự tháo — lắp và giới hạn nội lực từng bước theo biện pháp được phê duyệt",
        ],
        "deliverables": _HANDOVER_DOCS + ["Bảng so sánh lực cáp trước và sau khi thay thế"],
        "icon": "⚒",
    },
    {
        "slug": "tang-cuong-cau-cu",
        "name": "Tăng cường cầu cũ bằng dự ứng lực ngoài",
        "category": "repair",
        "work_type": "tang-cuong-cau-cu",
        "summary": "Bổ sung hệ cáp DƯL ngoài để khôi phục và nâng năng lực chịu tải của cầu đang khai thác.",
        "description": (
            "Thi công, tăng cường hoặc sửa chữa cầu cũ bằng hệ cáp dự ứng lực ngoài — "
            "phương án được dùng khi cầu suy giảm năng lực chịu tải nhưng vẫn phải duy trì "
            "khai thác. Hòa Hoàng đã thực hiện tại cầu Trà Khúc trên Quốc lộ 1 và cầu Tân "
            "Đệ trên Quốc lộ 10."
        ),
        "process_steps": [
            "Khảo sát hiện trạng kết cấu và đối chiếu với hồ sơ thiết kế tăng cường",
            "Khoan cấy, thi công ụ neo và ụ chuyển hướng trong lòng dầm hộp",
            "Lắp đặt ống ghen, luồn bó cáp DƯL ngoài theo tuyến thiết kế",
            "Căng kéo theo từng cấp lực, theo dõi biến dạng kết cấu trong quá trình căng",
            "Bơm vữa bảo vệ, bịt đầu neo và hoàn thiện chống ăn mòn",
            "Nghiệm thu, bàn giao nhật ký căng kéo và số liệu quan trắc biến dạng",
        ],
        "standards": [
            "Lực căng và trình tự căng theo hồ sơ thiết kế tăng cường được phê duyệt",
        ],
        "deliverables": _HANDOVER_DOCS + ["Nhật ký căng kéo và số liệu quan trắc biến dạng kết cấu"],
        "icon": "◈",
    },
    {
        "slug": "thay-the-khe-co-gian",
        "name": "Sửa chữa và thay thế khe co giãn",
        "category": "repair",
        "work_type": "thay-the-khe-co-gian",
        "summary": "Thay khe hỏng trên cầu đang khai thác, tổ chức thi công theo làn để không phải cấm đường.",
        "description": (
            "Sửa chữa và thay thế khe co giãn trên cầu đang khai thác, gồm cả khe ray mô "
            "đun khẩu độ lớn. Hòa Hoàng đã thực hiện tại trụ P26 cầu Long Thành trên cao "
            "tốc TP. Hồ Chí Minh – Long Thành – Dầu Giây."
        ),
        "process_steps": [
            "Khảo sát hiện trạng khe cũ, xác định chủng loại và độ chuyển vị cần thay thế",
            "Lập phương án phân luồng và bảo đảm an toàn giao thông trong thời gian thi công",
            "Cắt, phá dỡ khe cũ và vệ sinh hốc khe",
            "Định vị và lắp khe mới theo độ mở tương ứng nhiệt độ thi công",
            "Đổ bê tông hốc khe, bảo dưỡng đạt cường độ trước khi thông xe",
            "Nghiệm thu độ êm thuận, kín nước và hoàn trả mặt đường",
        ],
        "standards": [
            "Độ mở khe hiệu chỉnh theo nhiệt độ thi công, nghiệm thu theo chỉ dẫn kỹ thuật dự án",
        ],
        "deliverables": _HANDOVER_DOCS + ["Phương án phân luồng và biên bản nghiệm thu thông xe"],
        "icon": "▤",
    },
    {
        "slug": "thay-the-goi-cau",
        "name": "Kích nâng dầm và thay thế gối cầu",
        "category": "repair",
        "work_type": "thay-the-goi-cau",
        "summary": "Kích nâng dầm có kiểm soát để thay gối hỏng hoặc lắp gối điều chỉnh tải trọng.",
        "description": (
            "Thay thế gối cầu trên công trình đang khai thác bằng kích nâng dầm có kiểm "
            "soát chuyển vị, gồm cả việc lắp gối điều chỉnh tải trọng. Hòa Hoàng đã thực "
            "hiện tại cầu Non Nước trên Quốc lộ 10."
        ),
        "process_steps": [
            "Khảo sát hiện trạng gối, xác định tải trọng và hành trình kích cần thiết",
            "Bố trí hệ kích và gối kê tạm, kiểm tra khả năng chịu lực của vị trí kê",
            "Kích nâng dầm theo từng cấp, kiểm soát chuyển vị và khe hở đồng đều",
            "Tháo gối cũ, xử lý đá kê và định vị gối mới",
            "Hạ dầm theo từng cấp, kiểm tra tiếp xúc và trạng thái làm việc của gối",
            "Nghiệm thu, bàn giao nhật ký kích nâng và số liệu chuyển vị",
        ],
        "standards": [
            "Hành trình kích và giới hạn chuyển vị theo biện pháp thi công được phê duyệt",
        ],
        "deliverables": _HANDOVER_DOCS + ["Nhật ký kích nâng và số liệu chuyển vị theo từng cấp"],
        "icon": "▥",
    },
    {
        "slug": "chong-va-tru-cau",
        "name": "Lắp đặt phao nổi chống va xô trụ cầu",
        "category": "repair",
        "work_type": "chong-va-tru-cau",
        "summary": "Hệ phao nổi bảo vệ trụ cầu và gối cao su chống va chạm cho bến cảng.",
        "description": (
            "Nhập khẩu và lắp đặt phao nổi chống va xô cho trụ cầu, cùng các loại gối cao "
            "su chống va chạm phục vụ dự án bến cảng."
        ),
        "process_steps": [
            "Khảo sát kích thước trụ, mực nước và luồng chạy tàu tại vị trí lắp đặt",
            "Xác định chủng loại và số lượng phao theo năng lượng va thiết kế",
            "Tổ chức thi công trên mặt nước, bố trí phương tiện thủy và cảnh giới luồng",
            "Lắp đặt hệ phao, neo giữ và liên kết vào thân trụ",
            "Kiểm tra hoạt động của hệ phao theo dao động mực nước",
            "Nghiệm thu và bàn giao hồ sơ lắp đặt",
        ],
        "standards": [
            "Năng lượng va và cấu tạo liên kết theo hồ sơ thiết kế của từng dự án",
        ],
        "deliverables": _HANDOVER_DOCS,
        "icon": "◐",
    },
    # ---- Công nghệ và cung cấp --------------------------------------------- #
    {
        "slug": "chuyen-giao-cong-nghe-duong-sat-toc-do-cao",
        "name": "Chuyển giao công nghệ thi công đường sắt tốc độ cao và hầm TBM",
        "category": "technology",
        "work_type": "chuyen-giao-cong-nghe-duong-sat-toc-do-cao",
        "summary": "Thiết bị thi công đồng bộ và tư vấn chuyển giao công nghệ dầm ĐSTĐC, hầm đào bằng máy TBM.",
        "description": (
            "Phối hợp với các Viện thiết kế đường sắt Trung Quốc và nhà máy chế tạo thiết "
            "bị để cung cấp thiết bị thi công đồng bộ và tư vấn chuyển giao công nghệ thi "
            "công dầm đường sắt tốc độ cao, thi công hầm bằng máy TBM cho đường sắt và tàu "
            "điện ngầm."
        ),
        "process_steps": [
            "Khảo sát yêu cầu công nghệ và điều kiện mặt bằng của dự án",
            "Đề xuất cấu hình thiết bị thi công đồng bộ phù hợp với tiến độ và địa hình",
            "Phối hợp nhà máy chế tạo, giám sát sản xuất và nghiệm thu thiết bị tại xưởng",
            "Vận chuyển, lắp dựng và chạy thử thiết bị tại công trường",
            "Đào tạo, chuyển giao quy trình vận hành cho đội thi công của chủ đầu tư",
            "Hỗ trợ kỹ thuật trong giai đoạn đầu khai thác thiết bị",
        ],
        "standards": [
            "Cấu hình thiết bị và quy trình vận hành theo hồ sơ công nghệ được chuyển giao",
        ],
        "deliverables": [
            "Hồ sơ kỹ thuật và biên bản nghiệm thu thiết bị tại xưởng",
            "Tài liệu quy trình vận hành và biên bản đào tạo chuyển giao",
        ],
        "icon": "⚙",
    },
    {
        "slug": "cung-cap-vat-tu-thiet-bi",
        "name": "Cung cấp vật tư và thiết bị chuyên ngành cầu đường",
        "category": "technology",
        "work_type": "cung-cap-vat-tu-thiet-bi",
        "summary": "Cáp, neo, gối cầu, khe co giãn và thiết bị căng kéo từ các nhà sản xuất được ủy quyền.",
        "description": (
            "Nhập khẩu và cung cấp cáp dự ứng lực, cáp thành phẩm cho cầu dây văng và cầu "
            "vòm, hệ neo căng kéo, gối cầu, khe co giãn cùng thiết bị thi công — sản phẩm "
            "của SHINKO (Nhật Bản), Hirun (Italy) và các nhà sản xuất hàng đầu Trung Quốc. "
            "Mỗi lô hàng đi kèm chứng chỉ xuất xứ, chứng chỉ chất lượng và kết quả thí nghiệm."
        ),
        "process_steps": [
            "Tiếp nhận thông số kỹ thuật của dự án và đề xuất chủng loại phù hợp",
            "Trình mẫu, chứng chỉ nhà sản xuất và hồ sơ vật liệu để Tư vấn giám sát chấp thuận",
            "Đặt hàng sản xuất, theo dõi tiến độ và nghiệm thu tại nhà máy",
            "Thí nghiệm vật liệu theo yêu cầu của dự án trước khi đưa vào công trình",
            "Giao hàng tại công trường theo tiến độ thi công đã thống nhất",
            "Hướng dẫn lắp đặt và hỗ trợ kỹ thuật tại hiện trường",
        ],
        "standards": [
            "Thí nghiệm vật liệu theo ASTM A370, ASTM D412, ASTM E376, ASTM A822/A822M và TCVN",
            "Nhà sản xuất đạt chứng nhận hệ thống quản lý ISO 9001, ISO 14001, ISO 45001",
        ],
        "deliverables": [
            "Chứng chỉ xuất xứ (CO) và chứng chỉ chất lượng (CQ) theo từng lô hàng",
            "Kết quả thí nghiệm vật liệu của lô hàng cung cấp",
            "Hướng dẫn lắp đặt của nhà sản xuất",
        ],
        "icon": "◉",
    },
    {
        "slug": "dich-vu-ky-thuat-hien-truong",
        "name": "Dịch vụ kỹ thuật và hỗ trợ hiện trường",
        "category": "technology",
        "work_type": "dich-vu-ky-thuat-hien-truong",
        "summary": "Hướng dẫn lắp đặt, giám sát căng kéo và hỗ trợ nghiệm thu cho sản phẩm được ủy quyền.",
        "description": (
            "Dịch vụ kỹ thuật và hỗ trợ hiện trường cho các sản phẩm được nhà sản xuất ủy "
            "quyền: hướng dẫn lắp đặt, giám sát công tác căng kéo, xử lý vướng mắc kỹ "
            "thuật và hỗ trợ hoàn thiện hồ sơ nghiệm thu."
        ),
        "process_steps": [
            "Tiếp nhận yêu cầu hỗ trợ và hồ sơ hiện trạng từ nhà thầu chính",
            "Cử kỹ sư có mặt tại công trường theo lịch thi công",
            "Hướng dẫn lắp đặt, giám sát căng kéo và kiểm tra thông số thực tế",
            "Xử lý vướng mắc kỹ thuật phát sinh, lập biên bản hiện trường",
            "Hỗ trợ hoàn thiện hồ sơ nghiệm thu của hạng mục",
        ],
        "standards": [
            "Hướng dẫn lắp đặt và dung sai theo tài liệu kỹ thuật của nhà sản xuất",
        ],
        "deliverables": [
            "Biên bản hiện trường và biên bản hướng dẫn lắp đặt",
            "Hỗ trợ hồ sơ nghiệm thu của hạng mục liên quan",
        ],
        "icon": "◑",
    },
]

BUSINESS_FIELDS = [BusinessFieldCreate(**service) for service in _SERVICES]

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
        "image": {
            "url": "/images/san-pham/cap-thanh-pham-cau-day-vang-74a0de49.jpg",
            "thumb": "/images/san-pham/cap-thanh-pham-cau-day-vang-74a0de49-thumb.jpg",
            "alt": "Bảng giới thiệu cầu dây văng sử dụng cáp thành phẩm",
            "width": 1536,
            "height": 1024,
        },
    },
    {
        "slug": "cap-epoxy-hdpe",
        "name": "Cáp mạ kẽm / ép đùn epoxy có vỏ bọc HDPE",
        "description": "Cáp thành phẩm mạ kẽm hoặc ép đùn epoxy từng tao, bọc HDPE cả bó, dùng cho hệ cáp ngoài.",
        "specs": ["Bọc epoxy từng tao + HDPE cả bó", "Bó 3T, 7T, 15T, 18T, 19T, 22T-15.2"],
        "applications": ["Cầu đúc hẫng", "Cầu vòm dây treo", "Cầu extradosed"],
        "icon": "◆",
        "image": {
            "url": "/images/san-pham/cap-epoxy-hdpe-cc90be87.jpg",
            "thumb": "/images/san-pham/cap-epoxy-hdpe-cc90be87-thumb.jpg",
            "alt": "Bảng giới thiệu cáp mạ kẽm ép đùn epoxy có vỏ bọc hdpe, cắt lớp",
            "width": 1536,
            "height": 1024,
        },
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
        "image": {
            "url": "/images/san-pham/cap-du-ung-luc-92d09336.jpg",
            "thumb": "/images/san-pham/cap-du-ung-luc-92d09336-thumb.jpg",
            "alt": "Bảng giới thiệu bó cáp dự ứng lực pc strand",
            "width": 1536,
            "height": 1024,
        },
    },
    {
        "slug": "neo-du-ung-luc",
        "name": "Neo dự ứng lực",
        "description": "Hệ neo đồng bộ cho công tác căng kéo cáp dự ứng lực.",
        "specs": ["Bộ neo chủ động", "Bộ neo cố định (đầu ép chết)", "Neo dẹt", "Neo nối", "Neo công cụ"],
        "applications": ["Dầm cầu", "Hệ cáp DƯL ngoài", "Neo đất, neo mái dốc"],
        "icon": "◉",
        "image": {
            "url": "/images/san-pham/neo-du-ung-luc-45f46464.jpg",
            "thumb": "/images/san-pham/neo-du-ung-luc-45f46464-thumb.jpg",
            "alt": "Bảng giới thiệu đầu neo dự ứng lực và bó cáp",
            "width": 1536,
            "height": 1024,
        },
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
        "image": {
            "url": "/images/san-pham/goi-cau-6600ebc6.jpg",
            "thumb": "/images/san-pham/goi-cau-6600ebc6-thumb.jpg",
            "alt": "Bảng giới thiệu gối cầu lắp đặt trên đỉnh trụ",
            "width": 1536,
            "height": 1024,
        },
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
        "image": {
            "url": "/images/san-pham/khe-co-gian-d407ef3d.jpg",
            "thumb": "/images/san-pham/khe-co-gian-d407ef3d-thumb.jpg",
            "alt": "Bảng giới thiệu khe co giãn trên mặt cầu",
            "width": 1536,
            "height": 1024,
        },
    },
    {
        "slug": "thiet-bi-cang-keo",
        "name": "Thiết bị căng kéo dự ứng lực",
        "description": "Thiết bị phục vụ công tác căng kéo tại hiện trường.",
        "specs": ["Máy bơm thủy lực (hệ thống bơm thông minh)", "Kích thủy lực", "Máy bơm vữa, máy trộn vữa"],
        "applications": ["Thi công căng kéo cáp DƯL", "Bơm vữa ống ghen"],
        "icon": "⚙",
        "image": {
            "url": "/images/san-pham/thiet-bi-cang-keo-0163a0da.jpg",
            "thumb": "/images/san-pham/thiet-bi-cang-keo-0163a0da-thumb.jpg",
            "alt": "Bảng giới thiệu kích thủy lực căng kéo cáp dự ứng lực",
            "width": 1536,
            "height": 1024,
        },
    },
    {
        "slug": "neo-dat-mai-doc",
        "name": "Cấu kiện hệ neo đất ổn định mái dốc",
        "description": "Các cấu kiện sản phẩm cho hệ neo đất, ổn định mái dốc và kè.",
        "specs": ["Bó cáp giằng neo bờ kè", "Neo hệ bắt đai ốc"],
        "applications": ["Gia cố mái dốc", "Kè đê sông", "Công trình cảng biển"],
        "icon": "▲",
        "image": {
            "url": "/images/san-pham/neo-dat-mai-doc-ba51b6da.jpg",
            "thumb": "/images/san-pham/neo-dat-mai-doc-ba51b6da-thumb.jpg",
            "alt": "Bảng giới thiệu hệ neo đất gia cố ổn định mái dốc",
            "width": 1536,
            "height": 1024,
        },
    },
    {
        "slug": "thiet-bi-duong-sat",
        "name": "Thiết bị cho cầu đường sắt",
        "description": "Thiết bị chuyên dụng phục vụ thi công và bảo trì đường sắt.",
        "specs": ["Máy hàn ray", "Máy chèn đường"],
        "applications": ["Thi công đường sắt", "Bảo trì tuyến"],
        "icon": "▬",
        "image": {
            "url": "/images/san-pham/thiet-bi-duong-sat-8580a3e8.jpg",
            "thumb": "/images/san-pham/thiet-bi-duong-sat-8580a3e8-thumb.jpg",
            "alt": "Bảng giới thiệu cầu đường sắt lắp đặt thiết bị chuyên dụng",
            "width": 1536,
            "height": 1024,
        },
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
        "image": {
            "url": "/images/san-pham/thiet-bi-duong-sat-cao-toc-f63b10c5.jpg",
            "thumb": "/images/san-pham/thiet-bi-duong-sat-cao-toc-f63b10c5-thumb.jpg",
            "alt": "Bảng giới thiệu máy đào hầm tbm và thiết bị thi công đường sắt cao tốc",
            "width": 1536,
            "height": 1024,
        },
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
        "Sửa chữa, lắp đặt và cung cấp khe co giãn mô đun SSFB320.",
        "completed",
    ),
    (
        "cau-song-rang-long-son-cai-mep",
        "Đường Long Sơn – Cái Mép, hạng mục cầu Sông Rạng",
        2025,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)",
        "TP. Vũng Tàu và TX. Phú Mỹ, Bà Rịa – Vũng Tàu",
        "Thi công lắp đặt và cung cấp hệ cáp treo cầu vòm thép: cáp treo 11 tấn, 195 bộ neo cáp, 337 m ống thép inox D89.",
        "completed",
    ),
    (
        "cau-can-giuoc-thay-he-cap",
        "Thay thế hệ cáp cầu vòm cầu Cần Giuộc, tuyến SF đường Nguyễn Văn Linh",
        2025,
        "Công ty TNHH Phát triển Phú Mỹ Hưng",
        "TP. Hồ Chí Minh",
        "Thi công lắp đặt và cung cấp hệ cáp giằng 51 tấn và cáp treo 10 tấn.",
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
        "Thi công lắp đặt, căng kéo và cung cấp hệ cáp DƯL ngoài: bó cáp 19T-15.2 bọc epoxy và PE từng tao, khối lượng khoảng 150 tấn.",
        "completed",
    ),
    (
        "cau-dai-ngai-2-ql60",
        "Cầu Đại Ngãi trên QL60 — Gói thầu 11-XL thi công cầu Đại Ngãi 2, phần tuyến và các công trình trên tuyến",
        2025,
        "Liên danh Tổng Công ty Xây dựng số 1 – CTCP, CTCP ĐTXD Trường Sơn, CTCP Tập đoàn Đạt Phương, CTCP Tập đoàn Thuận An – TAG",
        "Trà Vinh – Sóc Trăng",
        "Thi công lắp đặt, căng kéo và cung cấp hệ cáp DƯL ngoài: bó cáp 19T-15.2 bọc epoxy và PE từng tao, tao cáp chạy trong ống HDPE, khối lượng khoảng 104 tấn.",
        "completed",
    ),
    (
        "cau-tra-khuc-ql1",
        "Sửa chữa đột xuất đảm bảo ATGT cầu Trà Khúc Km1056+076, Quốc lộ 1",
        2024,
        "Công ty TNHH ĐTXD & DVTM Hòa Hoàng (nhà thầu thi công)",
        "Tỉnh Quảng Ngãi",
        "Lắp đặt, căng kéo và cung cấp hệ cáp DƯL ngoài: bó cáp 15T-15.2 bọc epoxy và HDPE từng tao, khối lượng 36,97 tấn.",
        "completed",
    ),
    (
        "cau-vuot-song-van-ninh-binh",
        "Đầu tư xây dựng cầu vượt sông Vân và đường dẫn phía tây sông Vân",
        2024,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO) — CTCP Đầu tư và Xây dựng Tín Thịnh",
        "Tỉnh Ninh Bình",
        "Thi công lắp đặt và cung cấp hệ neo cáp treo vòm: bó cáp 3T-15.2 bọc epoxy, ép đùn HDPE 2 lớp, khối lượng 5,71 tấn.",
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
        "Thi công lắp đặt và cung cấp hệ cáp giằng 51 tấn và cáp treo 10 tấn; cáp treo vòm loại 55W7 và 16 bó cáp giằng 22T-15.2 mm.",
        "completed",
    ),
    (
        "cau-phu-thinh-lao-cai",
        "Cầu Phú Thịnh nối Quốc lộ 4E với khu đô thị Vạn Hoà",
        2023,
        "CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)",
        "TP. Lào Cai, tỉnh Lào Cai",
        "Thi công lắp đặt và cung cấp hệ neo cáp treo vòm loại 49W7, 35W7, 31W7 — bó cáp thành phẩm dùng dây thép mạ kẽm song song, ép đùn HDPE 2 lớp, khối lượng 14 tấn.",
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
        "Thi công lắp đặt và cung cấp 8 bó cáp giằng thành phẩm loại 7x15.2, tao cáp mạ kẽm bọc HDPE từng tao và 2 lớp HDPE bọc ngoài bó; mỗi bó dài 57,6 m, khối lượng 6 tấn.",
        "completed",
    ),
    (
        "sua-chua-cau-tan-de-ql10",
        "Sửa chữa cầu Tân Đệ Km99+200, Quốc lộ 10",
        2022,
        "Tổng Công ty Xây dựng công trình giao thông 8 – CTCP",
        "Tỉnh Thái Bình",
        "Thi công lắp đặt, căng kéo và cung cấp 27 bó cáp DƯL ngoài loại 19T15.2 và 18T15.2, mỗi bó dài 73–120 m, tao cáp mạ kẽm bọc HDPE từng tao và cả bó, khối lượng 70 tấn.",
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
# Photo montages lifted from the capability profile. They read fine full-size on
# a detail page, but cropped into a 16:10 card they turn to mush against a white
# ground, so these keep the drawn card cover and show the montage in the gallery.
_MONTAGE_ONLY = {
    "cung-cap-vat-tu-thi-cong-cau-2018",
}

_PROJECT_MEDIA: dict[str, list[dict]] = {
    "cau-nguyen-huu-canh": [
        {
            "url": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-cddafdeb.jpg",
            "thumb": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-cddafdeb-thumb.jpg",
            "alt": "Lắp đặt và căng kéo cáp dự ứng lực ngoài tại cầu Nguyễn Hữu Cảnh",
            "width": 802,
            "height": 1081,
        },
        {
            "url": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-09654685.jpg",
            "thumb": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-09654685-thumb.jpg",
            "alt": "Lắp đặt và căng kéo cáp dự ứng lực ngoài tại cầu Nguyễn Hữu Cảnh",
            "width": 802,
            "height": 1099,
        },
        {
            "url": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-f79b6b1f.jpg",
            "thumb": "/images/cau-nguyen-huu-canh/cang-keo-cap-cau-nguyen-huu-canh-f79b6b1f-thumb.jpg",
            "alt": "Lắp đặt và căng kéo cáp dự ứng lực ngoài tại cầu Nguyễn Hữu Cảnh",
            "width": 833,
            "height": 1081,
        },
    ],
    "cau-mong-sen-lao-cai": [
        {
            "url": "/images/cau-mong-sen-lao-cai/lap-dat-va-cang-keo-cap-cau-mong-sen-7baaeaf8.jpg",
            "thumb": None,
            "alt": "Lắp đặt ống gen và căng kéo cáp dự ứng lực tại cầu Móng Sến",
            "width": 379,
            "height": 453,
        },
        {
            "url": "/images/cau-mong-sen-lao-cai/lap-dat-va-cang-keo-cap-cau-mong-sen-95d1d0b0.jpg",
            "thumb": None,
            "alt": "Lắp đặt ống gen và căng kéo cáp dự ứng lực tại cầu Móng Sến",
            "width": 383,
            "height": 511,
        },
        {
            "url": "/images/cau-mong-sen-lao-cai/lap-dat-va-cang-keo-cap-cau-mong-sen-b759b806.jpg",
            "thumb": None,
            "alt": "Lắp đặt ống gen và căng kéo cáp dự ứng lực tại cầu Móng Sến",
            "width": 400,
            "height": 510,
        },
        {
            "url": "/images/cau-mong-sen-lao-cai/lap-dat-va-cang-keo-cap-cau-mong-sen-cf199e6f.jpg",
            "thumb": None,
            "alt": "Lắp đặt ống gen và căng kéo cáp dự ứng lực tại cầu Móng Sến",
            "width": 404,
            "height": 449,
        },
    ],
    "cau-tra-khuc-ql1": [
        {
            "url": "/images/cau-tra-khuc-ql1/sua-chua-cau-tra-khuc-2-f2b78790.jpg",
            "thumb": "/images/cau-tra-khuc-ql1/sua-chua-cau-tra-khuc-2-f2b78790-thumb.jpg",
            "alt": "Sửa chữa cầu Trà Khúc 2 trên Quốc lộ 1",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-tra-khuc-ql1/sua-chua-cau-tra-khuc-2-6bc6cb19.jpg",
            "thumb": None,
            "alt": "Sửa chữa cầu Trà Khúc 2 trên Quốc lộ 1",
            "width": 563,
            "height": 389,
        },
        {
            "url": "/images/cau-tra-khuc-ql1/sua-chua-cau-tra-khuc-2-7ad750f8.jpg",
            "thumb": None,
            "alt": "Sửa chữa cầu Trà Khúc 2 trên Quốc lộ 1",
            "width": 562,
            "height": 422,
        },
    ],
    "cau-xom-cui-thay-he-cap": [
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-b95f3b09.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-b95f3b09-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-352afd83.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-352afd83-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-b7dbb845.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-b7dbb845-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-bd9c3461.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-bd9c3461-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-daf510ce.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-treo-cau-xom-cui-daf510ce-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 618,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-49f575de.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-49f575de-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-6b9e6ca9.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-6b9e6ca9-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-a79c3020.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-a79c3020-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 825,
            "height": 619,
        },
        {
            "url": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-ea530bbf.jpg",
            "thumb": "/images/cau-xom-cui-thay-he-cap/thay-cap-giang-cau-xom-cui-ea530bbf-thumb.jpg",
            "alt": "Thay thế hệ cáp treo và cáp giằng cầu vòm Xóm Củi",
            "width": 820,
            "height": 619,
        },
    ],
    "cau-nhon-trach-vanh-dai-3": [
        {
            "url": "/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-01-f16caf22.jpg",
            "thumb": "/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-01-f16caf22-thumb.jpg",
            "alt": "Toàn cảnh cầu Nhơn Trạch trên đường Vành đai 3 TP. Hồ Chí Minh đang thi công",
            "width": 1536,
            "height": 529,
        },
        {
            "url": "/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-02-e07fd1fb.jpg",
            "thumb": None,
            "alt": "Trụ tháp và hệ dây văng cầu Nhơn Trạch",
            "width": 505,
            "height": 491,
        },
        {
            "url": "/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-03-7c0a9803.jpg",
            "thumb": None,
            "alt": "Xe đúc hẫng thi công dầm cầu Nhơn Trạch",
            "width": 468,
            "height": 491,
        },
        {
            "url": "/images/cau-nhon-trach-vanh-dai-3/cau-nhon-trach-vanh-dai-3-04-2a9da8fc.jpg",
            "thumb": None,
            "alt": "Cầu Nhơn Trạch sau khi thông xe và biển tên công trình",
            "width": 555,
            "height": 491,
        },
    ],
    "cau-dai-ngai-2-ql60": [
        {
            "url": "/images/cau-dai-ngai-2-ql60/cau-dai-ngai-2-ql60-01-5d65df74.jpg",
            "thumb": "/images/cau-dai-ngai-2-ql60/cau-dai-ngai-2-ql60-01-5d65df74-thumb.jpg",
            "alt": "Toàn cảnh cầu dây văng Đại Ngãi 2 vượt sông Hậu đang thi công",
            "width": 1536,
            "height": 514,
        },
        {
            "url": "/images/cau-dai-ngai-2-ql60/cau-dai-ngai-2-ql60-02-d01e3144.jpg",
            "thumb": None,
            "alt": "Trụ tháp và hệ dây văng cầu Đại Ngãi 2 trong quá trình thi công",
            "width": 360,
            "height": 507,
        },
        {
            "url": "/images/cau-dai-ngai-2-ql60/cau-dai-ngai-2-ql60-03-185f092c.jpg",
            "thumb": None,
            "alt": "Thi công cốt thép mặt cầu và hệ dây văng cầu Đại Ngãi 2",
            "width": 364,
            "height": 507,
        },
        {
            "url": "/images/cau-dai-ngai-2-ql60/cau-dai-ngai-2-ql60-04-eac73be0.jpg",
            "thumb": None,
            "alt": "Đường dẫn cầu Đại Ngãi 2 và biển thông tin gói thầu 11-XL",
            "width": 803,
            "height": 507,
        },
    ],
    "cau-gioi-phien-yen-bai": [
        {
            "url": "/images/cau-gioi-phien-yen-bai/cau-gioi-phien-yen-bai-01-3c52073b.jpg",
            "thumb": "/images/cau-gioi-phien-yen-bai/cau-gioi-phien-yen-bai-01-3c52073b-thumb.jpg",
            "alt": "Cầu Giới Phiên vượt sông Hồng đã đưa vào khai thác",
            "width": 1536,
            "height": 1024,
        },
        {
            "url": "/images/cau-gioi-phien-yen-bai/thi-cong-cau-gioi-phien-29783144.jpg",
            "thumb": "/images/cau-gioi-phien-yen-bai/thi-cong-cau-gioi-phien-29783144-thumb.jpg",
            "alt": "Thi công hệ cáp và thiết bị tại cầu Giới Phiên",
            "width": 773,
            "height": 1021,
        },
    ],
    "cau-phong-chau-moi-ql32c": [
        {
            "url": "/images/cau-phong-chau-moi-ql32c/cau-phong-chau-moi-ql32c-01-ba9839f5.jpg",
            "thumb": "/images/cau-phong-chau-moi-ql32c/cau-phong-chau-moi-ql32c-01-ba9839f5-thumb.jpg",
            "alt": "Toàn cảnh cầu Phong Châu mới trên QL32C đang thi công",
            "width": 1536,
            "height": 658,
        },
        {
            "url": "/images/cau-phong-chau-moi-ql32c/cau-phong-chau-moi-ql32c-02-0e1ca43c.jpg",
            "thumb": None,
            "alt": "Lao lắp dầm cầu Phong Châu mới",
            "width": 507,
            "height": 362,
        },
        {
            "url": "/images/cau-phong-chau-moi-ql32c/cau-phong-chau-moi-ql32c-03-86c8540c.jpg",
            "thumb": None,
            "alt": "Thi công cốt thép mặt cầu Phong Châu mới",
            "width": 513,
            "height": 362,
        },
        {
            "url": "/images/cau-phong-chau-moi-ql32c/cau-phong-chau-moi-ql32c-04-bbbdaf1d.jpg",
            "thumb": None,
            "alt": "Trụ cầu và thiết bị thi công trên sông tại cầu Phong Châu mới",
            "width": 508,
            "height": 362,
        },
    ],
    "cau-vuot-song-van-ninh-binh": [
        {
            "url": "/images/cau-vuot-song-van-ninh-binh/thi-cong-cau-song-van-1b5ee5bc.jpg",
            "thumb": None,
            "alt": "Thi công cầu vượt sông Vân, Ninh Bình",
            "width": 839,
            "height": 509,
        },
        {
            "url": "/images/cau-vuot-song-van-ninh-binh/thi-cong-cau-song-van-2b6f1f27.jpg",
            "thumb": None,
            "alt": "Thi công cầu vượt sông Vân, Ninh Bình",
            "width": 791,
            "height": 508,
        },
        {
            "url": "/images/cau-vuot-song-van-ninh-binh/thi-cong-cau-song-van-f0c283bb.jpg",
            "thumb": None,
            "alt": "Thi công cầu vượt sông Vân, Ninh Bình",
            "width": 505,
            "height": 381,
        },
    ],
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
    # Aerial site photos, one per project. Unlike the montages above these crop
    # cleanly into a 16:10 card, so they double as the project cover.
    "duong-sat-toc-do-cao-ha-noi-quang-ninh": [
        {
            "url": "/images/duong-sat-toc-do-cao-ha-noi-quang-ninh/thi-cong-cau-vuot-song-duong-duong-sat-toc-do-cao-7d837405.jpg",
            "thumb": "/images/duong-sat-toc-do-cao-ha-noi-quang-ninh/thi-cong-cau-vuot-song-duong-duong-sat-toc-do-cao-7d837405-thumb.jpg",
            "alt": "Thi công cầu vượt sông Đuống thuộc tuyến đường sắt tốc độ cao Hà Nội – Quảng Ninh",
            "width": 1536,
            "height": 578,
        },
        {
            "url": "/images/duong-sat-toc-do-cao-ha-noi-quang-ninh/cac-cau-vuot-tren-tuyen-duong-sat-toc-do-cao-8cc54354.jpg",
            "thumb": "/images/duong-sat-toc-do-cao-ha-noi-quang-ninh/cac-cau-vuot-tren-tuyen-duong-sat-toc-do-cao-8cc54354-thumb.jpg",
            "alt": "Các cầu vượt trên tuyến đường sắt tốc độ cao Hà Nội – Quảng Ninh đang thi công",
            "width": 1536,
            "height": 1024,
        },
    ],
    "cau-giai-phong-9-rach-gia": [
        {
            "url": "/images/cau-giai-phong-9-rach-gia/cau-giai-phong-9-rach-gia-01-3e37dad3.jpg",
            "thumb": "/images/cau-giai-phong-9-rach-gia/cau-giai-phong-9-rach-gia-01-3e37dad3-thumb.jpg",
            "alt": "Toàn cảnh cầu Giải Phóng 9 vượt sông tại thành phố Rạch Giá",
            "width": 1536,
            "height": 598,
        },
        {
            "url": "/images/cau-giai-phong-9-rach-gia/cau-giai-phong-9-rach-gia-02-675b7c5a.jpg",
            "thumb": None,
            "alt": "Nhịp dẫn cầu Giải Phóng 9 nhìn từ bờ",
            "width": 526,
            "height": 422,
        },
        {
            "url": "/images/cau-giai-phong-9-rach-gia/cau-giai-phong-9-rach-gia-03-6800ff0d.jpg",
            "thumb": None,
            "alt": "Trụ tháp cầu Giải Phóng 9 nhìn từ mặt cầu",
            "width": 477,
            "height": 422,
        },
        {
            "url": "/images/cau-giai-phong-9-rach-gia/cau-giai-phong-9-rach-gia-04-69495423.jpg",
            "thumb": None,
            "alt": "Cầu Giải Phóng 9 nhìn từ phía hạ lưu",
            "width": 526,
            "height": 422,
        },
    ],
    "cau-long-thanh-khe-co-gian-p26": [
        {
            "url": "/images/cau-long-thanh-khe-co-gian-p26/sua-chua-khe-co-gian-cau-long-thanh-cc6ca3fb.jpg",
            "thumb": "/images/cau-long-thanh-khe-co-gian-p26/sua-chua-khe-co-gian-cau-long-thanh-cc6ca3fb-thumb.jpg",
            "alt": "Sửa chữa khe co giãn trên mặt cầu Long Thành, cao tốc TP. Hồ Chí Minh – Long Thành – Dầu Giây",
            "width": 1600,
            "height": 659,
        },
    ],
    "cau-song-rang-long-son-cai-mep": [
        {
            "url": "/images/cau-song-rang-long-son-cai-mep/thi-cong-cau-song-rang-long-son-cai-mep-7738ab78.jpg",
            "thumb": "/images/cau-song-rang-long-son-cai-mep/thi-cong-cau-song-rang-long-son-cai-mep-7738ab78-thumb.jpg",
            "alt": "Lao lắp dầm cầu Sông Rạng trên tuyến đường Long Sơn – Cái Mép",
            "width": 1660,
            "height": 961,
        },
    ],
    "cau-can-giuoc-thay-he-cap": [
        {
            "url": "/images/cau-can-giuoc-thay-he-cap/thay-he-cap-cau-vom-can-giuoc-36f7ce62.jpg",
            "thumb": "/images/cau-can-giuoc-thay-he-cap/thay-he-cap-cau-vom-can-giuoc-36f7ce62-thumb.jpg",
            "alt": "Thay thế hệ cáp cầu vòm Cần Giuộc trên tuyến đường Nguyễn Văn Linh",
            "width": 1652,
            "height": 957,
        },
    ],
    "cau-non-nuoc-ql10": [
        {
            "url": "/images/cau-non-nuoc-ql10/sua-chua-cau-non-nuoc-ql10-c992eb3a.jpg",
            "thumb": "/images/cau-non-nuoc-ql10/sua-chua-cau-non-nuoc-ql10-c992eb3a-thumb.jpg",
            "alt": "Sửa chữa mặt cầu Non Nước Km135+905 trên Quốc lộ 10",
            "width": 1652,
            "height": 965,
        },
    ],
    "cau-song-hieu": [
        {
            "url": "/images/cau-song-hieu/phoi-canh-cau-song-hieu-fcfcbdef.jpg",
            "thumb": None,
            "alt": "Phối cảnh thiết kế cầu Sông Hiếu vượt sông Hiếu, Quảng Trị",
            "width": 843,
            "height": 572,
        },
    ],
    "cau-tuan-hue": [
        {
            "url": "/images/cau-tuan-hue/cau-tuan-hue-b6a7ce4a.jpg",
            "thumb": None,
            "alt": "Mặt cầu Tuần trên tuyến tránh phía tây thành phố Huế",
            "width": 700,
            "height": 393,
        },
    ],
    "cau-vuot-ql51": [
        {
            "url": "/images/cau-vuot-ql51/cau-vuot-ql51-01-ff617c1d.jpg",
            "thumb": "/images/cau-vuot-ql51/cau-vuot-ql51-01-ff617c1d-thumb.jpg",
            "alt": "Cầu vượt Quốc lộ 51 nhìn từ trên cao",
            "width": 1672,
            "height": 941,
        },
    ],
    "cau-hoa-binh-2-goi-khe": [
        {
            "url": "/images/cau-hoa-binh-2-goi-khe/cau-hoa-binh-2-goi-khe-01-4c5128ba.jpg",
            "thumb": "/images/cau-hoa-binh-2-goi-khe/cau-hoa-binh-2-goi-khe-01-4c5128ba-thumb.jpg",
            "alt": "Gối cầu đã lắp đặt trên đỉnh trụ cầu Hòa Bình 2",
            "width": 1448,
            "height": 556,
        },
        {
            "url": "/images/cau-hoa-binh-2-goi-khe/cau-hoa-binh-2-goi-khe-02-ac92fb4f.jpg",
            "thumb": "/images/cau-hoa-binh-2-goi-khe/cau-hoa-binh-2-goi-khe-02-ac92fb4f-thumb.jpg",
            "alt": "Khe co giãn răng lược trên mặt cầu Hòa Bình 2",
            "width": 1448,
            "height": 525,
        },
    ],
    "cau-hoa-binh-2-cap-day-vang": [
        {
            "url": "/images/cau-hoa-binh-2-cap-day-vang/cau-hoa-binh-2-cap-day-vang-01-7ba6b275.jpg",
            "thumb": "/images/cau-hoa-binh-2-cap-day-vang/cau-hoa-binh-2-cap-day-vang-01-7ba6b275-thumb.jpg",
            "alt": "Hệ cáp dây văng cầu Hòa Bình 2 nhìn từ mặt cầu",
            "width": 1448,
            "height": 1086,
        },
    ],
    "cau-ngoi-gianh-phu-tho": [
        {
            "url": "/images/cau-ngoi-gianh-phu-tho/cau-ngoi-gianh-phu-tho-01-f9ce2f30.jpg",
            "thumb": "/images/cau-ngoi-gianh-phu-tho/cau-ngoi-gianh-phu-tho-01-f9ce2f30-thumb.jpg",
            "alt": "Cầu Ngòi Giành trên QL32C, tỉnh Phú Thọ",
            "width": 1536,
            "height": 609,
        },
        {
            "url": "/images/cau-ngoi-gianh-phu-tho/cau-ngoi-gianh-phu-tho-02-75d7380b.jpg",
            "thumb": None,
            "alt": "Bảng thông tin công trình cầu Ngòi Giành",
            "width": 432,
            "height": 408,
        },
        {
            "url": "/images/cau-ngoi-gianh-phu-tho/cau-ngoi-gianh-phu-tho-03-de881c7e.jpg",
            "thumb": None,
            "alt": "Mặt cầu Ngòi Giành sau khi hoàn thành",
            "width": 576,
            "height": 408,
        },
        {
            "url": "/images/cau-ngoi-gianh-phu-tho/cau-ngoi-gianh-phu-tho-04-a53bee8a.jpg",
            "thumb": None,
            "alt": "Trụ và dầm cầu Ngòi Giành nhìn từ dưới",
            "width": 515,
            "height": 408,
        },
    ],
    "cau-phu-thinh-lao-cai": [
        {
            "url": "/images/cau-phu-thinh-lao-cai/cau-phu-thinh-lao-cai-01-49db8ed4.jpg",
            "thumb": "/images/cau-phu-thinh-lao-cai/cau-phu-thinh-lao-cai-01-49db8ed4-thumb.jpg",
            "alt": "Cầu Phú Thịnh nối Quốc lộ 4E với khu đô thị Vạn Hòa, Lào Cai",
            "width": 1536,
            "height": 1024,
        },
    ],
    "cau-rach-vong-long-an": [
        {
            "url": "/images/cau-rach-vong-long-an/cau-rach-vong-long-an-01-4a1945a1.jpg",
            "thumb": "/images/cau-rach-vong-long-an/cau-rach-vong-long-an-01-4a1945a1-thumb.jpg",
            "alt": "Cầu Rạch Vông, tỉnh Long An",
            "width": 1536,
            "height": 627,
        },
        {
            "url": "/images/cau-rach-vong-long-an/cau-rach-vong-long-an-02-5e4cd468.jpg",
            "thumb": None,
            "alt": "Bảng thông tin công trình cầu Rạch Vông",
            "width": 459,
            "height": 390,
        },
        {
            "url": "/images/cau-rach-vong-long-an/cau-rach-vong-long-an-03-afe5abce.jpg",
            "thumb": None,
            "alt": "Mặt cầu Rạch Vông sau khi hoàn thành",
            "width": 574,
            "height": 390,
        },
        {
            "url": "/images/cau-rach-vong-long-an/cau-rach-vong-long-an-04-7c8d6c1d.jpg",
            "thumb": None,
            "alt": "Trụ và dầm cầu Rạch Vông nhìn từ dưới",
            "width": 489,
            "height": 390,
        },
    ],
    "cau-tan-de-neo-kich": [
        {
            "url": "/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-01-b7d6c044.jpg",
            "thumb": "/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-01-b7d6c044-thumb.jpg",
            "alt": "Cầu Tân Đệ Km99+200 trên Quốc lộ 10",
            "width": 1536,
            "height": 515,
        },
        {
            "url": "/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-02-566e8f51.jpg",
            "thumb": "/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-02-566e8f51-thumb.jpg",
            "alt": "Neo dự ứng lực tại đầu dầm cầu Tân Đệ",
            "width": 622,
            "height": 503,
        },
        {
            "url": "/images/cau-tan-de-neo-kich/cau-tan-de-neo-kich-03-76530b55.jpg",
            "thumb": None,
            "alt": "Kích thủy lực căng kéo cáp dự ứng lực tại cầu Tân Đệ",
            "width": 908,
            "height": 503,
        },
    ],
    "cau-tang-long-cau-1-thang-long": [
        {
            "url": "/images/cau-tang-long-cau-1-thang-long/cau-tang-long-cau-1-thang-long-01-71076877.jpg",
            "thumb": None,
            "alt": "Cầu Tăng Long sau khi khánh thành ngày 26/10/2013",
            "width": 872,
            "height": 462,
        },
        {
            "url": "/images/cau-tang-long-cau-1-thang-long/cau-tang-long-cau-1-thang-long-02-fee865d7.jpg",
            "thumb": "/images/cau-tang-long-cau-1-thang-long/cau-tang-long-cau-1-thang-long-02-fee865d7-thumb.jpg",
            "alt": "Tổng hợp hình ảnh gói thầu Cầu 1 Thăng Long tại cầu Tăng Long",
            "width": 1536,
            "height": 1024,
        },
    ],
    "cau-tang-long-co-khi-4": [
        {
            "url": "/images/cau-tang-long-co-khi-4/cau-tang-long-co-khi-4-01-6e8728c9.jpg",
            "thumb": None,
            "alt": "Cầu Tăng Long sau khi khánh thành ngày 26/10/2013",
            "width": 767,
            "height": 480,
        },
        {
            "url": "/images/cau-tang-long-co-khi-4/cau-tang-long-co-khi-4-02-a1a37cf4.jpg",
            "thumb": "/images/cau-tang-long-co-khi-4/cau-tang-long-co-khi-4-02-a1a37cf4-thumb.jpg",
            "alt": "Tổng hợp hình ảnh gói thầu Cơ khí 4 Thăng Long tại cầu Tăng Long",
            "width": 1536,
            "height": 1024,
        },
    ],
    "cau-vuot-hoang-minh-giam": [
        {
            "url": "/images/cau-vuot-hoang-minh-giam/cau-vuot-hoang-minh-giam-01-3879c1d0.jpg",
            "thumb": None,
            "alt": "Cầu vượt nút giao Hoàng Minh Giám – Nguyễn Chánh sau khi thông xe",
            "width": 600,
            "height": 450,
        },
    ],
    "cau-vuot-o-dong-mac": [
        {
            "url": "/images/cau-vuot-o-dong-mac/cau-vuot-o-dong-mac-01-c23ac62d.jpg",
            "thumb": "/images/cau-vuot-o-dong-mac/cau-vuot-o-dong-mac-01-c23ac62d-thumb.jpg",
            "alt": "Cầu vượt Ô Đông Mác – Nguyễn Khoái trên phố Đại Cồ Việt về đêm",
            "width": 800,
            "height": 532,
        },
    ],
    "cung-cap-vat-tu-thi-cong-cau-2018": [
        {
            "url": "/images/cung-cap-vat-tu-thi-cong-cau-2018/cung-cap-vat-tu-thi-cong-cau-2018-01-813e6dfe.jpg",
            "thumb": "/images/cung-cap-vat-tu-thi-cong-cau-2018/cung-cap-vat-tu-thi-cong-cau-2018-01-813e6dfe-thumb.jpg",
            "alt": "Tổng hợp các nhóm vật tư thi công cầu do Hòa Hoàng cung cấp",
            "width": 1536,
            "height": 1024,
        },
    ],
    "ke-bo-song-cai-nha-trang": [
        {
            "url": "/images/ke-bo-song-cai-nha-trang/ke-bo-song-cai-nha-trang-01-c7069c57.jpg",
            "thumb": "/images/ke-bo-song-cai-nha-trang/ke-bo-song-cai-nha-trang-01-c7069c57-thumb.jpg",
            "alt": "Kè bờ sông Cái, TP. Nha Trang sau khi hoàn thành",
            "width": 1536,
            "height": 626,
        },
        {
            "url": "/images/ke-bo-song-cai-nha-trang/ke-bo-song-cai-nha-trang-02-a266be7f.jpg",
            "thumb": None,
            "alt": "Bảng thông tin công trình kè bờ sông Cái",
            "width": 523,
            "height": 390,
        },
        {
            "url": "/images/ke-bo-song-cai-nha-trang/ke-bo-song-cai-nha-trang-03-95e9a0c2.jpg",
            "thumb": None,
            "alt": "Thân kè bê tông dọc bờ sông Cái",
            "width": 491,
            "height": 390,
        },
        {
            "url": "/images/ke-bo-song-cai-nha-trang/ke-bo-song-cai-nha-trang-04-a9ed58b3.jpg",
            "thumb": None,
            "alt": "Mái kè và hệ thống thoát nước bờ sông Cái",
            "width": 508,
            "height": 390,
        },
    ],
    "nut-giao-vanh-dai-3-ha-noi": [
        {
            "url": "/images/nut-giao-vanh-dai-3-ha-noi/nut-giao-vanh-dai-3-ha-noi-01-7a8086eb.jpg",
            "thumb": "/images/nut-giao-vanh-dai-3-ha-noi/nut-giao-vanh-dai-3-ha-noi-01-7a8086eb-thumb.jpg",
            "alt": "Phối cảnh nút giao Vành đai 3 và các nhánh rẽ",
            "width": 1600,
            "height": 900,
        },
    ],
    "sua-chua-cau-tan-de-ql10": [
        {
            "url": "/images/sua-chua-cau-tan-de-ql10/sua-chua-cau-tan-de-ql10-01-f1639e13.jpg",
            "thumb": "/images/sua-chua-cau-tan-de-ql10/sua-chua-cau-tan-de-ql10-01-f1639e13-thumb.jpg",
            "alt": "Biển thông báo sửa chữa cầu Tân Đệ Km99+200 QL10 trên mặt cầu",
            "width": 1536,
            "height": 599,
        },
        {
            "url": "/images/sua-chua-cau-tan-de-ql10/sua-chua-cau-tan-de-ql10-02-a5dd033c.jpg",
            "thumb": None,
            "alt": "Bảng thông tin cầu Tân Đệ Km99+200 QL10",
            "width": 456,
            "height": 417,
        },
        {
            "url": "/images/sua-chua-cau-tan-de-ql10/sua-chua-cau-tan-de-ql10-03-61003426.jpg",
            "thumb": None,
            "alt": "Thi công cốt thép mặt cầu Tân Đệ",
            "width": 503,
            "height": 417,
        },
        {
            "url": "/images/sua-chua-cau-tan-de-ql10/sua-chua-cau-tan-de-ql10-04-2c578aa3.jpg",
            "thumb": None,
            "alt": "Giàn giáo thi công dưới gầm cầu Tân Đệ",
            "width": 562,
            "height": 417,
        },
    ],
    "tuyen-ket-noi-cau-gie-ninh-binh-ql1": [
        {
            "url": "/images/tuyen-ket-noi-cau-gie-ninh-binh-ql1/tuyen-ket-noi-cau-gie-ninh-binh-ql1-01-2d4a6862.jpg",
            "thumb": "/images/tuyen-ket-noi-cau-gie-ninh-binh-ql1/tuyen-ket-noi-cau-gie-ninh-binh-ql1-01-2d4a6862-thumb.jpg",
            "alt": "Tuyến đường kết nối cao tốc Cầu Giẽ – Ninh Bình với Quốc lộ 1 sau khi thông xe",
            "width": 1536,
            "height": 601,
        },
        {
            "url": "/images/tuyen-ket-noi-cau-gie-ninh-binh-ql1/tuyen-ket-noi-cau-gie-ninh-binh-ql1-02-27be7d2d.jpg",
            "thumb": None,
            "alt": "Bảng thông tin dự án tuyến kết nối cao tốc Cầu Giẽ – Ninh Bình",
            "width": 443,
            "height": 417,
        },
        {
            "url": "/images/tuyen-ket-noi-cau-gie-ninh-binh-ql1/tuyen-ket-noi-cau-gie-ninh-binh-ql1-03-e54cfb56.jpg",
            "thumb": None,
            "alt": "Mặt đường tuyến kết nối sau khi hoàn thành",
            "width": 502,
            "height": 417,
        },
        {
            "url": "/images/tuyen-ket-noi-cau-gie-ninh-binh-ql1/tuyen-ket-noi-cau-gie-ninh-binh-ql1-04-7199c4de.jpg",
            "thumb": None,
            "alt": "Nút giao trên tuyến kết nối nhìn từ trên cao",
            "width": 579,
            "height": 417,
        },
    ],
}

# Whether Hoa Hoang built it or only supplied the materials, plus which service
# the work belongs to. Read off the scope text of each row above — a scope that
# says "thi công", "lắp đặt" or "căng kéo" is construction; one that stops at
# "cung cấp" or "hướng dẫn thi công" is supply, and the site says so.
# Shape: slug -> (role, work_types, structure_type)
_PROJECT_CLASSIFICATION: dict[str, tuple[str, list[str], str | None]] = {
    "duong-sat-toc-do-cao-ha-noi-quang-ninh": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Đường sắt tốc độ cao"),
    "cau-giai-phong-9-rach-gia": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-long-thanh-khe-co-gian-p26": ("construction", ["thay-the-khe-co-gian"], "Cầu trên cao tốc"),
    "cau-song-rang-long-son-cai-mep": ("construction", ["he-cap-cau"], "Cầu vòm thép"),
    "cau-can-giuoc-thay-he-cap": ("construction", ["thay-the-he-cap"], "Cầu vòm"),
    "cau-phong-chau-moi-ql32c": ("supply", ["cung-cap-vat-tu-thiet-bi", "dich-vu-ky-thuat-hien-truong"], "Cầu đường bộ"),
    "cau-may-chai-vu-yen": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu dây văng"),
    "cau-nhon-trach-vanh-dai-3": ("construction", ["cang-keo-du-ung-luc-ngoai"], "Cầu dây văng"),
    "cau-dai-ngai-2-ql60": ("construction", ["cang-keo-du-ung-luc-ngoai"], "Cầu dây văng"),
    "cau-tra-khuc-ql1": ("construction", ["cang-keo-du-ung-luc-ngoai", "tang-cuong-cau-cu"], "Cầu đường bộ"),
    "cau-vuot-song-van-ninh-binh": ("construction", ["he-cap-cau"], "Cầu vòm"),
    "cau-non-nuoc-ql10": ("supply", ["cung-cap-vat-tu-thiet-bi", "thay-the-goi-cau"], "Cầu đường bộ"),
    "cau-xom-cui-thay-he-cap": ("construction", ["thay-the-he-cap"], "Cầu vòm"),
    "cau-phu-thinh-lao-cai": ("construction", ["he-cap-cau"], "Cầu vòm"),
    "cau-gioi-phien-yen-bai": ("supply", ["cung-cap-vat-tu-thiet-bi", "dich-vu-ky-thuat-hien-truong"], "Cầu vòm thép"),
    "cau-nguyen-huu-canh": ("construction", ["he-cap-cau"], "Cầu vòm"),
    "sua-chua-cau-tan-de-ql10": ("construction", ["cang-keo-du-ung-luc-ngoai", "tang-cuong-cau-cu"], "Cầu đường bộ"),
    "ke-bo-song-cai-nha-trang": ("supply", ["cung-cap-vat-tu-thiet-bi", "neo-dat-mai-doc"], "Kè bờ sông"),
    "cau-mong-sen-lao-cai": ("construction", ["cang-keo-du-ung-luc-ngoai"], "Cầu cạn"),
    "cau-vuot-ql51": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu vượt"),
    "cau-hoa-binh-2-cap-day-vang": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu dây văng"),
    "cau-hoa-binh-2-goi-khe": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-song-hieu": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-tan-de-neo-kich": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-rach-vong-long-an": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-tuan-hue": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "nut-giao-vanh-dai-3-ha-noi": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Nút giao, cầu vượt"),
    "cau-ngoi-gianh-phu-tho": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "tuyen-ket-noi-cau-gie-ninh-binh-ql1": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu dầm Super T"),
    "cung-cap-vat-tu-thi-cong-cau-2018": ("supply", ["cung-cap-vat-tu-thiet-bi"], None),
    "cau-tang-long-co-khi-4": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-tang-long-cau-1-thang-long": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu đường bộ"),
    "cau-vuot-o-dong-mac": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu vượt"),
    "cau-vuot-hoang-minh-giam": ("supply", ["cung-cap-vat-tu-thiet-bi"], "Cầu vượt"),
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
        role=_PROJECT_CLASSIFICATION.get(slug, ("supply", [], None))[0],
        work_types=_PROJECT_CLASSIFICATION.get(slug, ("supply", [], None))[1],
        structure_type=_PROJECT_CLASSIFICATION.get(slug, ("supply", [], None))[2],
        context=_PROJECT_CONTEXT.get(slug, (None, None))[0],
        context_source=_PROJECT_CONTEXT.get(slug, (None, None))[1],
        cover=None if slug in _MONTAGE_ONLY else next(iter(_PROJECT_MEDIA.get(slug, [])), None),
        gallery=_PROJECT_MEDIA.get(slug, []),
    )
    for (slug, name, year, client, location, scope, status) in _PROJECTS
]

# --------------------------------------------------------------------------- #
# Contractor capability records
#
# Seeded only with what the source documents actually prove. The registration
# certificate is on file; the construction capability licence (chứng chỉ năng
# lực hoạt động xây dựng) and the company's own ISO certificates are not in any
# source here, so they are left for the admin to add rather than invented.
# --------------------------------------------------------------------------- #

CERTIFICATES = [
    CertificateCreate(
        name="Giấy chứng nhận đăng ký doanh nghiệp",
        category="legal",
        issuer="Phòng Đăng ký kinh doanh — Sở Kế hoạch và Đầu tư thành phố Hà Nội",
        code="0106346833",
        issued="Đăng ký lần đầu 25/10/2013, thay đổi lần thứ 8 ngày 16/12/2025",
        note="Ngành nghề chính: 4212 — Xây dựng công trình đường bộ. Tổng 41 ngành nghề đăng ký.",
    ),
    CertificateCreate(
        name="Chấp thuận nhà cung cấp gối cầu — đường sắt tốc độ cao Hà Nội – Quảng Ninh",
        category="acceptance",
        issuer="Công ty TNHH Thương mại và Xây dựng Trung Chính",
        code="HĐ 0602/2026/ĐV/HĐ/VINSPEED-LDSGCTC",
        issued="2026",
        note="Cầu vượt sông Đuống Km016+168 và các cầu vượt quy hoạch trên tuyến.",
    ),
    CertificateCreate(
        name="Chấp thuận của Tư vấn giám sát — cầu Giải Phóng 9, thành phố Rạch Giá",
        category="acceptance",
        issuer="Tư vấn giám sát Gói thầu số 03 — thi công xây dựng cầu",
        issued="2026",
        note="Chấp thuận Hòa Hoàng là đơn vị cung cấp gối cầu cho gói thầu.",
    ),
]

# Equipment types evidenced by the company's own site photographs and by the
# prestressing work it self-performs. Quantities are left empty on purpose —
# no source states them, and the page prints "Đang cập nhật" until filled in.
EQUIPMENT = [
    EquipmentCreate(
        name="Kích thủy lực căng kéo cáp dự ứng lực",
        category="cang-keo",
        spec="Kích rỗng tâm dùng cho bó cáp 3T đến 22T-15.2",
    ),
    EquipmentCreate(
        name="Bộ nguồn và bơm thủy lực điều khiển căng kéo",
        category="cang-keo",
        spec="Hệ thống bơm điều khiển căng theo từng cấp lực",
    ),
    EquipmentCreate(
        name="Máy bơm vữa và máy trộn vữa",
        category="cang-keo",
        spec="Phục vụ bơm vữa bảo vệ ống ghen sau khi căng kéo",
    ),
    EquipmentCreate(
        name="Giàn thao tác căng kéo cáp dự ứng lực ngoài",
        category="nang-ha",
        spec="Giàn treo bên hông dầm hộp phục vụ thi công cáp DƯL ngoài",
    ),
]

# Left empty on purpose: no capability-profile PDF has been published yet, and a
# download entry with no file behind it is worse than an honest empty state.
DOCUMENTS: list[DocumentCreate] = []

# --------------------------------------------------------------------------- #
# Last three years of financials (forms B01a/B02 - DNN, amounts in VND).
# Admin-only: there is no public endpoint reading these. They exist so the
# capability profile handed over with a bid can be produced from one place.
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
    PartnerCreate(
        name="Tổng Công ty Đầu tư phát triển đường cao tốc Việt Nam (VEC)",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/vec.png", alt="Logo VEC", width=640, height=550),
    ),
    PartnerCreate(
        name="Tổng Công ty Xây dựng Trường Sơn",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/truong-son.jpg", alt="Logo Trường Sơn", width=640, height=359),
    ),
    PartnerCreate(
        name="CTCP – Tổng Công ty Cơ khí Xây dựng Thăng Long (MECO)",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/meco.jpg", alt="Logo MECO", width=500, height=373),
    ),
    PartnerCreate(
        name="Công ty TNHH Xây dựng và Thương mại Trung Chính",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/trung-chinh.png", alt="Logo Trung Chính", width=640, height=640),
    ),
    PartnerCreate(
        name="Công ty TNHH Phát triển Phú Mỹ Hưng",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/phu-my-hung.jpg", alt="Logo Phú Mỹ Hưng", width=640, height=496),
    ),
    PartnerCreate(
        name="CTCP Tập đoàn Đạt Phương",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/dat-phuong.png", alt="Logo Đạt Phương", width=640, height=400),
    ),
    PartnerCreate(
        name="Tổng Công ty Xây dựng số 1 – CTCP",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/xd-so-1.webp", alt="Logo CC1", width=640, height=452),
    ),
    PartnerCreate(
        name="Tổng Công ty Xây dựng công trình giao thông 8 – CTCP",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/giao-thong-8.png", alt="Logo CIENCO8", width=296, height=300),
    ),
    PartnerCreate(
        name="CTCP Tập đoàn Thuận An – TAG",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/thuan-an-tag.jpg", alt="Logo Thuận An E&C", width=640, height=327),
    ),
    PartnerCreate(
        name="CTCP Xây dựng công trình 525",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/cienco-525.png", alt="Logo CIENCO 525", width=568, height=352),
    ),
    PartnerCreate(
        name="CTCP ĐTXD Thương mại Trường Thành",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/truong-thanh.jpg", alt="Logo Trường Thành", width=463, height=292),
    ),
    PartnerCreate(
        name="Công ty Cổ phần Cầu đường Long Biên",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/long-bien.png", alt="Logo Long Biên", width=514, height=321),
    ),
    PartnerCreate(
        name="Công ty Cổ phần SBTECH",
        country="Việt Nam",
        role="customer",
        logo=Media(url="/images/partners/sbtech.jpg", alt="Logo SBTECH", width=447, height=447),
    ),
    PartnerCreate(name="Công ty Cổ phần Cơ khí Cầu đường Hà Ninh", country="Việt Nam", role="customer"),
    PartnerCreate(
        name="Kumho Engineering & Construction",
        country="Hàn Quốc",
        role="customer",
        logo=Media(url="/images/partners/kumho.jpg", alt="Logo Kumho E&C", width=640, height=222),
    ),
    PartnerCreate(
        name="SHINKO",
        country="Nhật Bản",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/shinko.jpg", alt="Logo SHINKO", width=640, height=290),
    ),
    PartnerCreate(
        name="APS",
        country="Nhật Bản",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/aps.png", alt="Logo APS", width=227, height=123),
    ),
    PartnerCreate(
        name="Hirun",
        country="Italy",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/hirun.png", alt="Logo Hirun", width=512, height=181),
    ),
    PartnerCreate(
        name="Mageba (Shanghai) Bridge Products",
        country="Trung Quốc",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/mageba.png", alt="Logo Mageba", width=640, height=185),
    ),
    PartnerCreate(
        name="Liuzhou OVM Machinery",
        country="Trung Quốc",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/ovm.png", alt="Logo OVM", width=379, height=145),
    ),
    PartnerCreate(
        name="CSSC Sunrui Luoyang Special Equipment (Song Thụy Lạc Dương Trung Thuyền)",
        country="Trung Quốc",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/cssc-sunrui.png", alt="Logo CSSC Sunrui", width=640, height=233),
    ),
    PartnerCreate(
        name="Công ty cáp Quế Cầu Liễu Châu",
        country="Trung Quốc",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/que-cau-lieu-chau.jpg", alt="Logo cáp Quế Cầu Liễu Châu", width=200, height=200),
    ),
    PartnerCreate(name="Công ty TNHH Cơ khí DƯL HM Liễu Châu", country="Trung Quốc", role="manufacturer"),
    PartnerCreate(
        name="Công ty phát triển công nghệ giao thông Vạn Cầu Trùng Khánh",
        country="Trung Quốc",
        role="manufacturer",
        logo=Media(url="/images/manufacturers/van-cau-trung-khanh.png", alt="Logo Vạn Cầu Trùng Khánh", width=576, height=58),
    ),
]
