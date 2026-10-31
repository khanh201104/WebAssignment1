# QUY CHUẨN HOẠT ĐỘNG & BỘ KỸ NĂNG AGENT (AGENT SKILL & CONSTRAINTS)
> **Tài liệu tham chiếu tối cao cho mọi tác vụ trong không gian làm việc này.**
> Áp dụng trực tiếp cho dự án tiểu thuyết & Web Reader: **Biên Niên Sử Tro Tàn: Kalvin Palace**.

---

## 1. PHẠM VI HOẠT ĐỘNG BẤT KHẢ XÂM PHẠM (SANDBOX SCOPE)

* **Giới hạn thư mục:** Toàn bộ quá trình đọc, ghi, chỉnh sửa, phân tích mã nguồn và thực thi lệnh **chỉ được phép diễn ra duy nhất trong thư mục `truyen/kalvin/`**.
* **Nguyên tắc cô lập:** Tuyệt đối không đọc, sửa đổi, tra cứu hoặc thao tác trên bất kỳ tệp tin, thư mục hay tài nguyên nào nằm ngoài thư mục `truyen/kalvin/` của project này.

---

## 2. QUY TRÌNH LÀM VIỆC TỰ ĐỘNG (WORKFLOW PROTOCOL)

### 2.1. Khi được yêu cầu: "Viết chương mới và push lên GitHub"
Agent tự động thực hiện tuần tự các bước sau mà không cần nhắc lại:
1. **Kiểm tra bắt buộc `KALVIN_README.md` (Mandatory Framework Check):** Đọc và đối chiếu lại `truyen/kalvin/KALVIN_README.md` để nắm chắc khung sườn Master Outline, cột mốc (milestone) của Arc hiện tại, tâm lý nhân vật và bộ quy chuẩn văn phong/cấm kỵ.
2. **Rà soát bối cảnh tức thời (Context Audit):** Đọc kỹ phần cuối của chương liền trước để nắm chính xác: mốc thời gian, không gian, trạng thái thể lực/ma lực/vết thương của nhân vật, và xung đột kịch tính chưa giải quyết.
3. **Sáng tác chương tiếp theo:** Viết trọn vẹn chương mới bám sát mạch truyện và quy chuẩn văn phong tại Mục 3.
4. **Lưu trữ văn bản:** Tạo tệp Markdown tại `truyen/kalvin/chapters/chuong_XX.md`.
5. **Đồng bộ ứng dụng Web Reader:**
   * Cập nhật `truyen/kalvin/data/chapters.json` (tăng `total_chapters`, bổ sung object chương mới với đầy đủ `elements`, `content`, `word_count`).
   * Cập nhật `truyen/kalvin/js/chapters-data.js` (đồng bộ `window.KALVIN_DATA = ...;`).
6. **Git Commit & Push tự động:**
   * Chỉ `git add` các tệp bên trong thư mục `truyen/kalvin/`.
   * Commit với thông điệp chuẩn mực (ví dụ: `feat(kalvin): thêm Chương XX và cập nhật dữ liệu web reader`).
   * Thực hiện `git push origin main` đẩy mã nguồn lên GitHub.

### 2.2. Khi được yêu cầu: "Viết một chương chỉ định cụ thể" (Ví dụ: Chương X)
1. **Kiểm tra `KALVIN_README.md` & Định vị hai đầu:** Đọc `KALVIN_README.md` cùng chương trước (X-1) và chương sau (X+1, nếu đã tồn tại) để xây dựng cầu nối diễn biến mượt mà, hợp lý về logic và tâm lý nhân vật.
2. **Sáng tác & Đồng bộ:** Thực hiện đầy đủ các bước lưu trữ, đồng bộ dữ liệu vào `chapters.json`, `chapters-data.js` và tự động commit, push lên GitHub.

---

## 3. TIÊU CHUẨN SÁNG TÁC & VĂN PHONG (THEO KALVIN_README.MD)

### 3.1. Phong cách chủ đạo: Seinen Fantasy Light Novel Nhật Bản
* **Tông màu:** Trầm lắng, hiện thực, tàn khốc nhưng giàu chất thơ và tình cảm đồng đội nén chặt (*Grimgar*, *86 - Eighty Six*, *Mushoku Tensei*, *Spice & Wolf*).
* **Tuyệt đối cấm văn phong Tiên hiệp / Kiếm hiệp Trung Quốc:**
  * ❌ *CẤM:* Hừ lạnh, cười gằn, sắc mặt đại biến, hít một hơi khí lạnh, khóe miệng giật giật, tiểu tử thối, lão bất tử, con kiến hôi, ngươi muốn chết, to gan lớn mật, sát khí ngập trời, huyết nhục mơ hồ, bọt máu cuồng phun, lực lượng kinh khủng bực này...
  * ✅ *BẮT BUỘC:* Miêu tả chuyển động vi mô của cơ bắp, hơi thở phả thành sương, tiếng kim loại va đập sắc gọn, mùi rỉ sét của máu, độ buốt giá của đá vôi, sự im lặng đầy sức nặng giữa các câu thoại.
