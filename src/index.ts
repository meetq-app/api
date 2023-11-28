import app from './app';
import serverListener from './services/listeners.service';
import dotenv from 'dotenv';
import { connect as mongoConnect } from './db/mongo';
import { connect as redisConnect } from './db/redis';

dotenv.config();
const port = process.env.PORT || 3030;
const server = app.listen(port);
mongoConnect();
redisConnect();
server.on('listening', serverListener.onListening(port));
server.on('error', serverListener.onError(port));

export default server;
