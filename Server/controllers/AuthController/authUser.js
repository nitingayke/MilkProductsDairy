import mongoose from "mongoose";
import User from "../../models/UserSchema.js";
import bcryptjs from "bcryptjs";

export const signUpUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ success:false, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success:false, message: "User already exists" });
  }

  res.status(201).json({
    success : true,
    message: "User info is Correct",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  const isMatched = await bcryptjs.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  res.status(200).json({
    message: "Login Successful",
    user: { _id: user?._id, email },
  });
};

export const verifyOtp = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  const hashedPass = await bcryptjs.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPass,
  });

  await newUser.save();

  res.status(201).json({
    message: "Account Created Successfully",
    success: true,
    user: {
      _id: newUser._id,
      email: newUser.email,
    },
  });
};

export const handleInfoInput = async (req, res) => {
  const { id } = req.body;

  const profileInfo = JSON.parse(req.body.profileInfo);

  const photoUrl = req.file?.url || req.file?.path;

  if (!photoUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Photo upload failed" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...profileInfo,
      photo: photoUrl,
    },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "User updated",
    user: { _id: updatedUser?._id, email : updatedUser?.email },
  });
};

export const getUser = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "_id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ success: true, user });
};
