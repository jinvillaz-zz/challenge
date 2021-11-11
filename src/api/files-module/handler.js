import fs from 'fs';
import uploadFile from '../../utils/upload-file';
import dataHandler from '../../modules/data-handler';

export default class Handler {
  static async upload(req, res) {
    try {
      const uploader = uploadFile.getUploadMiddleware();
      await uploader(req, res);
      if (!req.file) {
        return res.status(400).send({ message: 'Please upload a file!' });
      }
      await dataHandler.validateFile(req.file);
      await dataHandler.processData(req.file);
      res.status(200).send({
        message: 'Uploaded the file successfully: ' + req.file.originalname,
      });
    } catch (err) {
      res.status(400).send({
        message: `Could not upload the file: ${err}`,
      });
    }
  }

  static getLastFileUploaded(req, res) {
    fs.readdir('uploads', (err, files) => {
      if (err) {
        res.status(400).send({
          message: 'Unable to scan files!',
        });
      }

      const fileUploaded = { name: files[0] };
      res.status(200).send(fileUploaded);
    });
  }
}
