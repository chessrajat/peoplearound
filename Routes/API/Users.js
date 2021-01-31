// using express router
import express from "express";
const router = express.Router();

// @route     GET  api/users
// @desc      Just a test route
// @access    Public
router.get("/", (req, res) => {
  res.send("User route");
});

export { router as userRouter };
