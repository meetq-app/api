import mongoose, { Connection } from 'mongoose';

function connect() {
  //@ts-ignore
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

  const db: Connection = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Database connected successfully');
  });
}

export { connect };
