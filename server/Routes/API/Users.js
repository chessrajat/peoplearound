// using express router
import express from "express";
import { check, validationResult } from "express-validator";
import userModel from "../../Models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/default.json";

const router = express.Router();

// @route     POST  api/users
// @desc      Register a user
// @access    Public
router.post(
  "/",
  [
    // adding a express validator in as middleware.
    // to validate input
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please Include a valid Email Address").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // handle the request check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // check if the user exists
      const user = await userModel.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // get user avatar
      // http://avatars.dicebear.com/4.5/api/avataaars/seed.svg
      const avatar = `http://avatars.dicebear.com/4.5/api/avataaars/${email}.svg`;

      let newuser = new userModel({
        name,
        email,
        avatar,
        password,
      });

      // encrypt the password
      const salt = await bcrypt.genSalt(10);
      newuser.password = await bcrypt.hash(newuser.password, salt);

      // save to database
      await newuser.save();

      const payload = {
        user: {
          id: newuser.id,
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

export { router as userRouter };
