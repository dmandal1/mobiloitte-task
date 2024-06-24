import amqp from 'amqplib/callback_api';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

function startWorker() {
  amqp.connect(`amqp://localhost`, (err, connection) => {
    if (err) {
      throw err;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      let queueName = 'user_operations';

      channel.assertQueue(queueName, {
        durable: false,
      });

      channel.consume(
        queueName,
        (msg) => {
          console.log(`Received: ${msg!.content.toString()}`);
        },
        {
          noAck: true,
        }
      );
    });
  });
}
startWorker();
