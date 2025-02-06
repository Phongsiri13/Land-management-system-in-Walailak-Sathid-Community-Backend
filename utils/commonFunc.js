// splitFullName.js
export function splitFullName(fullname) {
  const [firstname, lastname] = fullname.trim().split(" ");

  return { firstname, lastname };
}

export function convertNganAndSquareWaToRai(ngan, squareWa) {
  const totalSquareWa = ngan * 100 + squareWa; // แปลงงานและตารางวาเป็นตารางวาทั้งหมด
  const rai = totalSquareWa / 400; // แปลงตารางวาเป็นไร่ (1 ไร่ = 400 ตารางวา)
  return rai; // ส่งค่าที่แปลงเสร็จออกมา
}

export function concealmentFormat(phoneNumber, word_count=6) {
  const regex = new RegExp(`^(\\d{${word_count}})(\\d{4})$`);
  return phoneNumber.replace(regex, `xxxxxx$2`);
}