import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './upload.controller';

const router = Router();

// Memory storage keeps buffer in RAM, avoiding local disk writes
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Single file upload via 'file' or 'image' field
router.post('/', upload.single('file'), UploadController.uploadFile);
router.post('/single', upload.single('image'), UploadController.uploadFile);

// Get all uploaded media
router.get('/', UploadController.getAllMedia);

// Delete uploaded media by id
router.delete('/:id', UploadController.deleteMedia);

export const UploadRoutes = router;
