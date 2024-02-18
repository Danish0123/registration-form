const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const app = express();
const bodyParser = require("body-parser")
const path = require("path");

dotenv.config();
app.use(express.static(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb//${username}:${password}@cluster0.wde4mvo.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const registration = mongoose.model("registration", registrationSchema);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/register", async(req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await registration.findOne({email: email});
  if (!existingUser) {
    const registrationData = new registration({
    firstName,
    lastName,
    email,
    password,
  });
  registrationData
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      res.redirect("error.html");
    });
  res.redirect("success.html");
  }
  else{
    console.log("User already exist")
    res.redirect("error.html")
  }
});

app.listen(8080, () => {
  console.log(`Server is listening on port 8080`);
});
