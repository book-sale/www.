const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // اختیاری
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
