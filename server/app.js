const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const urlencoded = require("url");
const passport = require("passport");
require("dotenv").config();

//Initialize the app
const app = express();

//Middlewares
// Form Data Middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.json());

//Json Body Middleware
app.use(bodyParser.json());

//Cors Middleware
app.use(cors());
app.use(cookieParser());
//Setting up static directory
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
//Bring  in the database confg
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

app.get("/", (req, res) => {
  return res.send("<h1>Hello</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

app.use("/users", require("./routes/userRouter"));
app.use("/movies", require("./routes/movieRouter"));
app.use("/category", require("./routes/categoryRouter"));
app.use("/contacts", require("./routes/contactRouter"));
app.use("/tickets", require("./routes/ticketRouter"));
