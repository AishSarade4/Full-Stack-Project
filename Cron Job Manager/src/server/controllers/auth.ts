import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function register(req: Request, res: Response) {
  const { email, password, name, phone } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      kycStatus: 'pending',
      documentsStatus: 'pending',
      policyStatus: 'pending',
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      kycStatus: user.kycStatus,
      documentsStatus: user.documentsStatus,
      policyStatus: user.policyStatus,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      kycStatus: user.kycStatus,
      documentsStatus: user.documentsStatus,
      policyStatus: user.policyStatus,
    },
  });
}