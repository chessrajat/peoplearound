import express from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../../Middleware/Auth";
import postModal from "../../Models/PostModel";
import userModel from "../../Models/UserModel";
import { removeByAttr } from "../../Utils/ArrayRemove";
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

// @route     PUT api/posts/like/:post_id
// @desc      Like a post
// @access    Private
router.put("/like/:post_id", [authMiddleware], async (req, res) => {
  try {
    const post = await postModal.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }
    // check if user already liked the post
    const likedUser = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (likedUser.length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(err.message);
    res.status(500).send("Internal server Error");
  }
});

// @route     PUT api/posts/unlike/:post_id
// @desc      UnLike a post
// @access    Private
router.put("/unlike/:post_id", [authMiddleware], async (req, res) => {
  try {
    const post = await postModal.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // check if user already liked the post
    const likedUser = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (likedUser.length === 0) {
      return res.status(400).json({ msg: "Not liked the post yet" });
    }

    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(err.message);
    res.status(500).send("Internal server Error");
  }
});

// @route     POST api/posts/comment/:post_id
// @desc      Add a comment to post
// @access    Private
router.post(
  "/comment/:post_id",
  [authMiddleware, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await userModel.findById(req.user.id).select("-password");
      const post = await postModal.findById(req.params.post_id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      if (err.kind == "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      console.error(err.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// @route     DELETE api/posts/comment/:post_id/:comment_id
// @desc      Add a comment to post
// @access    Private

router.delete(
  "/comment/:post_id/:comment_id",
  [authMiddleware],
  async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).select("-password");
      const post = await postModal.findById(req.params.post_id);

      // get the comment from the post
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      // check user is same as the one deleting
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorised" });
      }

      // get remove index
      const removeIndex = post.comments
        .map((comment) => comment.user.toString())
        .indexOf(req.user.id);

      post.comments.splice(removeIndex, 1);

      await post.save();
      res.json(post.comments)
    } catch (err) {
      if (err.kind == "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      console.error(err.message);
      res.status(500).send("Internal server Error");
    }
  }
);

export { router as postsRouter };
