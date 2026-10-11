const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (_object, outputObject) => {
        outputObject.id = outputObject._id;
        delete outputObject._id;
        delete outputObject.passwordHash;
        delete outputObject.__v;
    },
});

module.exports = mongoose.model("User", userSchema);
