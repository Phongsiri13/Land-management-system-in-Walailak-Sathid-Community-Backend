const authorizeRoles = (...allowedRoles) => {
  console.log('allowedRoles:',allowedRoles)
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized. Please log in.", access: false });
    }
    
    const userRole = req.user.role.toString().trim(); // ✅ ป้องกัน Error จาก undefined/null และตัดช่องว่าง
    const allowedRolesStr = allowedRoles.map(role => role.toString().trim()); // ✅ แปลงค่าให้ตรงกัน

    console.log(`User Role: ${userRole}, Allowed Roles: ${allowedRolesStr}`);

    if (!allowedRolesStr.includes(userRole)) {
      return res.status(403).json({ message: "Permission denied.", access: false });
    }

    next();
  };
};

module.exports = { authorizeRoles };
