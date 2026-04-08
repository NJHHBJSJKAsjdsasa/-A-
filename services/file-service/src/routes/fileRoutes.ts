import { Router } from 'express';
import multer from 'multer';
import {
  uploadFile,
  getFile,
  deleteFile,
  getPresignedUrl,
  listFiles
} from '../controllers/fileController';
import { authenticate } from '../middleware/auth';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/:id', getFile);
router.delete('/:id', authenticate, deleteFile);
router.get('/presigned-url', authenticate, getPresignedUrl);
router.get('/list', authenticate, listFiles);

export default router;
