import express from "express";
const router = express.Router();

// @route     GET  api/posts
// @desc      Just a test route
// @access    Public
router.get("/", (req, res) => {
  res.send("Posts route");
});

export { router as postsRouter };
