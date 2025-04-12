const router = require("express").Router();
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

// Middleware بررسی توکن
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "دسترسی غیرمجاز" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "توکن نامعتبر است" });
  }
};

// ارسال پیام
router.post("/", verifyToken, async (req, res) => {
  const { receiver, text } = req.body;

  if (!receiver || !text) {
    return res.status(400).json({ msg: "همه فیلدها الزامی‌اند" });
  }

  try {
    const newMsg = await Message.create({
      sender: req.user.id,
      receiver,
      text
    });

    res.status(201).json({
      msg: "پیام با موفقیت ذخیره شد ✅",
      message: newMsg
    });
  } catch (err) {
    res.status(500).json({ msg: "خطا در ذخیره پیام", error: err.message });
  }
});

module.exports = router;
