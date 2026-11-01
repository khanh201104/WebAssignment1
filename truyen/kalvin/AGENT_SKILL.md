# QUY CHUẨN HOẠT ĐỘNG & BỘ KỸ NĂNG AGENT (AGENT SKILL & CONSTRAINTS)
> **Tài liệu tham chiếu tối cao cho mọi tác vụ trong không gian làm việc này.**  
> **Áp dụng trực tiếp cho dự án tiểu thuyết & Web Reader: Biên Niên Sử Tro Tàn: Kalvin Palace.**  
> **Khung kiến trúc tích hợp:** Chuẩn hóa theo hệ thống 13 phân hệ của `.agents/skills/light-novel-creator`.

---

## 1. PHẠM VI HOẠT ĐỘNG & QUYỀN TRUY CẬP (SANDBOX SCOPE)

* **Giới hạn thư mục:** Toàn bộ quá trình đọc, ghi, chỉnh sửa, phân tích mã nguồn và thực thi lệnh **được cấp quyền trong phạm vi toàn bộ thư mục `truyen/`** (bao gồm `truyen/.agents/`, `truyen/kalvin/`, `truyen/index.html` và các tài nguyên trực thuộc).
* **Nguyên tắc ranh giới an toàn:** Tuyệt đối không đọc, sửa đổi, tra cứu hoặc thao tác trên bất kỳ tệp tin, thư mục hay tài nguyên nào nằm ngoài thư mục `truyen/` của không gian làm việc này.

---

## 2. KIẾN TRÚC NOVELPROJECT & CƠ SỞ DỮ LIỆU ĐỘC LẬP

Dự án áp dụng cấu trúc thư mục tiêu chuẩn hóa `NovelProject/` nhằm duy trì tính nhất quán tuyệt đối về thế giới quan, nhân vật, dòng thời gian và phong cách sáng tác:

```
truyen/kalvin/
├── NovelProject/                       # Cơ sở dữ liệu cốt lõi (World Bible & Knowledge Base)
│   ├── Characters/                     # Cơ sở dữ liệu thẻ nhân vật 2 vùng dữ liệu
│   │   ├── _template.md                # Phôi chuẩn 2 vùng: 🔒 Cố định & 🔄 Biến động
│   │   ├── 001_Kalvin_Palace.md        # Thẻ nhân vật Nam chính Kalvin
│   │   ├── 002_Rumy_Charlotte.md       # Thẻ nhân vật Nữ chính Rumy
│   │   ├── 003_Roy_Kane.md             # Thẻ nhân vật Nam thứ Roy
│   │   ├── 004_Finn_Thorne.md          # Thẻ nhân vật Kỹ sư Finn
│   │   ├── 005_Celine_Leicester.md     # Thẻ nhân vật Công chúa Celine
│   │   └── ... (006 -> 012)            # Các nhân vật phụ và phản diện
│   ├── Characters.md                   # Master index nhân vật & Sơ đồ quan hệ mạng lưới
│   ├── Timeline.md                     # Bảng tra cứu trạng thái + Lịch sử + Nhật ký dòng thời gian
│   ├── World.md                        # Thiết lập thế giới quan, ma lực vi mô, hệ thống Khí huyết
│   ├── Settings.md                     # Bối cảnh địa danh, cảnh trí, không gian giác quan
│   ├── Factions.md                     # Bản đồ thế lực, cấu trúc chính trị, phe cánh
│   ├── Foreshadows.md                  # Quản lý phục bút (Plant - Reinforce - Payoff)
│   ├── Style_Profile.md                # Hồ sơ phong cách Seinen Light Novel Nhật Bản
│   └── Review_Checklist.md             # Quy trình tự thẩm định chất lượng 6 chiều sau mỗi chương
├── chapters/                           # Tệp markdown văn bản từng chương (chuong_01.md -> ...)
├── data/                               # Cơ sở dữ liệu Web Reader (chapters.json)
├── js/                                 # Kịch bản Web Reader (chapters-data.js, app.js...)
├── css/                                # Định dạng giao diện Web Reader
├── index.html                          # Giao diện ứng dụng đọc truyện Web Reader
├── KALVIN_README.md                    # Tài liệu định hướng sáng tác & Master Outline
└── AGENT_SKILL.md                      # Quy chuẩn hoạt động và kiểm soát chất lượng của Agent
```

