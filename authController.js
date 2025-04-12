const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "ایمیل قبلاً ثبت شده است" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, password: hashedPassword, phone });

    res.status(201).json({ msg: "ثبت‌نام موفق", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "خطا در ثبت‌نام", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "کاربر یافت نشد" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "رمز اشتباه است" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ msg: "ورود موفق", token, user });
  } catch (err) {
    res.status(500).json({ msg: "خطا در ورود", error: err.message });
  }
};
