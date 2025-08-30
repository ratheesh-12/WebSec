const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());   // ✅ this parses JSON body
app.use(express.urlencoded({ extended: true })); // ✅ handles form data

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
