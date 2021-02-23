import express from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../../Middleware/Auth";
import userModel from "../../Models/UserModel";
import bcrypt from "bcryptjs";
import config from "../../config/default.json"
import jwt from "jsonwebtoken";


const router = express.Router();

// @route     GET  api/auth
// @desc      Get the user info
// @access    private
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

// @route     POST  api/auth
// @desc      Login a user and get token
// @access    Public
router.post(
  "/",
  [
    // adding a express validator in as middleware.
    // to validate input
    check("email", "Please Include a valid Email Address").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // handle the request check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // check if the user exists
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // match user email and password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // return the jwt
      jwt.sign(
        payload,
        config.jwttoken,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export { router as authRouter };
