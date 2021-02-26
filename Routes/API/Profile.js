import express from "express";
import { check, validationResult } from "express-validator";
import userModel from "../../Models/UserModel";
import authMiddleware from "../../Middleware/Auth";
import profileModel from "../../Models/ProfileModel";
import mongoose from "mongoose";

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

// @route     POST  api/profile/
// @desc      Create of update userprofile
// @access    Private
router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is Required").not().isEmpty(),
      check("skills", "Skills is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // Insert the data in db
    try {
      let profile = await profileModel.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await profileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
          // this new will give us the updated document
        );
        return res.json(profile);
      }
      // create profile
      profile = new profileModel(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server Error");
    }

    res.send("hello");
  }
);

// @route     GET api/profile/
// @desc      Get all user profile
// @access    Public
router.get("/", async (req, res) => {
  try {
    const profiles = await profileModel
      .find()
      .populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server Error");
  }
});

// @route     GET api/profile/user/:user_id
// @desc      Get profile of user by userid
// @access    Public
router.get("/user/:user_id", async (req, res) => {
  try {
    // before passing check if the user_id is the valid object id
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.user_id);
    if (!isValidId) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    const profile = await profileModel
      .findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.status(500).send("Internal server Error");
  }
});

// @route     GET api/profile
// @desc      Delete profile, user and post
// @access    Private
router.delete("/", authMiddleware, async (req, res) => {
  try {
    // remove profile
    await profileModel.findOneAndRemove({ user: req.user.id });

    // remove user
    await userModel.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server Error");
  }
});

// @route     PUT api/profile/experience
// @desc      Add Profile experience
// @access    Private
router.put(
  "/experience",
  [
    authMiddleware,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await profileModel.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// @route     DELETE api/profile/experience/:exp_id
// @desc      Add Profile experience
// @access    Private
router.delete("/experience/:exp_id", [authMiddleware], async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.exp_id);
  if (!isValidId) {
    return res.status(400).json({ msg: "There is no Experience with this id" });
  }
  const exp_id = req.params.exp_id;

  try {
    const profile = await profileModel.findOne({ user: req.user.id });
    // Get the remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server Error");
  }
});

export { router as profileRouter };
