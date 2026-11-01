# TÀI LIỆU ĐỊNH HƯỚNG SÁNG TÁC & CỐT TRUYỆN CHI TIẾT (STORY BIBLE & MASTER PROMPT)

> **Dự án:** Biên Niên Sử Tro Tàn: Kalvin Palace  
> **Kiến trúc dữ liệu:** Chuẩn hóa theo hệ thống 13 phân hệ của `.agents/skills/light-novel-creator`  
> **Kho dữ liệu mô-đun hóa độc lập:** Thư mục `/NovelProject/` là nguồn chân lý duy nhất (Single Source of Truth).

---

## 1. HỆ THỐNG MÔ-ĐUN HÓA NOVELPROJECT (SINGLE SOURCE OF TRUTH)

Để đảm bảo tính nhất quán tuyệt đối về thế giới quan, quy tắc sức mạnh, phục bút và tâm lý nhân vật xuyên suốt hàng trăm chương, toàn bộ thông tin chi tiết đã được mô-đun hóa thành các tài liệu chuyên biệt trong thư mục `NovelProject/`:

| Tài liệu mô-đun | Nội dung chi tiết | Liên kết tham chiếu |
|---|---|---|
| **World.md** | Bối cảnh thế giới Roland, địa chính trị, quy luật tự nhiên của Ma Lực & Khí Huyết, 3 chức nghiệp và phân cấp từ Nhất tinh đến Cảnh giới Truyền thuyết. | [Xem World.md](NovelProject/World.md) |
| **Settings.md** | Bản đồ chi tiết, không gian địa lý: Lâu đài Palace, cối xay gió hoang, Học viện Hoàng gia, Thư viện Ngầm, Tầng Hầm Số Bảy, Rừng Sương Muối, Pháo đài Ashen Hold (Manchester). | [Xem Settings.md](NovelProject/Settings.md) |
| **Factions.md** | Cấu trúc chính trị, sơ đồ bang phái: Nhà Palace, Nhà Vane, Hoàng tộc & Cấm Vệ Celine, Giáo hội Lugunica, Đế quốc Noxus. | [Xem Factions.md](NovelProject/Factions.md) |
| **Characters.md** | Master Index nhân vật, sơ đồ mạng lưới quan hệ (Mermaid Graph) và liên kết đến từng thẻ nhân vật độc lập. | [Xem Characters.md](NovelProject/Characters.md) |
| **Characters/*.md** | Cơ sở dữ liệu thẻ nhân vật 2 vùng dữ liệu: 🔒 Thuộc tính cố định (Chỉ đọc) & 🔄 Thuộc tính biến động (Cập nhật sau mỗi chương). | [Xem Thư mục Thẻ](NovelProject/Characters/) |
| **Timeline.md** | Bảng tra cứu trạng thái nhân vật theo thời gian thực + Cơ chế xác thực kép tuổi (`Năm Roland - Năm sinh`) + Nhật ký sự kiện toàn bộ các chương. | [Xem Timeline.md](NovelProject/Timeline.md) |
| **Foreshadows.md** | Bảng quản lý phục bút cài cắm và lộ trình thu hồi (Plant - Reinforce - Payoff): Bột Hoa Xám, súng ma đạo, mỏ quặng đen, bẫy Rừng Sương Muối... | [Xem Foreshadows.md](NovelProject/Foreshadows.md) |
| **Style_Profile.md** | Hồ sơ phong cách Seinen Light Novel Nhật Bản (*Grimgar*, *86*, *Mushoku Tensei*), bảng đối chiếu từ cấm và kỹ thuật giác quan vật lý / cảm xúc nén. | [Xem Style_Profile.md](NovelProject/Style_Profile.md) |
| **Review_Checklist.md** | Quy trình tự thẩm định chất lượng 6 chiều sau mỗi chương viết xong trước khi xuất bản. | [Xem Review_Checklist.md](NovelProject/Review_Checklist.md) |

---

## 2. THÔNG TIN TỔNG QUAN TÁC PHẨM

* **Tên truyện chính thức:** *Biên Niên Sử Tro Tàn: Kalvin Palace*
* **Tên phụ đề / Đề xuất:** *Nam Tước Của Vùng Đất Chết* | *Đứa Con Bị Lãng Quên Của Nhà Palace*
* **Thể loại:** High Fantasy, Seinen Light Novel, Quản trị lãnh địa (Kingdom Building), Học viện quý tộc, Chiến tranh chiến thuật, Drama gia tộc, Slow-burn Romance, Tình bạn sinh tử.
* **Chủ đề trung tâm (Core Theme):** Sự trỗi dậy từ nghịch cảnh tăm tối, phá vỡ xiềng xích định kiến giai cấp, giá trị của lòng trung thành và lời hứa thuở hàn vi.
  > *"Một kẻ sinh ra dưới đáy bùn lầy, bị chính máu mủ vứt bỏ, liệu có thể dùng những thứ bị thế gian coi là rác rưởi để tự tay đúc nên vương miện của riêng mình hay không?"*

---

## 3. NGUYÊN TẮC CỐT LÕI CỦA TÁC GIẢ & AI GHOSTWRITER

1. **Nguyên tắc "Khung Xương Sống & Da Thịt Sáng Tạo":** Tài liệu này là la bàn định hướng và trục xương sống cốt truyện, **không phải một kịch bản đóng khung ép buộc**. Người viết được toàn quyền bổ sung các nhân vật phụ có tính cách riêng, các chi tiết đời thường, những phong tục tập quán địa phương, những khoảng lặng giàu chất thơ và các chuyển biến tình huống nhỏ, miễn sao bám sát dòng thời gian (timeline), tính cách nhân vật cốt lõi và các cột mốc trọng yếu (milestones) của từng Arc.
2. **Nguyên tắc Tính Liền Mạch Của Dòng Thời Gian (Timeline Continuity):** Timeline giữa các chương phải thật chặt chẽ để thời gian trong truyện là liền mạch và hợp lý. Khi bắt đầu mỗi chương mới, người viết bắt buộc phải làm rõ timeline và bối cảnh thời gian diễn ra chương truyện bằng văn phong tự nhiên.
3. **Nguyên tắc Tuyệt Đối Không Đưa Chú Thích Giai Đoạn Vào Văn Bản Độc Giả:** Các nhãn giai đoạn như `(Giai đoạn 2.2: Năm 2)` chỉ là công cụ tổ chức tư duy nội bộ của Master Outline, tuyệt đối không được đưa vào nội dung chương truyện hay hiển thị trên giao diện đọc của người dùng.

---

## 4. BỘ QUY CHUẨN VĂN PHONG SEINEN LIGHT NOVEL NHẬT BẢN

> **MỤC TIÊU HÀNH VĂN:** Tạo nên bầu không khí trầm lắng, chân thực, giàu tính điện ảnh và chiều sâu tâm lý, tương tự văn phong các tác phẩm: *Grimgar of Fantasy and Ash (Hai to Gensou no Grimgar)*, *86 - Eighty Six*, *Mushoku Tensei*, *Sói và Gia Vị (Spice and Wolf)*.

### 4.1. BẢNG ĐỐI CHIẾU TỪ NGỮ VÀ LỐI HÀNH VĂN
| Yếu tố | CẤM TUYỆT ĐỐI (Tiên hiệp / Kiếm hiệp Trung Quốc) | BẮT BUỘC SỬ DỤNG (Phong cách Light Novel Nhật Bản) |
| :--- | :--- | :--- |
| **Miêu tả biểu cảm** | *Sắc mặt đại biến, hít một hơi khí lạnh, cười gằn, khóe miệng giật giật, trong lòng dâng lên sóng to gió lớn, ngây như phỏng, khinh thường liếc nhìn con kiến.* | *Mí mắt giật nhẹ, lồng ngực thắt lại, ánh mắt trầm xuống như mặt nước đóng băng, nuốt khan một ngụm nước bọt buốt lạnh, im lặng dõi theo từng chuyển động nhỏ.* |
| **Miêu tả sát khí / chiến đấu** | *Sát khí ngập trời, ngàn cân treo sợi tóc, bọt máu cuồng phun, một quyền đánh nổ, huyết nhục mơ hồ, vạn kiếp bất phục, khí thế áp đảo thiên địa.* | *Hơi thở sắc lạnh như lưỡi dao cạo, mùi sắt rỉ xộc vào cánh mũi, thớ cơ bắp căng cứng đến phát đau, tiếng kim loại va đập đanh gọn, máu đỏ sẫm rỉ qua khe giáp đá.* |
| **Xưng hô & Đối thoại** | *Tiểu tử thối, lão bất tử, con kiến hôi, ngươi muốn chết, to gan lớn mật, cút cho ta, bản tọa, lão phu, tại hạ, các hạ.* | *Cậu, cô, hắn, ông ta; mày - tao (khi thù địch/thô lỗ); ngài, điện hạ, thiếu gia; tớ - cậu, anh - em (bạn bè thân thiết, tình cảm).* |
| **Cấu trúc nhịp điệu** | Dùng câu văn đao to búa lớn, cảm thán liên tục ("thế mà lại là...", "chẳng lẽ là...", "lực lượng kinh khủng bực này!"). | Dùng câu văn ngắn, ngắt nhịp giàu nhịp điệu, chú trọng khoảng lặng (*Ma - 間*), để cảm xúc nén vào hành động thay vì bộc lộ ồn ào. |

### 4.2. Kỹ thuật miêu tả đặc trưng
1. **Ý thức về không gian vật lý và giác quan (Sensory Details):** Luôn gắn hành động của nhân vật với các chi tiết môi trường: tiếng tuyết vỡ giòn rụm dưới đế giày da mòn, hơi thở biến thành màn sương trắng mờ đục trước mũi, ánh nến leo lét phản chiếu trên vết rỉ sét của lưỡi kiếm, vị chua chát của mẩu bánh mì đen cám mốc.
2. **Độc thoại nội tâm sắc lạnh và thực tế:** Nội tâm của Kalvin mang tính logic, tỉnh táo, quan sát như một nhà khoa học giải phẫu tình huống. Cậu không rên rỉ than vãn số phận, mà phân tích: lượng ma lực còn lại, góc độ của đòn tấn công, động cơ ẩn sau nụ cười của đối phương.
3. **Cảm xúc nén (Understated Emotion):** Nỗi đau không được diễn tả bằng tiếng khóc gào thét, mà bằng sự im lặng: bàn tay run rẩy giấu sau vạt áo, tiếng vải lanh lau vết máu trên bàn tay người mẹ, hay cái cúi đầu thật sâu của Roy trong bóng tối của gian phòng cối xay hoang phế.
4. **Định vị thời gian và tính chặt chẽ của dòng chảy sự kiện (Temporal Anchoring):** Không bao giờ để mốc thời gian trôi nổi mơ hồ. Bắt đầu mỗi chương, các yếu tố thời gian (mùa màng, thời khắc trong ngày, độ trôi của thời gian kể từ chương trước) phải được lồng ghép tự nhiên nhưng rõ ràng qua giác quan và môi trường xung quanh, bảo đảm nhịp thời gian nối tiếp chặt chẽ không có kẽ hở.

---

## 5. MẠCH TRUYỆN CHI TIẾT THEO TIMELINE (MASTER OUTLINE)

### ARC 1: TUỔI THƠ TRONG NHÀ PALACE (Năm 936 – 940 Lịch Roland)
* **Chương 1 – 4:** Mùa đông buốt giá ở khu nhà phụ. Kalvin dùng ma lực vi mô lọc độc tố Bột Hoa Xám trong thuốc của mẹ. Căn phòng cối xay gió bỏ hoang và sự hình thành của bộ ba.
* **Chương 5 – 8:** Kalvin học lỏm bài giảng dẫn Khí của Hiệp sĩ Gareth và lý thuyết ma pháp của Arthur, dạy lại cho Roy và tự mình nghiên cứu.
* **Chương 9 – 12:** Biến cố trưng thu thuế tàn khốc khiến cha mẹ Rumy qua đời. Kalvin đưa cô bé về cối xay; Rumy vô tình bộc lộ Thánh thuật Trị liệu thanh tẩy vết độc trên tay Kalvin. Kalvin buộc cả nhóm giữ bí mật tuyệt đối.
* **Chương 13 – 15+:** Sức khỏe bà Elena nguy kịch vì mưu sâu của Cordelia. Bi kịch thúc đẩy quyết tâm dứt áo ra đi. Bộ ba thi đỗ kỳ tuyển sinh của Học viện Hoàng gia (Rumy nhận học bổng Thánh điện hiếm có, Roy thi tuyển đội dự bị Kỵ sĩ, Kalvin dùng điểm số lý thuyết đỗ hệ nghiên cứu).

---

### ARC 2: HỌC VIỆN HOÀNG GIA LEICESTER (Năm 941 – 944 Lịch Roland)
**Tông màu:** Trí tuệ, phân tầng giai cấp, ngột ngạt sau vẻ hoa lệ, tích lũy nội lực.

* **Giai đoạn 2.1: (Năm nhất) Đồng phục viền xám và Những ánh mắt khinh miệt (Chương 16 – 20)**
  * *Bối cảnh:* Học viện Hoàng gia phân chia học viên thành 3 cấp bậc rõ rệt: Áo choàng viền vàng (Đại quý tộc), Viền bạc (Tiểu quý tộc/Quan lại), Viền xám (Học bổng thường dân/Con ngoài giá thú).
  * *Diễn biến:* Roy bị các đệ tử Kỵ sĩ quý tộc chèn ép nơi sân tập; Rumy bị cô lập tại Phân viện Trị liệu vì không có gia tộc bảo hộ; Kalvin nhận công việc thủ thư tại Thư viện Ngầm để tiếp cận các cổ thư ma pháp bị cấm.
  * *Tình tiết then chốt:* Kalvin phát hiện quy luật cấu trúc vòng ma pháp của các cổ ngữ thất truyền, bắt đầu tự xây dựng phương pháp "Niệm chú tĩnh" (Silent Casting).
* **Giai đoạn 2.2: (Năm 2) Buổi tiệc trăng tuyết & Gặp gỡ Công chúa Celine (Chương 21 – 25)**
  * *Diễn biến:* Tại buổi dạ tiệc mùa đông của sinh viên, nhóm quý tộc thân Arthur Palace cố tình làm bẽ mặt Rumy và Kalvin bằng cách đổ rượu và vu oan trộm cắp huy hiệu ma đạo.
  * *Bước ngoặt:* Kalvin dùng lý luận sắc bén bóc trần sơ hở ma thuật ngay trước mặt các giáo sư. Công chúa Celine xuất hiện, dùng uy quyền giải vây và nhìn ra sự nguy hiểm ẩn sau đôi mắt xám tro của Kalvin.
  * *Thỏa thuận ngầm:* Celine mời Kalvin tham gia nhóm nghiên cứu chiến lược kinh tế của cô; Kalvin đổi lấy quyền tiếp cận kho tài liệu địa lý và quân sự hoàng gia.
* **Giai đoạn 2.3: (Cuối năm 2) Xưởng Giả kim dưới hầm & Kẻ lập dị Finn Thorne (Chương 26 – 30) — [HIỆN TẠI ĐANG Ở CHƯƠNG 28]**
  * *Diễn biến:* Kalvin tìm đến tầng hầm bỏ hoang của Học viện, nơi Finn Thorne đang bị đe dọa đuổi học vì các thí nghiệm nổ rune và lò đốt khoáng thạch.
  * *Hợp tác:* Kalvin giải quyết bài toán cân bằng nhiệt ma lực cho phát minh của Finn, nhận ra tiềm năng khổng lồ của việc ứng dụng rune vào công cụ lao động thay vì chỉ dùng cho vũ khí chiến tranh xa xỉ. Finn thề trung thành và trở thành cánh tay kỹ thuật đầu tiên của Kalvin.
  * *Chương 28 đã hoàn thành:* Cấm Vệ Quân của Celine chính thức tiếp quản trạm gác bảo vệ Tầng Hầm Số Bảy; nhóm bắt đầu chế tạo nguyên mẫu súng ma đạo đầu tiên.
* **Giai đoạn 2.4: (Cuối năm 3) Kỳ thi Thử thách Rừng Sương Muối & Biến cố Thú triều (Chương 31 – 35+)**
  * *Xung đột:* Arthur Palace cấu kết với giám thị quý tộc để đẩy đội của Kalvin, Roy, Rumy vào khu vực nguy hiểm trong kỳ thi thực chiến thường niên.
  * *Biến cố:* Một đợt dị biến ma thú cấp 5 đột ngột tràn qua phòng tuyến biên giới học viện. Đội quý tộc của Arthur hoảng loạn bỏ chạy, bỏ mặc các học viên viền xám.
  * *Cao trào:* Kalvin đứng ra chỉ huy lâm thời. Cậu dùng địa hình thung lũng tuyết, kết hợp các bẫy rune kích nổ của Finn, nhát kiếm kiên cường của Roy và vòng bảo hộ Thánh thuật của Rumy để chặn đứng bầy ma thú, cứu sống hàng chục học viên và cả Công chúa Celine.
  * *Kết cục Arc 2:* Hoàng thất không thể che đậy chiến công này. Tuy nhiên, phe quý tộc bảo thủ (và lá đơn kiến nghị ngầm từ nhà Palace) lo sợ Kalvin có chỗ đứng ở Vương đô, bèn xúi giục Quốc vương ban cho cậu một "phần thưởng độc dược": Sắc phong Kalvin làm **Nam tước độc lập**, nhưng vùng đất được ban phát lại là **Manchester (Ashen Hold)** — vùng đất chết không ai thèm nhận.
  * Kalvin đón nhận chiếu chỉ với nụ cười lạnh lùng. Cậu tốt nghiệp học viện và rời khỏi Vương đô mục nát.

---

### ARC 3: MANCHESTER – PHÁO ĐÀI CỦA TRO TÀN (Năm 945 – 947 Lịch Roland)
**Tông màu:** Khắc nghiệt, thực tế, tỉ mỉ trong từng bước xây dựng (Kingdom Building), cảm động về tình người nơi cùng cực.

* **Giai đoạn 3.1: Tiếp quản vùng đất chết (Chương 36 – 42)**
  * Đoàn người của Kalvin, Rumy, Roy, Finn cùng một số học viên nghèo đi theo đặt chân đến Ashen Hold giữa cơn bão tuyết.
  * Hiện thực nghiệt ngã: Pháo đài nứt nẻ, chưa đầy 400 dân cư gồm tội phạm lưu đày, người tàn tật và dân tị nạn đói khát. Trưởng làng già nhìn tân Lãnh chúa với ánh mắt khinh miệt và vô vọng.
  * Kalvin không diễn thuyết suông. Cậu cùng Roy lội tuyết khảo sát địa hình, phát hiện mạch địa nhiệt ngầm và mỏ đá đen nhiễm ma lực tỏa nhiệt.
* **Giai đoạn 3.2: Bát cháo nóng và Mạch nước ngầm (Chương 43 – 50)**
  * Kalvin cùng Finn thiết kế hệ thống ống dẫn nhiệt bằng đá đen chạy ngầm dưới nền các lán trại dân cư; Rumy lập trạm xá cứu chữa cho những thợ mỏ bị bệnh phổi tro bụi.
  * Lòng tin được xây bằng hành động thực tế: Kalvin trừng phạt nghiêm khắc tên quản lý tham nhũng cũ, chia đều khẩu phần lương thực mang từ Hoàng đô cho từng đứa trẻ đói ăn.
  * Roy tuyển chọn 50 thanh niên bản địa khỏe mạnh, bắt đầu huấn luyện kỷ luật thép và phương pháp dẫn Khí cơ bản mà Kalvin đúc kết.
* **Giai đoạn 3.3: Cuộc cách mạng tro tàn (Chương 51 – 60+)**
  * Rumy phát hiện loài cây Hắc Tinh (củ rễ đen có thể sống trên đất nhiễm tro bụi khoáng chất) khi được tưới bằng nước suối địa nhiệt đã thanh lọc được vị đắng chát, trở thành nguồn tinh bột dồi dào.
  * Finn hoàn thiện lò rèn sử dụng lõi nhiệt ma đạo, bắt đầu rèn ra những lưỡi cuốc, xẻng và giáo mác bằng thép đen tôi luyện có độ bền vượt trội.
  * Tin đồn về một lãnh địa phương Bắc có lò sưởi ấm và lương thực lan ra, dòng người tị nạn mùa đông bắt đầu đổ về Manchester.

---

### ARC 4: CUỘC CHIẾN ĐẦU TIÊN – BẢO VỆ BÌNH MINH (Năm 948 – 949 Lịch Roland)
**Tông màu:** Căng thẳng chính trị, chiến tranh tiêu thổ, đẫm máu và bi tráng.

* **Giai đoạn 4.1: Sự thèm khát của Tử tước Vane (Chương 61 – 67):** Tử tước lân cận Vane (liên minh nhà Palace) nhận thấy Manchester trở thành mỏ vàng khoáng sản bèn tung cướp phá và phong tỏa đường muối. Kalvin tương kế tựu kế phản kích.
* **Giai đoạn 4.2: Tường đồng vách sắt trên đèo Tuyết Rơi (Chương 68 – 74):** 1.500 quân chính quy của Vane tiến đánh. Kalvin dùng 300 dân quân áp dụng chiến thuật phòng ngự phi đối xứng, bẫy tuyết lở và chông ma đạo.
* **Giai đoạn 4.3: Huyết chiến giữ pháo đài (Chương 75 – 85+):** Roy tử thủ cổng thành đá; Rumy duy trì trận địa trị liệu tiền tuyến; Kalvin kích hoạt bẫy ma pháp địa nhiệt quét sạch chủ lực của Vane. Bắt sống Tử tước Vane, triều đình buộc phải công nhận tư cách lãnh chúa hợp pháp của Kalvin.

---

### ARC 5: ÂM VANG PHƯƠNG BẮC & NGÀY TRỞ VỀ NHÀ PALACE (Năm 950 – 951 Lịch Roland)
* **Giai đoạn 5.1: Bàn cờ nợ nần (Chương 86 – 92):** Kalvin mua lại toàn bộ văn tự nợ của nhà Palace sắp phá sản.
* **Giai đoạn 5.2: Trở lại cố hương (Chương 93 – 101):** Kalvin dẫn đoàn kỵ sĩ thép đen về Lâu đài Palace, đưa chứng cứ đầu độc bà Elena và hồ sơ tham ô bẻ gãy Cordelia và Roderick.
* **Giai đoạn 5.3: Thanh kiếm phân định (Chương 102 – 110):** Roy đánh gãy kiếm của Arthur. Lâu đài Palace sáp nhập vào Manchester. Kalvin được tấn phong **Bá tước**.

---

### ARC 6: BÀN CỜ VƯƠNG ĐÔ & MÙA ĐÔNG ĐẪM MÁU (Năm 952 – 953 Lịch Roland)
* **Giai đoạn 6.1: Vũ hội mặt nạ (Chương 111 – 120):** Kalvin và Rumy bước vào chính trường Vương đô; lập liên minh bí mật với Celine.
* **Giai đoạn 6.2: Dịch bệnh ma đạo & Vụ ám sát trong tuyết (Chương 121 – 130):** Đại Hoàng tử cấu kết gián điệp Noxus; Kalvin trút cơn thịnh nộ thanh trừng sào huyệt sát thủ.
* **Giai đoạn 6.3: Đêm Trường Kiếm (Chương 131 – 140):** Đảo chính nổ ra; quân Manchester tiến vào dập tắt phản loạn; Celine lên ngôi Nữ vương; Kalvin được phong **Hầu tước Bắc cảnh**.

---

### ARC 7: BỨC TƯỜNG BĂNG GIÁ & BÍ MẬT CỔ ĐẠI (Năm 954 – 955 Lịch Roland)
* **Giai đoạn 7.1: Công nghiệp hóa phương Bắc (Chương 141 – 150):** Đường sắt ma đạo đầu tiên; thành lập Viện Khoa học & Ma đạo Manchester.
* **Giai đoạn 7.2: Phế tích kỷ nguyên thứ nhất (Chương 151 – 160):** Khai quật hầm Ashen Hold, tìm thấy bí mật Cảnh giới Truyền thuyết.
* **Giai đoạn 7.3: Đại Thú Triều Cực Bắc (Chương 161 – 170):** Hàng vạn ma thú tràn xuống từ rặng băng vĩnh cửu; Roy đột phá Lục tinh, Rumy thức tỉnh Thánh vực toàn phần, Kalvin lĩnh ngộ ma thuật cấu trúc cổ đại.

---

### ARC 8: BÌNH MINH VƯƠNG QUỐC MỚI & BÃO TỐ PHƯƠNG ĐÔNG (Năm 956 – 958+ Lịch Roland)
* **Giai đoạn 8.1: Đế quốc Noxus xuất binh (Chương 171 – 182):** Đại quân Noxus tràn qua biên giới; dân tị nạn chạy về pháo đài Manchester kiên cố.
* **Giai đoạn 8.2: Chiến dịch Bình Nguyên Tuyết Trắng (Chương 183 – 198):** Đấu trí giữa kỷ luật quân sự Noxus và công nghiệp ma đạo Manchester. Đánh bại Tướng quân Bát tinh địch, ký hiệp ước công nhận biên giới.
* **Giai đoạn 8.3: Vương miện Tro Tàn (Chương 199 – 210+):** Lễ đăng quang giản dị tại Ashen Hold. Kalvin đội vương miện thép đen bên cạnh Rumy và Roy, chính thức lập nên Vương quốc Tro Tàn độc lập.

---

## 6. QUY TRÌNH TIẾP NỐI & CỔNG KIỂM SOÁT BẮT BUỘC (CONTINUATION PROTOCOL)

Khi viết chương tiếp theo (ví dụ Chương 29):
1. **Tra cứu trước (Pre-write Gate):** Đọc `NovelProject/Timeline.md` và các thẻ nhân vật `NovelProject/Characters/*.md` của nhân vật có mặt.
2. **Sáng tác:**
   - Mở đầu bằng định vị thời gian tự nhiên: `*Mùa đông năm 942 lịch Roland – Sáng sớm sau sự kiện tại Tầng Hầm Số Bảy...*` (Tuyệt đối không có nhãn Giai đoạn).
   - Duy trì độ dài **3.000 đến 4.000 từ tiếng Việt**.
   - Viết sâu giác quan, cấm triệt để từ ngữ tiên hiệp/kiếm hiệp.
3. **Thẩm định sau (Post-write Gate):** Chạy checklist 6 chiều tại `NovelProject/Review_Checklist.md`.
4. **Đồng bộ Web Reader & Git:** Cập nhật `chapters/chuong_XX.md`, `data/chapters.json`, `js/chapters-data.js` và thực hiện git commit/push lên GitHub.
