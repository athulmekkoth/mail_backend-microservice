import express, { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
const { sign, decode, verify } = jsonwebtoken;
import { PrismaClient } from '@prisma/client';
import { createToken } from '../utils/token';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class UserController {
  // Static method to register a new user
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email: email } });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username: name,
          email: email,
          password: hashedPass
        }
      });

      return res.status(200).json({ message: "User created successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Static method to login a user
  static async login(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({ where: { email: req.body.email } });

      if (!user) {
        return res.status(204).json({ message: "User does not exist" });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = createToken(user.id, user.isAdmin);
      res.cookie("token", token, { httpOnly: true });

      return res.status(200).json({
        message: "User logged in successfully",
        user: { id: user.id, name: user.username, isAdmin: user.isAdmin, token: token }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Static method to logout a user
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie('token', { path: '/' });
      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Static method to refresh a token
  static async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({ accessToken: "No token" });
    }

    try {
      const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
      return res.status(200).json({ payload });
    } catch (error) {
      return res.status(400).json({ accessToken: "Invalid token" });
    }
  }

  // Static method to delete a user
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.body;
      await prisma.user.delete({ where: { id: id } });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
