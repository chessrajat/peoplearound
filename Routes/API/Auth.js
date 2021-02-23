import express from "express";
import authMiddleware from "../../Middleware/Auth";
import userModel from "../../Models/UserModel";
const router = express.Router();

// @route     GET  api/auth
// @desc      Just a test route
// @access    Public
router.get("/", authMiddleware, async (req, res) => {
  // using try catch because calling db
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

export { router as authRouter };
