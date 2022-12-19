const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logger");

const PORT = process.env.PORT || 3500;

//custom middleware logger
// app.use((req, res, next) => {
//   logEvents(`${req.method}\t${req}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method} ${req.path}`);
//   next();
// });
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = [
  "https://www.mysite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/*Middleware
---built-in middleware
---custom middleware
---third-part middleware
*/
// built in middleware to handle urlencoded data
// in other words, form data
//content-type : application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

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
