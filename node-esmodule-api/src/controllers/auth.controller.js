import jwt from "jsonwebtoken";
import { generateAccessToken, GenerateRefreshToken } from "../utils/token.js";
import Session from "../models/session.model.js";

export const RefreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        msg: "Refresh token required",
      });
    }

    // 1. Verify JWT
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Check token in DB
    const session = await Session.findOne({
      refreshToken: oldRefreshToken,
      userId: decoded.userId,
    });

    if (!session) {
      return res.status(401).json({
        msg: "Invalid or revoked refresh token",
      });
    }

    // 3. Delete old session
    await Session.deleteOne({
      _id: session._id,
    });

    // 4. Generate new tokens
    const accessToken = generateAccessToken(decoded.userId);

    const newRefreshToken = GenerateRefreshToken(decoded.userId);

    // 5. Save new refresh token
    await Session.create({
      userId: decoded.userId,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 6. Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Return new access token
    return res.status(200).json({
      msg: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or expired refresh token",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Session.deleteOne({
        refreshToken,
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      msg: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while logout",
    });
  }
};
