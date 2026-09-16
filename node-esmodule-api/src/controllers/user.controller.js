import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, GenerateRefreshToken } from "../utils/token.js";
import Session from "../models/session.model.js";
export const CreateUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "User already exists",
      });
    }
    const hasedPass = await bcrypt.hash(password, 11);
    const data = await User.create({ name, email, age, password: hasedPass });
    data.save();
    return res.status(201).json({
      success: true,
      msg: "user created successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while create user",
      error: error.message,
    });
  }
};

export const GetUser = async (req, res) => {
  try {
    const data = await User.find();
    if (!data) {
      return res.status(404).json({
        msg: "data not found",
      });
    }
    return res.status(200).json({
      msg: "user data fetch successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while fetching data",
      error: error.message,
    });
  }
};
export const GetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({
        msg: "user not found",
      });
    }
    return res.status(200).json({
      msg: "user data fetch successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while fetch data",
      error: error.message,
    });
  }
};
export const UpdatUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email } = req.body;
    const updateData = await User.findByIdAndUpdate(
      id,
      { name, age, email },
      { new: true, runValidators: true },
    );
    return res.status(200).json({
      msg: "data update successfully",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while update data",
      error: error.message,
    });
  }
};

export const DeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        msg: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "data deleted successfully",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while delete data",
      error: error.message,
    });
  }
};
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: "user not found",
      });
    }
    const ComparePass = await bcrypt.compare(password, user.password);
    if (!ComparePass) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = GenerateRefreshToken(user._id.toString());
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      msg: "Login successfully",
      data: {
        name: user.name,
        email: user.email,
        token: accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "error while login",
      error: error.message,
    });
  }
};
