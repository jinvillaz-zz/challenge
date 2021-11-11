import path from 'path';
import http from 'http';
import log4js from 'log4js';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import DBManager from './modules/database';
import packageJson from '../package';
import dataHandler from './modules/data-handler';
import FileHandler from './api/files-module';

const logger = log4js.getLogger('App');
const version = packageJson.version;

/**
 * Module main app.
 */
export default class App {
  /**
   * @param  {Object} config for app.
   */
  constructor(config) {
    this.app = express();
    this.config = config;
    this.setConfiguration(this.app, config);
  }

  /**
   * Sets the basic configuration.
   * @param {Object} app express.
   * @param {Object} config for app.
   */
  setConfiguration(app, config) {
    if (config.environment === 'development') {
      logger.info('configuration for develop');
      app.use(errorHandler());
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
      app.use(express.static(path.join(__dirname, './public')));
    }
    app.set('port', config.port);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
  }

  /**
   * Registers the main routes.
   * @param {Object} app is the main app.
   */
  registerMainApi(app) {
    this.mainRouter = express.Router();
    app.use('/api/v1', this.mainRouter);
    // eslint-disable-next-line prettier/prettier
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
      const status = err.status || 500;
      res.status(status);
      res.json({ message: err.message });
    });
    this.mainRouter.route('/settings').get((req, res) => {
      res.json({ version });
    });
    if (this.config.environment !== 'development') {
      app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, './public/index.html'), err => {
          if (err) {
            res.status(500).send(err);
          }
        });
      });
    }
  }

  /**
   * Load modules.
   * @return {Promise} a new promise.
   */
  async loadModules() {
    await DBManager.connect();
    this.registerMainApi(this.app);
    // RazerHandler.registerApi(this.mainRouter);
    FileHandler.registerApi(this.mainRouter);
    // Other modules should be loaded here.
    await dataHandler.init();
  }

  /**
   * Returns app server.
   * @return {*} app server.
   */
  getAppServer() {
    return this.app;
  }

  startServer() {
    return new Promise(resolve => {
      const httpServer = http.createServer(this.app);
      const port = this.app.get('port');
      httpServer.listen(port, () => {
        logger.info('Web server listening on port ' + port);
        resolve();
      });
    });
  }
}
