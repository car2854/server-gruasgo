import ServerConnection from './connection/serverconnection';

require('dotenv').config()

const main = () => {
  const server = new ServerConnection();

  server.connection();
}

main();