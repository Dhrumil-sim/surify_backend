// src/middleware/uploadMiddleware.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

// Ensure directory exists
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Memory storage for initial validation
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'songFiles') {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else
      cb(
        new ApiError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'Only audio files allowed'
        ),
        false
      );
  } else if (['songCovers', 'coverPicture'].includes(file.fieldname)) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else
      cb(
        new ApiError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'Only image files allowed'
        ),
        false
      );
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type'), false);
  }
};

// Export multer middleware (for validation phase)
export const validateFiles = multer({ storage, fileFilter }).fields([
  { name: 'songFiles', maxCount: 5 },
  { name: 'songCovers', maxCount: 5 },
  { name: 'coverPicture', maxCount: 1 },
]);

// Manual save function to persist files after validation
export const saveFilesToDisk = (
  files: Express.Multer.File[],
  fieldname: string
) => {
  const targetDir =
    fieldname === 'coverPicture'
      ? './public/uploads/albums/covers/'
      : './public/uploads/songs/';
  ensureDirectoryExists(targetDir);

  const savedPaths: string[] = [];

  files.forEach((file) => {
    const filename = Date.now() + '-' + file.originalname;
    const fullPath = path.join(targetDir, filename);

    fs.writeFileSync(fullPath, file.buffer);
    savedPaths.push(fullPath);
  });

  return savedPaths;
};

// Multer Upload Middleware
export const uploadAlbum = multer({
  storage,
  fileFilter,
});
