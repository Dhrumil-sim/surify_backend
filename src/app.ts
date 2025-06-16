import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  userRouter,
  albumRouter,
  songRouter,
  playlistRouter,
  CollaborationRouter,
} from '@routes';
import { errorHandler } from './middlewares/errorHandler/errorHandler.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIoServer } from 'socket.io';
import http from 'http';
import { setupCollaborativeSessionSocket } from 'modules/collaboration/services/collaboration.service.socket.js';

dotenv.config();
class App {
  public app: Application;
  public io: SocketIoServer;
  public server: http.Server;
  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandler();
    // Create an HTTP server and integrate Socket.io
    this.server = http.createServer(this.app); // Create an HTTP server with express
    this.io = new SocketIoServer(this.server, {
      // Pass the server to socket.io
      cors: {
        origin: process.env['CORS_ORIGIN'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Set up socket.io connection events
    this.setSocketEvents();
  }

  private setMiddlewares(): void {
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(
      cors({ origin: process.env['CORS_ORIGIN'], credentials: true })
    );
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');
    this.app.use(cookieParser());
    this.app.use(morgan(':method :url :status :response-time ms'));
  }

  private setRoutes(): void {
    this.app.use('/api/user', userRouter);
    this.app.use('/api/song', songRouter);
    this.app.use('/api/album', albumRouter);
    this.app.use('/api/playlist', playlistRouter);
    this.app.use('/api/collaboration/playlist', CollaborationRouter);
  }

  private setErrorHandler(): void {
    this.app.use(errorHandler);
  }
  private setSocketEvents(): void {
    setupCollaborativeSessionSocket(this.io);
  }
  public getServer(): Application {
    return this.app;
  }
}

export default new App().getServer();
