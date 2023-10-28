import express, {Express} from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routerMap from '../routers/map.router';
import SocketsConfig from '../sockets/sockets';

class ServerConnection {

  private app: Express;
  private io: Server;
  private server;
  private socket: SocketsConfig;

  constructor(){
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);

    this.socket = new SocketsConfig(this.io);
    
    this.middleware();
    this.router();
  }

  private router = () => {
    this.app.use('/api/map', routerMap);
  }

  private middleware = () => {
    this.app.use(express.json());
  }

  public connection = () => {
    console.log(process.env.PORT);
    
    this.server.listen(process.env.PORT ?? 3000, () => {
      console.log(`Servidor corriendo en el puerto: ${process.env.PORT ?? 3000}`);
    });
  }

}

export default ServerConnection;