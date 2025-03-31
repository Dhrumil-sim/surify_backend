import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('audio/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image and audio files are allowed'), false);
  }
};

// Multer Upload Middleware
export const uploadAlbum = multer({
  storage,
  fileFilter,
});
