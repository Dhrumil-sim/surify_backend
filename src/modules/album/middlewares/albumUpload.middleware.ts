import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

// Function to create directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'coverPicture') {
      uploadPath = './public/uploads/albums/covers/';
    } else {
      uploadPath = './public/uploads/songs/';
    }

    ensureDirectoryExists(uploadPath); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File Filter Function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'songFiles') {
    // Only allow audio files for songFiles
    if (
      file.mimetype.startsWith('audio/') // Check if it's an audio file
    ) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'Only audio files are allowed for songFiles (MP3, WAV, etc.)'
        ),
        false
      );
    }
  } else if (file.fieldname === 'songCovers') {
    // Only allow image files for songCovers
    if (
      file.mimetype.startsWith('image/') // Check if it's an image file
    ) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'Only image files are allowed for songCovers (JPEG, PNG, etc.)'
        ),
        false
      );
    }
  } else if (file.fieldname === 'coverPicture') {
    // You can handle album cover validation here if needed
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          'UNSUPPORTED_MEDIA',
          'Only image files are allowed for album cover (JPEG, PNG, etc.)'
        ),
        false
      );
    }
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'UNSUPPORTED_MEDIA_TYPE',
        'Invalid file type'
      ),
      false
    );
  }
};

// Multer Upload Middleware
export const uploadAlbum = multer({
  storage,
  fileFilter,
});
