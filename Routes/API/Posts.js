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

export { router as postsRouter };