---

## 3. CỔNG KIỂM SOÁT BẮT BUỘC TRƯỚC VÀ SAU KHI SÁNG TÁC (MANDATORY GATES)

Tuân thủ nghiêm ngặt nguyên tắc của `.agents/skills/light-novel-creator`:

### 3.1. Cổng kiểm soát TRƯỚC khi viết (Pre-write Gate)
Trước khi đặt bút viết một chương mới, Agent **bắt buộc phải thực hiện 2 thao tác tra cứu**:
1. **Đọc `NovelProject/Timeline.md`:** Nắm chính xác năm Roland hiện tại, mùa, thời điểm trong ngày, vị trí địa lý của các nhân vật và sự kiện vừa diễn ra ở cuối chương liền kề.
2. **Đọc các thẻ nhân vật liên quan trong `NovelProject/Characters/*.md`:** Nắm chắc tuổi hiện tại (xác thực kép: `Năm Roland hiện tại - Năm sinh`), trạng thái thể lực/ma lực/vết thương, trang bị đang mang, và mức độ hảo cảm/quan hệ hiện tại.

### 3.2. Cổng kiểm soát SAU khi viết (Post-write Gate)
Sau khi hoàn thành bản thảo chương, Agent **bắt buộc phải chạy Quy trình tự thẩm định 6 chiều (`NovelProject/Review_Checklist.md`)**:
- [x] **Chiều 1 - Văn phong & Banned Words:** Quét sạch toàn bộ từ ngữ tiên hiệp/kiếm hiệp Trung Hoa. Bảo đảm ngôn ngữ Seinen Light Novel giàu giác quan và cảm xúc nén.
- [x] **Chiều 2 - Timeline & Tuổi:** Xác thực tính liền mạch, không nhảy cóc thời gian. Tuyệt đối **không đưa chú thích giai đoạn nội bộ** như `(Giai đoạn 2.2: Năm 2)` vào văn bản chương hay web.
- [x] **Chiều 3 - Tính nhất quán (OOC check):** Kiểm tra đối chiếu với vùng Thuộc tính cố định (🔒) của nhân vật.
- [x] **Chiều 4 - Dung lượng:** Đo đếm từ chính xác, bảo đảm nằm trong ngưỡng **3.000 – 4.000 từ tiếng Việt**.
- [x] **Chiều 5 - Phục bút:** Đối chiếu tiến độ với `NovelProject/Foreshadows.md`.
- [x] **Chiều 6 - Cập nhật dữ liệu:**
  1. Cập nhật vùng 🔄 Thuộc tính biến động của các thẻ nhân vật xuất hiện.
  2. Bổ sung dòng tóm tắt vào `NovelProject/Timeline.md`.
  3. Cập nhật `truyen/kalvin/data/chapters.json` và `truyen/kalvin/js/chapters-data.js`.
  4. Thực hiện Git commit và push lên GitHub.

---

## 4. QUY TRÌNH THỰC THI CHI TIẾT KHI NHẬN LỆNH VIẾT CHƯƠNG MỚI

Khi người dùng yêu cầu: *"Viết tiếp chương sau"* hoặc *"Viết chương XX"*:

1. **Bước 1 - Pre-write Audit:**
   * Đọc phần kết của chương liền trước (`truyen/kalvin/chapters/chuong_XX-1.md`).
   * Đọc `NovelProject/Timeline.md` và các thẻ `NovelProject/Characters/*.md` của nhân vật tham gia phân cảnh.
   * Tra cứu `KALVIN_README.md` để nắm mục tiêu cốt truyện của phân đoạn hiện tại.
