const express = require("express");
const app = express();
const morgan = require("morgan");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"))
  .catch(err => {
    console.log(`DB Connection error : ${err.message}`);
  });

//Bring in routes

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }

    const docs = JSON.parse(data);
    res.json(docs);
  });
});
//middleware

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/", postRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "You are unauthorized to access this end point"
    });
  }
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node js API is listening on port ${port}`);
});
