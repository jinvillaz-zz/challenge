import util from 'util';
import path from 'path';
import multer from 'multer';

const maxSize = 4 * 1024 * 1024;

export default class UploadService {
  static getUploadMiddleware() {
    const uploadFile = multer({
      dest: 'uploads/',
      limits: { fileSize: maxSize },
      fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
          return callback(new Error('Only csv files are allowed'));
        }
        callback(null, true);
      },
    }).single('file');
    return util.promisify(uploadFile);
  }
}