* **Xưng hô chuẩn mực:** Cậu, cô, hắn, ông ta; mày - tao (khi thù địch); ngài, điện hạ, thiếu gia; tớ - cậu, anh - em (thân thiết, tình cảm).

### 3.2. Yêu cầu về độ dài & nhịp độ
* **Dung lượng:** Mỗi chương phải đạt từ **3.000 đến 4.000 từ tiếng Việt**.
* **Nhịp độ viết sâu (Micro-pacing):** Viết chậm rãi, tả kỹ từng chuyển động cơ thể, cơ chế vận hành của Khí và Ma lực vi mô. Tuyệt đối **không nhảy cóc thời gian** và **không tóm tắt sự kiện** (ví dụ: cấm viết *"Họ nói chuyện cả buổi rồi quay về"*).

### 3.3. Nhất quán hình tượng ba nhân vật chính
* **Kalvin Palace (Cái Đầu / Chiến lược):**
  * Tóc đen, mắt xám tro tĩnh lặng.
  * Trầm mặc, kiệm lời, khả năng kiểm soát cảm xúc và ma lực vi mô tuyệt đối; suy nghĩ lý tính như một nhà khoa học giải phẫu.
  * Tàn nhẫn, dứt khoát với kẻ thù; vụng về nhưng sâu sắc trong việc bảo vệ Roy và Rumy. Tuyệt đối **không kiêu ngạo, không khoe khoang**.
* **Rumy Charlotte (Trái Tim / Thánh Nữ):**
  * Mái tóc đỏ rực rỡ như đốm lửa ấm, mắt màu hổ phách.
  * Dịu dàng, nhẫn nại nhưng ý chí sắt đá, không yếu đuối bánh bèo. Sở hữu Thánh căn bẩm sinh tối thượng. Mỏ neo nhân tính giữ Kalvin khỏi ranh giới tàn độc.
* **Roy Kane (Thanh Kiếm / Kỵ Sĩ Trung Thành):**
  * Vạm vỡ, tóc nâu, phóng khoáng, nụ cười nửa miệng.
  * Trực giác chiến đấu thiên bẩm, vận hành Khí điêu luyện, đặt niềm tin tuyệt đối vào Kalvin.

### 3.4. Bộ lọc kiểm tra 5 bước (Continuation Protocol)
1. **Bước 1 - Rà soát bối cảnh:** Năm Roland, địa điểm, thể lực, ma lực, xung đột tức thời.
2. **Bước 2 - Phạm vi:** Giới hạn 1 - 2 phân cảnh lớn/chương.
3. **Bước 3 - Cấu trúc 3 phần:**
   * *Mở đầu (500 – 700 từ):* Gắn với giác quan vật lý (gió, mùi, vị muối, nhiệt độ).
   * *Thân chương (2.000 – 2.500 từ):* Đối thoại tự nhiên, chiến thuật chi tiết, xung đột leo thang.
   * *Kết chương (500 – 800 từ):* Điểm lặng, quyết định dứt khoát, để lại dư âm (hook).
4. **Bước 4 - Kiểm soát dung lượng:** 3.000 – 4.000 từ.
5. **Bước 5 - Bộ lọc làm sạch:** Quét sạch từ ngữ tiên hiệp và chú thích giai đoạn nội bộ trước khi xuất bản.

### 3.5. Quy chuẩn định vị dòng thời gian (Temporal Anchoring)
* Đầu mỗi chương bắt buộc có dòng định vị thời gian in nghiêng tự nhiên: `*Mùa/Tháng năm XXX lịch Roland – Thời khắc trong ngày, bối cảnh / khoảng cách thời gian kể từ sự kiện trước.*`
* **TUYỆT ĐỐI KHÔNG ĐƯA CHÚ THÍCH GIAI ĐOẠN NỘI BỘ VÀO VĂN BẢN:** Các nhãn phân kỳ như `(Giai đoạn 2.1: Năm nhất)`, `(Giai đoạn 2.2: Năm 2)` là tài liệu định hướng nội bộ của Master Outline để AI nắm bắt tiến trình cốt truyện, **tuyệt đối không được đưa vào nội dung chương truyện hay hiển thị trên giao diện độc giả**.

---

## 4. QUY CHUẨN KỸ THUẬT & HỆ THỐNG DỮ LIỆU

1. **Tệp Markdown gốc:** `truyen/kalvin/chapters/chuong_XX.md`.
2. **Cơ sở dữ liệu Web Reader:**
   * `truyen/kalvin/data/chapters.json`: Cấu trúc JSON chuẩn hóa chứa toàn bộ các chương và trường `elements` tách đoạn sạch sẽ.
   * `truyen/kalvin/js/chapters-data.js`: Đóng gói `window.KALVIN_DATA` hỗ trợ đọc offline / local file mà không vướng lỗi CORS.
3. **An toàn Git:**
   * Mọi lệnh `git add` chỉ định danh thư mục `truyen/kalvin/`.
   * Luôn kiểm tra `git status` trước và sau khi commit/push để đảm bảo cây làm việc sạch sẽ.
