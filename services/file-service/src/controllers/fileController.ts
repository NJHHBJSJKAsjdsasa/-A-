import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../models/File';
import { AuthRequest } from '../middleware/auth';
import { minioClient, BUCKET_NAME } from '../config/minio';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const file = req.file;
    const { folder = 'general', isPublic = 'false' } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No file uploaded' }
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TYPE', message: 'File type not allowed' }
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'File size exceeds limit (50MB)' }
      });
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const filename = `${folder}/${uuidv4()}.${ext}`;

    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    const url = `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${BUCKET_NAME}/${filename}`;

    const fileDoc = new File({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      uploaderId: userId,
      folder,
      isPublic: isPublic === 'true'
    });

    await fileDoc.save();

    res.status(201).json({
      success: true,
      data: {
        _id: fileDoc._id,
        filename: fileDoc.filename,
        originalName: fileDoc.originalName,
        mimeType: fileDoc.mimeType,
        size: fileDoc.size,
        url: fileDoc.url
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to upload file' }
    });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: { code: 'FILE_NOT_FOUND', message: 'File not found' }
      });
    }

    res.json({ success: true, data: file });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get file' }
    });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: { code: 'FILE_NOT_FOUND', message: 'File not found' }
      });
    }

    if (file.uploaderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own files' }
      });
    }

    await minioClient.removeObject(BUCKET_NAME, file.filename);

    await File.findByIdAndDelete(id);

    res.json({
      success: true,
      data: { message: 'File deleted successfully' }
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete file' }
    });
  }
};

export const getPresignedUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { filename, expiresIn = '3600' } = req.query;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILENAME', message: 'Filename is required' }
      });
    }

    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      filename as string,
      parseInt(expiresIn as string, 10)
    );

    res.json({ success: true, data: { url, expiresIn } });
  } catch (error) {
    console.error('Get presigned URL error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get presigned URL' }
    });
  }
};

export const listFiles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { folder, page = 1, limit = 20 } = req.query;

    const query: Record<string, unknown> = { uploaderId: userId };
    if (folder) query.folder = folder;

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await File.countDocuments(query);

    res.json({
      success: true,
      data: files,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list files' }
    });
  }
};
