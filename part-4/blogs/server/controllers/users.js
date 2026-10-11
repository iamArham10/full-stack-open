const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).send(savedUser);
});

userRouter.get("/", async (_req, res) => {
    const users = await User.find({});
    res.send(users);
});

module.exports = userRouter;
