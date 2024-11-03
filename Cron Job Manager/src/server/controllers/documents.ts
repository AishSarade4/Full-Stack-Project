import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/error';
import { AuthRequest } from '../types';

export async function uploadDocument(req: AuthRequest, res: Response) {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const document = await prisma.document.create({
    data: {
      userId: req.user!.id,
      type: req.body.type,
      fileUrl: 'placeholder-url', // In production, upload to cloud storage
      status: 'pending',
    },
  });

  res.status(201).json(document);
}

export async function getDocuments(req: AuthRequest, res: Response) {
  const documents = await prisma.document.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json(documents);
}