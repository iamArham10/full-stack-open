const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.error("Password not provided");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://imranarham798_db_user:${password}@cluster0.spma4xl.mongodb.net/?appName=Cluster0`;

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
});

const Contact = mongoose.model("Contact", contactSchema);

async function main() {
    try {
        await mongoose.connect(url, {
            family: 4,
        });

        console.log("connected");

        if (process.argv.length === 5) {
            const name = process.argv[3];
            const phone = process.argv[4];

            const newContact = new Contact({
                name: name,
                phone: phone,
            });

            await newContact.save();

            console.log(`added ${name} number ${phone} to phonebook`);
        } else {
            Contact.find({}).then((contacts) => {
                console.log("phonebook:");
                contacts.map((c) => {
                    console.log(`${c.name} ${c.phone}`);
                });
            });

            console.log("phonebook cleared");
        }
    } catch (error) {
        console.error("error occurred", error);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed");
    }
}

main();
