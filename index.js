const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose
  .connect("mongodb://127.0.0.1:27017/user")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send("All fields are required.");
    }
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user
    await newUser.save();

    //User registerd also this tym mongo is still saving
    res.status(201).send("User registered successfully");
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
      return res.status(401).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(login);
    if (isMatch) {
      // Matching pass
      res.send("Login successful!");
    } else {
      res.status(401).send("Invalid email or password.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during sign in.");
  }
});

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
