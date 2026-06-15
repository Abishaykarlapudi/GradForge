const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Create local uploads directory if it does not exist
const localUploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Configure multer storage details
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, localUploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image formats (JPEG/PNG/WEBP) and PDFs are supported.'));
    }
  }
});

// Cloudinary uploader with local filesystem fallback
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const isCloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gradforge'
      });
      // Delete temporary local file
      fs.unlinkSync(req.file.path);
      req.file.path = result.secure_url;
      next();
    } catch (error) {
      console.error('[Cloudinary Upload Error]', error.message);
      next(error);
    }
  } else {
    // Generate server local asset URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    req.file.path = fileUrl;
    next();
  }
};

module.exports = { upload, uploadToCloudinary };
