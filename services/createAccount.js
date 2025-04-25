const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};



async function createAccount({ name, email, password, role = "user" }) {
  try {
    const newUser = new User({
      name,
      email,
      password, 
      role: role,
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    return { user: savedUser, token: token };
  } catch (error) {

    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      const duplicateEmailError = new Error(
        "Email address is already registered."
      );
      throw duplicateEmailError; 
    } else if (error.name === "ValidationError") {
      throw error;
    } else {
      console.error("Unexpected error during account creation:", error);
      throw new Error("Failed to create account due to a server issue.");
    }
  }
}

module.exports = {
  createAccount,
  generateToken,
};
