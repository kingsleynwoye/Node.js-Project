const router = require("express").Router();
const User = require("express").Router();
const bcrypt = require("bcrypt")
// router.get("/", (req, res) => {
//     res.send("hey its user Page")
// })

// update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAddmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
       }
    } else {
        return res.status(403).json("Update your account");
    }
})

module.exports = router