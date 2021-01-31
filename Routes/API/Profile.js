import express from "express";
const router = express.Router();

// @route     GET  api/profile
// @desc      Just a test route
// @access    Public
router.get("/", (req, res) => {
  res.send("Profile route");
});

export { router as profileRouter };