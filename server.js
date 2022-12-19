const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3500;

// app.get("/", (req, res) => {
//   res.send("Hello world");
// });

// console.log(__dirname);  //C:\Users\halil\Desktop\Projects-to-github\express

app.get("^/$|/index(.html)?", (req, res) => {
  //res.sendFile("/views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page");
});

//route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attemted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello world");
  }
);

//chaining routes handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`it's alive on port : ${PORT}`));