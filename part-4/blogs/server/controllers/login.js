const loginRouter = require("express").Router();
const User = require("../controllers/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.find({ username });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    if (!user || !passwordCorrect) {
        return res.status(401).json({
            error: "invalid username or password",
        });
    }

    const userForToken = { username: user.username, id: user._id };

    const token = jwt.sign(userForToken, config.SECRET);

    res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
