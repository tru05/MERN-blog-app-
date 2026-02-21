const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase()) && /jpeg|jpg|png|gif|webp/.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Images only'));
};

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
