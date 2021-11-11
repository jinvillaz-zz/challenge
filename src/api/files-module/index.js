import Handler from './handler';

export default class Api {
  static registerApi(router) {
    router.route('/upload').post(Handler.upload);
    router.route('/files').get(Handler.getLastFileUploaded);
  }
}
