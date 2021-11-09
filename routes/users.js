const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt")
// router.get("/", (req, res) => {
//     res.send("hey its user Page")
// })

// UPDATE USER

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAddmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update your account");
    }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAddmin) {
        if (req.body.password) {

        }
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account");
    }
});

// GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
});

// FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("You are following this user");
            } else {
                res.status(400).json("You already follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourSelf")
    }
});

// UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(400).json("You dont follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant unfollow yourSelf")
    }
});

module.exports = router