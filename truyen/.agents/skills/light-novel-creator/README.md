# Light Novel Creator Agent · Trợ Lý Kỹ Nghệ Sáng Tác Light Novel

> Một hệ thống AI sáng tác Light Novel chuyên nghiệp sở hữu năng lực học tập liên tục — Học hỏi tác phẩm xuất sắc, mô phỏng văn phong, sáng tạo tác phẩm mới và tự tối ưu hóa năng lực bản thân.

---

## 1. Tổng quan

Light Novel Creator Agent là một Skill sáng tác Light Novel chuyên nghiệp. Đây không đơn thuần là một công cụ sinh văn bản thông thường, mà là một **hệ thống kỹ nghệ sáng tác toàn diện (Creative Engineering System)**, bao quát toàn bộ vòng đời tác phẩm: từ nghiên cứu văn phong, kiến tạo thế giới quan, quản lý nhân vật, theo dõi dòng thời gian cho đến việc chấp bút từng chương và tự động thẩm định chất lượng sau mỗi chương.

**Triết lý cốt lõi**: Học tập ưu tiên ＞ Sáng tác ưu tiên ＞ Xuất bản ưu tiên

---

## 2. Ma trận chức năng (13 Phân hệ chuyên sâu)

| # | Phân hệ | Chức năng chính |
|---|---------|----------------|
| 1 | **Học phong cách (Style Learning)** | Thu thập dữ liệu tác phẩm/tác giả $\to$ Lập hồ sơ phong cách *Style Profile* (độ dài câu/tỷ lệ đối thoại/tu từ/nhịp điệu cảm xúc) $\to$ Lưu trữ vĩnh viễn |
| 2 | **Sáng tác đa ngôn ngữ (Multi-language)** | Sáng tác độc lập bằng tiếng Trung/Nhật/Anh theo văn phong bản ngữ tự nhiên, không dịch thô ráp ("dịch ngữ") |
| 3 | **Chế độ sáng tác (Creation Modes)** | Tiểu thuyết chuẩn / Mô phỏng cuộc đời (Life Simulator) / Quản trò TRPG GM (CoC/DnD) / Galgame (Đo hảo cảm + rẽ nhánh cốt truyện) |
| 4 | **Trí nhớ trường thiên (Long-form Memory)** | Quản lý 6 danh mục ký ức: Thế giới (World), Nhân vật (Character), Phe phái (Faction), Dòng thời gian (Timeline), Phục bút (Foreshadow), Sự kiện (Event). Đọc tự động trước mỗi khi viết |
| 5 | **Suy diễn cảm hứng (Inspiration Deduction)** | Khi cốt truyện bế tắc, tự động suy luận: 5 hướng phát triển hợp lý + 3 ngã rẽ bất ngờ + 1 cú nổ cao trào (Plot Twist) |
| 6 | **Tự học Skill (Skill Learning)** | Tự chủ tìm kiếm $\to$ Đánh giá $\to$ Cài đặt $\to$ Kiểm thử $\to$ Ghi nhận các Skill sáng tác trên GitHub/HuggingFace |
| 7 | **Tự học MCP (MCP Learning)** | Tìm kiếm và tích hợp các MCP Server: NovelWriter, Obsidian, Memory, VectorDB... |
| 8 | **Học từ dữ liệu mẫu (Sample Learning)** | Học tập đặc trưng văn phong, cấu trúc tự sự từ tư liệu công khai hợp pháp (không học vẹt sao chép nguyên văn) |
| 9 | **Tự thẩm định chất lượng (Self-supervised Review)** | Sau mỗi chương, tự động chạy checklist kiểm tra 6 chiều: Tính cách nhân vật / Dòng thời gian / Thế giới quan / Nhịp độ / Lặp từ / Nguy cơ OOC (lệch tính cách) |
| 10 | **Tích hợp NovelWriter** | Tự động duy trì và cập nhật cấu trúc thư mục `/NovelProject/` đồng bộ sau mỗi chương |
| 11 | **Định dạng xuất bản (Output Format)** | Bản đầy đủ (Kế hoạch $\to$ Thiết lập $\to$ Chính văn $\to$ Cập nhật nhân vật $\to$ Dòng thời gian $\to$ Ký ức $\to$ Thẩm định $\to$ Gợi ý tiếp theo) hoặc Bản thuần chính văn |
| 12 | **Nguyên tắc ưu tiên học tập** | Kiểm tra bắt buộc trước khi sáng tác: Đã nạp đủ phong cách/kỹ năng/MCP/dữ liệu cần thiết chưa |
| 13 | **Cơ sở dữ liệu Thẻ Nhân Vật** | 🔒 Thuộc tính cố định (Chỉ đọc) + 🔄 Thuộc tính biến động (Cập nhật sau mỗi chương) + Tự động bóc tách dữ liệu bách khoa ACGN |

