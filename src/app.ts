import bodyParser from 'body-parser';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import express from 'express';
import path from 'path';
import errorHandler from './services/error-hadlers.serivice';
import v1 from './routes/v1';
import payments from './routes/payments';
import detectUserSettingd from './middleware/detect-language.middlware';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.mountRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json({ limit: '10mb' }));
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(helmet());
    // this.express.use(hpp());
    this.express.use(express.static(path.join(__dirname, 'public')));
    this.express.use(detectUserSettingd);
  }

  private mountRoutes(): void {
    this.express.use('/api/v1', v1);
    this.express.use("/v1/payments", payments);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }
}

export default new App().express;
