import dataHandler from './data-handler';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  renameSync: () => {},
  unlinkSync: () => {},
}));

describe('Data Handler', () => {
  test('Verify the data in flat file matches the data in Patients collection', async () => {
    const data = {
      fieldname: 'file',
      originalname: 'valid.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: 'mock-files/',
      filename: 'valid',
      path: 'mock-files/valid.csv',
      size: 2730,
    };
    const answer = await dataHandler.validateFile(data);
    expect(answer).toBe(true);
  });

  test('Print out all Patient IDs where the first name is missing', async () => {
    const data = {
      fieldname: 'file',
      originalname: 'valid.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: 'mock-files/',
      filename: 'valid',
      path: 'mock-files/valid.csv',
      size: 2730,
    };
    const rows = await dataHandler.readData(data);
    for (let index = 0; index < rows.length; index++) {
      const item = rows[index];
      if (!item.firstName || item.firstName === '') {
        console.info(`Missing firstName for patientId ${item.memberId}`);
      }
    }
    expect(true).toBe(true);
  });

  test('Print out all Patient IDs where the email address is missing, but consent is Y', async () => {
    const data = {
      fieldname: 'file',
      originalname: 'valid.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: 'mock-files/',
      filename: 'valid',
      path: 'mock-files/valid.csv',
      size: 2730,
    };
    const rows = await dataHandler.readData(data);
    for (let index = 0; index < rows.length; index++) {
      const item = rows[index];
      if ((!item.email || item.email === '') && item.consent === 'Y') {
        console.info(`Missing email for patientId ${item.memberId}`);
      }
    }
    expect(true).toBe(true);
  });
});
