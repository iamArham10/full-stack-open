const http = require("http");

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },

    {
        id: "2",
        content: "JS is easy",
        important: true,
    },

    {
        id: "3",
        content: "TS is easy",
        important: false,
    },
];

const app = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.write("[");
    res.write(JSON.stringify(notes[0]) + ",");
    res.write(JSON.stringify(notes[2]) + ",");
    res.write(JSON.stringify(notes[1]));
    res.write("]");
    res.end();
});

app.listen(3001);
console.log("Running server on 3001");
