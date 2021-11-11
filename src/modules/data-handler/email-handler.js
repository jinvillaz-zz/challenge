import log4js from 'log4js';
import mongoose from 'mongoose';
import moment from 'moment';
import cron from 'cron';

const CronJob = cron.CronJob;
const logger = log4js.getLogger('EmailHandler');

function insertEmail(name, scheduleDate, patient) {
  const email = new this.Email({ name, scheduleDate, patient });
  logger.info(`Email ${name} scheduled at ${scheduleDate} for patient ${patient}`);
  return email.save();
}

function createJob(email, data) {
  const date = data.scheduleDate;
  if (moment(date).isAfter(moment())) {
    const job = new CronJob(new Date(date), () => {
      logger.info(`Send email ${data.name} to ${email}`);
    });
    job.start();
  }
}

class EmailHandler {
  async init() {
    this.Email = mongoose.model('Email');
    const emails = await this.Email.find({}).populate('Patient');
    for (let index = 0; index < emails.length; index++) {
      const emailScheduled = emails[index];
      createJob.call(this, emailScheduled.patient.email, emailScheduled);
    }
    logger.info(`${emails.length} jobs loaded`);
  }

  async processData(data) {
    const result = [];
    if (!data.consent && (!data.email || data.email === '')) {
      return result;
    }
    for (let index = 1; index <= 4; index++) {
      const date = moment().add(index, 'd');
      date.add(1, 'm');
      const emailScheduled = await insertEmail.call(this, `Day ${index}`, date.toDate(), data.id);
      result.push(emailScheduled);
      createJob.call(this, data.email, emailScheduled);
    }
    return result;
  }
}

const emailHandler = new EmailHandler();
export default emailHandler;
