import emailHandler from './email-handler';
import dbHandler from '../database';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: () => {
    class Email {
      constructor(data) {
        this.data = data;
      }

      save() {
        return Promise.resolve(this.data);
      }

      static find() {
        return {
          populate: () => {
            return Promise.resolve([]);
          },
        };
      }
    }
    return Email;
  },
}));

describe('EmailHandler', () => {
  jest.useFakeTimers();
  beforeAll(async () => {
    await emailHandler.init();
  });

  test('Verify Emails were created in Emails Collection for patients who have CONSENT as Y', async () => {
    const data = {
      consent: true,
      id: '618c11cf3987e248b9e70ee3',
    };
    const answer = await emailHandler.processData(data);
    expect(answer.length).toBe(4);
  });

  test('Verify emails for each patient are scheduled correctly', async () => {
    const data = {
      consent: true,
      id: '618c11cf3987e248b9e70ee3',
    };
    const answer = await emailHandler.processData(data);
    expect(answer.length).toBe(4);
  });
});
