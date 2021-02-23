import express from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../../Middleware/Auth";
import profileModel from "../../Models/ProfileModel";
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
          { new: true },
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

export { router as profileRouter };