2. **Bước 2 - Viết chương truyện:**
   * **Đầu chương:** Định vị thời gian tự nhiên bằng giác quan và dòng in nghiêng: `*Mùa... năm... lịch Roland – Thời khắc trong ngày, bối cảnh tiếp nối.*` (Không có nhãn Giai đoạn).
   * **Thân chương:** Đối thoại sinh động, phân tích ma lực vi mô, chiến thuật thực chiến, đào sâu tâm lý.
   * **Kết chương:** Điểm dừng giàu dư âm, mở ra chuyển biến tiếp theo.
   * **Độ dài:** Chuẩn xác từ 3.000 đến 4.000 từ tiếng Việt.
3. **Bước 3 - Lưu trữ & Đồng bộ ứng dụng Web:**
   * Tạo tệp `truyen/kalvin/chapters/chuong_XX.md`.
   * Cập nhật `truyen/kalvin/data/chapters.json` (tăng `total_chapters`, đẩy object chương mới với đầy đủ trường `elements`).
   * Cập nhật `truyen/kalvin/js/chapters-data.js` (đồng bộ biến toàn cục `window.KALVIN_DATA`).
4. **Bước 4 - Cập nhật hệ thống dữ liệu NovelProject:**
   * Cập nhật `NovelProject/Timeline.md` (thêm dòng lịch sử chương).
   * Cập nhật vùng biến động trong `NovelProject/Characters/*.md`.
5. **Bước 5 - Bảo toàn giao diện Web & Tự động Git Push:**
   * Tuyệt đối không làm thay đổi hay phá vỡ giao diện Web Reader (`truyen/kalvin/index.html` giữ nguyên thiết kế Sepia/Light/Dark, ngăn kéo chương, modal thông tin nhân vật).
   * Kiểm tra `git status` trong phạm vi `truyen/`.
   * Thực hiện `git add truyen/` -> `git commit -m "..."` -> `git push origin main`.

---

## 5. BỘ QUY CHUẨN VĂN PHONG SEINEN LIGHT NOVEL CỐT LÕI

| Yếu tố | CẤM TUYỆT ĐỐI (Tiên hiệp / Kiếm hiệp) | BẮT BUỘC SỬ DỤNG (Seinen Light Novel) |
| :--- | :--- | :--- |
| **Biểu cảm** | *Sắc mặt đại biến, hít một hơi khí lạnh, cười gằn, khóe miệng giật giật, ngây như phỏng, khinh thường liếc nhìn con kiến.* | *Mí mắt giật nhẹ, lồng ngực thắt lại, ánh mắt trầm xuống như mặt nước đóng băng, nuốt khan một ngụm nước bọt buốt lạnh, im lặng dõi theo.* |
| **Chiến đấu** | *Sát khí ngập trời, ngàn cân treo sợi tóc, bọt máu cuồng phun, một quyền đánh nổ, huyết nhục mơ hồ, vạn kiếp bất phục.* | *Hơi thở sắc lạnh như dao cạo, mùi rỉ sắt xộc vào mũi, thớ cơ bắp căng cứng đến phát đau, tiếng kim loại va đập đanh gọn, máu đỏ sẫm rỉ qua khe giáp.* |
| **Xưng hô** | *Tiểu tử thối, lão bất tử, con kiến hôi, ngươi muốn chết, to gan lớn mật, cút cho ta, bản tọa, lão phu, tại hạ, các hạ.* | *Cậu, cô, hắn, ông ta; mày - tao (thù địch/thô lỗ); ngài, điện hạ, thiếu gia; tớ - cậu, anh - em (thân thiết).* |
| **Nhịp điệu** | Câu cảm thán liên tục ("thế mà lại là...", "chẳng lẽ là...", "lực lượng kinh khủng bực này!"). | Ngắt câu giàu nhịp điệu, chú trọng khoảng lặng (*Ma - 間*), cảm xúc nén vào hành vi vật lý. |
