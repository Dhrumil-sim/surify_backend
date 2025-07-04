import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    // Define separate folders for audio and images
    if (file.fieldname === 'coverPicture') {
      cb(null, './public/images'); // Destination for cover pictures
    } else {
      cb(null, './public/song'); // Destination for audio files
    }
  },
  filename: function (_req, file, cb) {
    // Keep original file name
    cb(null, file.originalname);
  },
});

// Initialize multer to handle both fields (audio and image)
const uploadSong = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB for each file
  fileFilter: (_req, file, cb) => {
    // Call the function to check the file type based on the field name
    if (file.fieldname === 'coverPicture') {
      checkImageType(file, cb); // Check for image type
    } else if (file.fieldname === 'filePath') {
      checkAudioType(file, cb); // Check for audio file type
    } else {
      cb(new Error('Invalid field name'));
    }
  },
});

// Check image file type (for cover pictures)
function checkImageType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only Images are allowed: Unsupported Media Type'));
  }
}

// Check audio file type (for song files)
function checkAudioType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /mp3|wav|ogg|flac|m4a/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Allow file based on extension only
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only Music files are allowed: Unsupported Media Type'));
  }
}

export { uploadSong };