---

## 3. Hệ thống Thẻ Nhân Vật (Character Card)

### Định dạng 2 vùng dữ liệu

Thẻ nhân vật được phân tách rành mạch thành hai vùng:

```
🔒 Thuộc tính cố định (Chỉ đọc)              🔄 Thuộc tính biến động (Cập nhật sau mỗi chương)
─────────────────────────                    ─────────────────────────
Họ tên / Giới tính / Ngày sinh / Nhóm máu    Tuổi (Tự động tính theo dòng thời gian)
Màu tóc / Màu mắt / Chiều cao / Thể hình     Học niên / Nghề nghiệp / Thân phận
MBTI / Tính cách cốt lõi / Điểm mạnh / Yếu   Tổ chức trực thuộc / Địa vị xã hội / Danh hiệu
Thẻ thuộc tính Moe (Tsundere, Kuudere...)    Tài sản đứng tên
Thành phần gia đình / Quá khứ / Chấn thương  Năng lực / Kỹ năng (Ghi rõ biến động cấp bậc)
                                             Hôn nhân con cái / Mạng lưới quan hệ (Kèm điểm hảo cảm)
```

### 3 Phương thức khởi tạo nhân vật

| Phương thức | Khi nào kích hoạt | Mô tả quy trình |
|---|---|---|
| **A. Phỏng vấn người dùng** | Khi người dùng chưa có Prompt chi tiết | Lần lượt hỏi người dùng 13 trường thông tin cốt lõi |
| **B. Phân tích tự do** | Người dùng cung cấp đoạn mô tả tự do | Tự động bóc tách phân loại vào 2 vùng + hỏi thêm các mục còn thiếu |
| **C. Import Bách khoa ACGN** | Người dùng chỉ định nhân vật ACGN có sẵn | Tự động bóc tách từ Moegirlpedia / Wikipedia tiếng Nhật $\to$ Điền vào thẻ |

### Tự động cập nhật sau mỗi chương

Sau khi hoàn thành chương văn, bắt buộc kiểm tra 8 trường dữ liệu động: Tuổi / Nghề nghiệp / Tổ chức / Địa vị / Tài sản / Năng lực / Hôn nhân / Mạng lưới quan hệ.

### Liên kết chặt chẽ với Dòng thời gian (Timeline)

Xác thực chéo 2 chiều giữa `Timeline.md` và Thẻ nhân vật: `Tuổi = Ngày sinh + Ngày hiện tại của cốt truyện`, mọi trạng thái phải đồng nhất 100%.

---

## 4. Tích hợp Bách khoa ACGN

Phối hợp cùng Skill: `acgn-character-scraper`

```
Người dùng: "Hãy đưa nhân vật Yukinoshita Yukino trong Oregairu vào câu chuyện"
  ↓
① web_fetch trang Moegirlpedia zh.moegirl.org.cn/雪之下雪乃
② Bóc tách Infobox + Cột thuộc tính Moe + Các chương quan hệ nhân vật
③ Tự động ánh xạ 20+ trường dữ liệu vào 🔒 Thuộc tính cố định / 🔄 Thuộc tính biến động
④ Xuất thẻ nhân vật chuẩn Markdown
⑤ Hỏi xác nhận 5 điểm: Thời điểm xuất hiện / Quan hệ ban đầu / Điều chỉnh độ tuổi / Giữ nguyên năng lực / Tùy biến thuộc tính
```

Hỗ trợ các nguồn dữ liệu: Moegirlpedia (萌娘百科) / Wikipedia tiếng Nhật / Wikipedia tiếng Anh / Bangumi / AniDB.

---

## 5. Cấu trúc thư mục NovelProject

