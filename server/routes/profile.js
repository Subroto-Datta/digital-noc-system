// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const authMiddleware = require("../middlewares/authenticationMiddleware");

// // GET logged-in user profile
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // UPDATE logged-in user profile
// router.put("/me", authMiddleware, async (req, res) => {
//   try {
//     const updates = req.body; // phone, department, name, etc.
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updates },
//       { new: true }
//     ).select("-password");

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
