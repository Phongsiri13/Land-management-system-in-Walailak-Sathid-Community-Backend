
function convertToThaiDateFormat(dateString) {
  // แปลงวันที่เป็นวัตถุ Date
  const date = new Date(dateString);

  // ดึงค่าวัน เดือน และปี
  const day = String(date.getDate()).padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าเลขหลักเดียว
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มที่ 0 จึงต้อง +1
  const thaiYear = date.getFullYear() + 543; // แปลงปีเป็น พ.ศ.

  // คืนค่ารูปแบบ วัน/เดือน/ปี
  return `${thaiYear}-${month}-${day}`;
}
