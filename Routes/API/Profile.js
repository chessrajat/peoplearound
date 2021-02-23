import express from "express";
import authMiddleware from "../../Middleware/Auth";
import profileModel from "../../Models/ProfileModel";
const router = express.Router();

// @route     GET  api/profile/me
// @desc      Get current user profile
// @access    Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // adding other collection data in same object query
    const profile = await profileModel
      .findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
});

export { router as profileRouter };
