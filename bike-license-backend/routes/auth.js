const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Trả cả token và role ra client
    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP tạo ra:", otp);
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút

    console.log("Current:", Date.now());
    console.log("Expires:", user?.resetPasswordExpires?.getTime());
    await user.save();

    const message = `
      <p>Xin chào ${user.name},</p>
      <p>Mã khôi phục mật khẩu của bạn là: <b>${otp}</b></p>
      <p>Mã có hiệu lực trong 10 phút.</p>
    `;

    await sendEmail(user.email, "Mã khôi phục mật khẩu", message, true);
    res.status(200).json({
      success: true,
      message: "Mã khôi phục đã được gửi đến email của bạn.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
router.post("/reset_password", async (req, res) => {
  const { email, otp, password } = req.body;
  console.log("==== DEBUG RESET PASSWORD ====");
  console.log("Body nhận:", req.body);
  console.log("Email nhận:", email);
  console.log("OTP nhận:", otp);
  try {
    const user = await User.findOne({
      email: String(email).trim(),
      resetPasswordOTP: String(otp).trim(),
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("User tìm thấy:", user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
});
module.exports = router;
