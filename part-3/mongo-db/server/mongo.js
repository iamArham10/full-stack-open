const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://imranarham798_db_user:${password}@cluster0.fle3dix.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
    important: true,
    content: "this is my second note",
});

Note.deleteMany({ important: true })
    .then((result) => {
        console.log(`deleted ${result.deletedCount} notes`);
        return note.save();
    })
    .then((savedNote) => {
        console.log("saved note:", savedNote);
        return Note.find({});
    })
    .then((notes) => {
        console.log("all notes:", notes);
        mongoose.connection.close();
    });