```
NovelProject/
├─ World.md              # Thiết lập thế giới quan
├─ Characters.md         # Danh sách nhân vật + Sơ đồ quan hệ (Tự động sinh)
├─ Characters/           # ★ Cơ sở dữ liệu thẻ nhân vật
│  ├─ _template.md       # Mẫu thẻ nhân vật chuẩn
│  ├─ 001_NhanVatChinh.md
│  ├─ 002_NuChinhA.md
│  └─ ...
├─ Timeline.md           # ★ Dòng thời gian tóm lược (Kèm trạng thái nhân vật + xác thực kép)
├─ Settings.md           # Thiết lập địa danh / Cảnh trí
├─ Factions.md           # Thiết lập các thế lực, bang phái
├─ Foreshadows.md        # Theo dõi phục bút (chi tiết cài cắm & thu hồi)
├─ Chapter01.md          # Chương 1
├─ Chapter02.md          # Chương 2
└─ ...
```

---

## 6. Hướng dẫn sử dụng

### Quy trình làm việc tiêu chuẩn

```
1. Thiết lập thế giới quan    → "Đô thị siêu nhiên bán ma ảo, bối cảnh Nhật Bản 2010-2050"
2. Nghiên cứu thực tế         → Tự động tra cứu hệ thống đường sắt / Doanh nghiệp / Học đường Nhật Bản
3. Tạo thẻ nhân vật           → Áp dụng phương thức A/B/C tạo Nam chính + Nữ chính
4. Chọn phong cách            → "Dùng văn phong Oregairu" → Tự động lập Style Profile
5. Viết chương đầu tiên       → Xuất định dạng đầy đủ (Kế hoạch → Chính văn → Cập nhật → Thẩm định)
6. Viết các chương tiếp theo  → Tự động đọc thẻ nhân vật + Dòng thời gian → Chấp bút → Cập nhật
```

---

## 7. Các rào chắn kiểm duyệt bắt buộc (Mandatory Gates)

> Tuyệt đối không được phép bỏ qua các bước sau:

| Thời điểm | Hành động bắt buộc |
|---|---|
| **Trước khi viết Chương 1** | Bắt buộc phải tạo xong thẻ nhân vật của Nam chính + ít nhất 1 Nữ chính |
| **Trước khi viết mỗi chương** | Bắt buộc phải đọc `Timeline.md` + toàn bộ thẻ nhân vật trong `Characters/*.md` |
| **Sau khi viết mỗi chương** | Bắt buộc phải cập nhật tất cả thẻ nhân vật bị ảnh hưởng + Bổ sung sự kiện vào dòng thời gian |
| **Cập nhật thẻ nhân vật** | Chỉ cập nhật 🔄 Thuộc tính biến động; Vùng 🔒 Thuộc tính cố định = Chỉ đọc |
| **Cập nhật Dòng thời gian** | Bắt buộc đối chiếu xác thực kép với Thẻ nhân vật (Tính nhất quán về Tuổi / Nghề nghiệp / Quan hệ) |

---

## 8. Thư viện phong cách tích hợp sẵn

| Tác phẩm | Tác giả | Kỹ thuật tự sự cốt lõi |
|---|---|---|
| **Oregairu (春物)** | Wataru Watari | Người kể chuyện không đáng tin cậy, lý luận ngụy biện phản biện xã hội, mật độ hàm ý ngầm cao |
| **Eromanga Sensei** | Tsukasa Fushimi | Hội thoại kiểu tấu hài Manzai, hài kịch lãng mạn đánh thẳng vào cảm xúc |
| **Toaru Majutsu no Index** | Kazuma Kamachi | Kỹ thuật đa điểm nhìn (Multi-POV), miêu tả hành động chuẩn xác, hệ thống khoa học đối lập ma pháp |
| **Mushoku Tensei** | Rifujin na Magonote | Tự sự trọn đời (biography), giọng văn biến chuyển trưởng thành theo từng độ tuổi |
| **Re:Zero** | Tappei Nagatsuki | Tự sự vòng lặp tử vong (Return by Death), tàu lượn siêu tốc cảm xúc |
| **86 - Eighty Six** | Asato Asato | Tiết chế cảm xúc đỉnh cao, trích dẫn đầu chương (Epigraph), độ chính xác viễn tưởng quân sự |
| **Hentai Ouji to Warawanai Neko** | Sou Sagara | Hài kịch bộc lộ tiếng lòng, chơi chữ ngữ nghĩa, kết cấu cốt truyện gậy ông đập lưng ông |

---

## 9. Lịch sử phiên bản

- **v2.0** — Bổ sung Phân hệ 13: Cơ sở dữ liệu Thẻ nhân vật + Liên kết Dòng thời gian kép + Tích hợp bách khoa ACGN.
- **v1.0** — Khởi tạo 12 Phân hệ sáng tác + Tài liệu tham khảo hiện thực Nhật Bản (Japan Reference).
