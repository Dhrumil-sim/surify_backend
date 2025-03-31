import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import songRouter from './routes/song.routes.js';
import albumRouter from './routes/album.routes.js';
import { errorHandler } from './middlewares/errorHandler/errorHandler.js';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();

    this.setErrorHandler();
  }

  private setMiddlewares(): void {
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(cors({ origin: process.env['CORS_ORIGIN'] }));
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');
    this.app.use(cookieParser());
  }

  private setRoutes(): void {
    this.app.use('/api/user', userRouter);
    this.app.use('/api/song', songRouter);
    this.app.use('/api/album', albumRouter);
  }

  private setErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}

export default new App().getServer();
