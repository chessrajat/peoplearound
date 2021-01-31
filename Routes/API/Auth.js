import express from "express";
const router = express.Router();

// @route     GET  api/auth
// @desc      Just a test route
// @access    Public
router.get("/", (req, res) => {
  res.send("Auth route");
});

export { router as authRouter };