// Basic Lib Import
const express = require("express");
const app = new express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const router = require("./src/routes/api.js");
const multer = require("multer");

const { uploadFileToDrive } = require("./src/utility/driveUtility.js");
const { deleteFileFromDrive } = require("./src/utility/driveUtility.js");
const { readFileUrlFromDrive } = require("./src/utility/driveUtility.js");

// Security Middleware Lib Import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Database Lib Import
const mongoose = require("mongoose");

// Security Middleware Implement
app.use(cookieParser());

app.use(
  cors({
    origin: `${process.env.FRONTEND}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// Body Parser Implement
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.set("trust proxy", true);
// Request Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500000,
  message: "Too many requests from this IP, please try again later.",
  delayMs: 100,

  validate: { trustProxy: false, ip: false },
});
app.use(limiter);

// Mongo DB Database Connection
let URI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fbrulyl.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

let OPTION = { autoIndex: true };

mongoose
  .connect(URI, OPTION)
  .then(() => {
    console.log(">Alhamdulillah. Mongoose Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

//file upload api endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/images");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use(express.static("../public"));

app.post("/upload", upload.single("fileInput"), (req, res) => {
  // Get the file pathname based on the destination and filename generated by Multer
  const fileUrl = `${process.env.BACKEND}/images/${req.file.filename}`;

  // Create a JSON response with the file pathname
  const jsonResponse = { message: "File uploaded successfully", fileUrl };

  res.status(200).json(jsonResponse);
});

// Routing Implement
app.get("/", function (req, res) {
  res.status(200).json({
    data: "I am Working",
  });
});

// uploadFileToDrive();
// deleteFileFromDrive();
// readFileUrlFromDrive();

app.use("/apis/v1", router);

module.exports = app;
