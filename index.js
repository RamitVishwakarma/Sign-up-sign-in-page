const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const env = require("dotenv");
// const prompt = require("prompt");
env.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 4000;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  confirmPassword: String,
});
const User = mongoose.model("User", UserSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crea  new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword, // Store the hashed password
    });
    // Save the user
    await newUser.save();

    //User registerd also this tym mongo is still saving
    res
      .status(201)
      .json({ error: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in user registration");
  }
});

app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/public/signin.html");
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      //no user found
      return res.status(401).json({ error: true, message: "Invalid email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(login);
    if (isMatch) {
      // Matching pass
      return res
        .status(200)
        .json({ error: true, message: "Login successful!" });
    } else {
      return res
        .status(401)
        .json({ error: true, message: "Invalid password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during sign in.");
  }
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
