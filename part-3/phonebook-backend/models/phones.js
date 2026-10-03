const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose
    .connect(url, { family: 4 })
    .then((result) => {
        console.log("mongodb connected");
    })
    .catch((error) => {
        console.log("error connecting to mongoDB", error);
    });

const phoneBookSchema = mongoose.Schema({
    name: String,
    phone: String,
});

phoneBookSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Phone = mongoose.model("Phonebook", phoneBookSchema);

module.exports = Phone;
