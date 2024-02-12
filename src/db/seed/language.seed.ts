import { Types } from 'mongoose';
import Language from '../../models/language.model';

export default async function languageSeed() {
  const currency = [
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9370'),
      id: 'am',
      title: 'Armenian',
      nativeTitle: 'Հայերեն',
      flagUrl: 'https://dev001meetq.fra1.cdn.digitaloceanspaces.com/flags/am.png' 
    },
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9371'),
      id: 'ru',
      title: 'Russian',
      nativeTitle: 'Русский',
      flagUrl: 'https://dev001meetq.fra1.cdn.digitaloceanspaces.com/flags/ru.png' 
    },
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9372'),
      id: 'en',
      title: 'English',
      nativeTitle: 'English',
      flagUrl: 'https://dev001meetq.fra1.cdn.digitaloceanspaces.com/flags/en.png' 
    },
  ];

  await Language.deleteMany({});
  await Language.insertMany(currency);

  console.log('language seeded successfully.');
}
