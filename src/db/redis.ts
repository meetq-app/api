import * as redis from 'redis';

let redisClient;

function connect() {
  const host = process.env.REDIS_HOST;
  const port = parseInt(process.env.REDIS_PORT);
  const url = `redis://${host}:${port}`;

  redisClient = redis.createClient({ url });
  redisClient.connect();

  redisClient.on('connect', () => {
    console.log('Redis connection established');
  });

  redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
  });
}

export { connect, redisClient };