import amqp, { Channel, Connection } from 'amqplib/callback_api';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

let channel: Channel | null = null;
let connection: Connection | null = null;

export const connectToRabbitMQ = async (): Promise<void> => {
  try {
    connection = await connectRabbitMQ();
    channel = await createChannel(connection);
  } catch (err) {
    throw err;
  }
};

const connectRabbitMQ = (): Promise<Connection> => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.RABBITMQ_URI!, (error, conn) => {
      if (error) {
        reject(error);
      } else {
        resolve(conn);
      }
    });
  });
};

const createChannel = (conn: Connection): Promise<Channel> => {
  return new Promise((resolve, reject) => {
    conn.createChannel((err, ch) => {
      if (err) {
        reject(err);
      } else {
        resolve(ch);
      }
    });
  });
};

export const disconnectRabbitMQ = async (): Promise<void> => {
  try {
    await closeChannel();
    await closeConnection();
  } catch (err) {
    throw err;
  }
};

const closeChannel = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (channel) {
      channel.close((err) => {
        if (err) {
          reject(err);
        } else {
          channel = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const closeConnection = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (connection) {
      connection.close((err) => {
        if (err) {
          reject(err);
        } else {
          connection = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

export const publishToQueue = async (queue: string, message: any): Promise<void> => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel is not available');
    }
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (err) {
    throw err;
  }
};
