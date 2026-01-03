import ExpressError from "../Middlewares/ExpressError.js";
import User from "../Models/UsersSchema.js";
import jwt from 'jsonwebtoken';
const genToken = (user) => {
  return jwt.sign({ _id: user._id, name: user.name, email: user.email, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return next(new ExpressError(400, "All fields are required"));
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ExpressError(400, "User already registered"));
  const user = await User.create({ name, email, password })
  const token = genToken(user);
  res.cookie("token", token, { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" }).status(201).json({ message: "User registered successfully", user: { name, email } });
}
const isProd = process.env.NODE === "production";
export const login = async (req, res, next) => {
  console.log("login");
  const { email, password } = req.body;
  if (!email || !password) return next(new ExpressError(400, "Email and password are required"));
  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ExpressError(401, "Please first register"));
  const isPasswordValid = await existingUser.comparePassword(password);
  if (!isPasswordValid) return next(new ExpressError(402, "Invalid password"));
  const token = genToken(existingUser);
  res.cookie("token", token, { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" }).status(200).json({
    message: "Login successful",
    user: {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email
    }
  });
}
export const currentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return next(new ExpressError(404, "User not found"));
  res.json(user);
}
export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) return next(new ExpressError(400, "All fields are required"));
  const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true });
  // const user = await User.findById(req.user._id);
  if (!user) return next(new ExpressError(404, "User not found"));
  // user.name = name;
  // user.email = email;
  // user.password = password;
  // await user.save();
  res.status(200).json({ message: "User updated successfully", user: user });
}
export const logout = (req, res) => {
  console.log("statrts")
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  })
  res.status(200).json({ message: "Logout successful" });
}