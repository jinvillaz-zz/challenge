import log4js from 'log4js';
import mongoose from 'mongoose';
import moment from 'moment';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { UPLOAD_DIR, HEADERS, CUSTOM_HEADERS, YES } from './constants';
import emailHandler from './email-handler';

const logger = log4js.getLogger('DataHandler');

const validateHeaders = headers => {
  if (HEADERS.length !== headers.length) {
    return false;
  }
  return headers.every((item, index) => {
    return item.toLowerCase() === HEADERS[index];
  });
};

const readHeaders = data => {
  return new Promise((resolve, reject) => {
    let valid = false;
    const stream = fs
      .createReadStream(data.path)
      .pipe(csv.parse({ headers: true, delimiter: '|' }))
      .on('error', error => logger.error(error))
      .on('headers', headers => {
        logger.info('headers ', headers);
        valid = validateHeaders(headers);
        stream.destroy();
      })
      .on('close', () => {
        if (valid) {
          resolve(true);
        } else {
          logger.error('Invalid headers');
          reject('Invalid headers');
        }
      });
  });
};

async function insertData(rows) {
  for (let index = 0; index < rows.length; index++) {
    try {
      const data = rows[index];
      data.consent = data.consent === YES ? true : false;
      const date = moment(new Date(data.dateOfBirth));
      data.dateOfBirth = date.isValid() ? date.toDate() : null;
      const patient = new this.Patient(data);
      const newPatient = await patient.save();
      await emailHandler.processData(newPatient);
    } catch (ex) {
      logger.warn(ex.message);
    }
  }
  return true;
}

class DataHandler {
  async init() {
    this.Patient = mongoose.model('Patient');
    await emailHandler.init();
  }

  validateFile(data) {
    return readHeaders(data);
  }

  readData(data) {
    return new Promise(resolve => {
      logger.info('data: ', JSON.stringify(data, null, 2));
      const rows = [];
      fs.createReadStream(data.path)
        .pipe(csv.parse({ headers: CUSTOM_HEADERS, delimiter: '|' }))
        .on('error', error => logger.error(error))
        .on('data', row => {
          rows.push(row);
        })
        .on('end', rowCount => {
          logger.info(`Parsed ${rowCount} rows`);
          fs.renameSync(data.path, UPLOAD_DIR + data.originalname);
          const files = fs.readdirSync(UPLOAD_DIR);
          for (const file of files) {
            if (data.originalname !== file) {
              fs.unlinkSync(UPLOAD_DIR + file);
            }
          }
          resolve(rows.slice(1));
        });
    });
  }

  async processData(data) {
    const rows = await this.readData(data);
    return insertData.call(this, rows);
  }
}

const dataHandler = new DataHandler();
export default dataHandler;
