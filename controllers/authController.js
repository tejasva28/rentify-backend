const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Hashed Password:', hashedPassword);

    // Create a new user with the hashed password
    const newUser = new User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generating token after user is saved
    const token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: "Email is already in use." });
    } else {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Error registering user", error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    console.log('User found:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error); // Improved logging
    res.status(500).json({ message: "Error logging in", error });
  }
};
