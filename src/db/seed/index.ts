import mongoose from 'mongoose';
import dotenv from 'dotenv';
import offeringSeed from './offering.seed';
dotenv.config();

//@ts-ignore
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(startSeed).catch(console.error);

async function startSeed() {
  try {
    await offeringSeed();
    console.log('all seeds has passed successfully.');
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}
