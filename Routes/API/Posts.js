import express from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../../Middleware/Auth";
import postModal from "../../Models/PostModel";
import userModel from "../../Models/UserModel";
const router = express.Router();

// @route     POST  api/posts
// @desc      Create a post
// @access    Private
router.post(
  "/",
  [authMiddleware, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userModel.findById(req.user.id).select("-password");
      const newPost = new postModal({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// @route     GET  api/posts
// @desc      Get All Posts
// @access    Private

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await postModal.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server Error");
  }
});

// @route     GET  api/posts/:post_id
// @desc      Get post by id
// @access    Private
router.get("/:post_id", authMiddleware, async (req, res) => {
  try {
    const post = await postModal.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Internal server Error");
  }
});

// @route     DELETE  api/posts/:post_id
// @desc      Delete a post
// @access    Private

router.delete("/:post_id", authMiddleware, async (req, res) => {
  try {
    const post = await postModal.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorised" });
    }
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Internal server Error");
  }
});

export { router as postsRouter };
