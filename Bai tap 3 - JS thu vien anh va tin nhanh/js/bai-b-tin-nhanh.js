/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.getElementById("o-tim-kiem");
const list = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");

const tinTieuDe = document.getElementById("tin-tieu-de");
const tinNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

// F1. Cập nhật bộ đếm "Đang hiển thị x/y tin"
function capNhatBoDem() {
   const tongSoTin = list.querySelectorAll("li").length;
   const soTinHienThi = list.querySelectorAll("li:not(.an)").length;
   boDem.textContent = `Đang hiển thị ${soTinHienThi}/${tongSoTin} tin`;
}

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay
function locTin() {
   const tuKhoa = oTimKiem.value.toLowerCase();
   const danhSachLi = list.querySelectorAll("li");
   let soTinKhop = 0;

   danhSachLi.forEach((li) => {
      const h3 = li.querySelector("h3");
      const p = li.querySelector("p");
      const tieuDe = h3 ? h3.textContent.toLowerCase() : "";
      const noiDung = p ? p.textContent.toLowerCase() : "";

      if (tuKhoa === "" || tieuDe.includes(tuKhoa) || noiDung.includes(tuKhoa)) {
         li.classList.remove("an");
         soTinKhop++;
      } else {
         li.classList.add("an");
      }
   });

   if (soTinKhop === 0) {
      khongThay.classList.remove("an");
      khongThay.textContent = `Không tìm thấy tin nào cho "${oTimKiem.value}"`;
   } else {
      khongThay.classList.add("an");
   }

   capNhatBoDem();
}

oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list
list.addEventListener("click", (e) => {
   if (e.target.matches("button.more")) {
      const li = e.target.closest("li");
      if (!li) return;

      const p = li.querySelector("p");
      if (!p) return;

      if (p.classList.contains("day-du")) {
         p.classList.remove("day-du");
         e.target.textContent = "Read more >>";
      } else {
         p.classList.add("day-du");
         e.target.textContent = "Thu gọn <<";
      }
   }
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list
nutDang.addEventListener("click", () => {
   const tieuDe = tinTieuDe.value.trim();
   const noiDung = tinNoiDung.value.trim();

   if (tieuDe === "" || noiDung === "") {
      baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
      return;
   }

   const liMoi = document.createElement("li");

   const spanTime = document.createElement("span");
   spanTime.className = "time";
   spanTime.textContent = typeof homNay === "function" ? homNay() : new Date().toLocaleDateString("vi-VN");

   const h3 = document.createElement("h3");
   h3.textContent = tieuDe;

   const p = document.createElement("p");
   p.textContent = noiDung;

   const nutMore = document.createElement("button");
   nutMore.type = "button";
   nutMore.className = "more";
   nutMore.textContent = "Read more >>";

   liMoi.append(spanTime, h3, p, nutMore);
   list.prepend(liMoi);

   tinTieuDe.value = "";
   tinNoiDung.value = "";
   baoLoi.textContent = "";

   locTin();
});

// Khởi chạy đồng bộ trạng thái ban đầu khi vừa tải trang
locTin();