import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import User from "../models/User.mjs";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // If the user is authenticated, allow access to the route
  }
  res.status(401).json({ message: "Unauthorized" }); // If not authenticated, return 401 (Unauthorized)
};

// Protected "users" route that requires authentication
router.get("/profile", isAuthenticated, (req, res) => {
  // Access user's profile here
  res.json({ message: "This is the user's profile." });
});

// Get a list of users
router.get("/", async (req, res) => {
  try {
    // Replace 'User' with the actual User model in your application
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get("/id/:id", async (req, res) => {
  try {
    // Replace 'User' with the actual User model in your application
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const { 
    username, 
    password, 
    email, 
    firstName, 
    lastName 
  } = req.body;

  try {
    // Replace 'User' with the actual User model in your application
    const newUser = new User();
    newUser._id = new ObjectId();
    newUser.username = username;
    newUser.firstName = firstName;
    newUser.email = email;
    newUser.lastName = lastName;
    newUser.password = password;
    newUser.createDate = new Date();

    const result = await newUser.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user by ID
router.patch("/id/:id", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Replace 'User' with the actual User model in your application
    const updateUser = {
      username,
      password,
      email,
    };

    const result = await User.findByIdAndUpdate(req.params.id, { $set: updateUser });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete("/id/:id", async (req, res) => {
  const objectIdString = req.params.id;
  const objId = new ObjectId(objectIdString);

  try {
    // Replace 'User' with the actual User model in your application
    const query = { _id: objId };
    const collection = db.collection("users"); // Replace 'users' with the actual collection name
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 1) {
      res.status(204).send(); // Send a "No Content" response to indicate success.
    } else {
      res.status(404).send("User not found"); // Send a 404 status if the user doesn't exist.
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error"); // Send a 500 status for server errors.
  }
});

export default router;
