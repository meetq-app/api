import { Types } from 'mongoose';
import Currency from '../../models/currency.model';

export default async function currencySeed() {
  const currency = [
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9360'),
      code: 'USD',
      title: 'United States dollar',
      symbol: '$',
      usdCourse: 1
    },
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9361'),
      code: 'AMD',
      title: 'Armenian Dram',
      symbol: '֏',
      usdCourse: 1
    }, 
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9362'),
      code: 'EUR',
      title: 'Euro',
      symbol: '€',
      usdCourse: 1
    },
    {
      _id: new Types.ObjectId('65b61d7a8db4edc72edb9363'),
      code: 'GBP',
      title: 'EuPound sterling',
      symbol: '£',
      usdCourse: 1
    },
    {
      _id: new Types.ObjectId('65b61d169b702b84dbebc6a4'),
      code: 'AED',
      title: 'United Arab Emirates dirham',
      symbol: 'د.إ',
      usdCourse: 1
    },
    {
      _id: new Types.ObjectId('65b61d169b702b84dbebc6a5'),
      code: 'RUB',
      title: 'Russian ruble',
      symbol: '₽',
      usdCourse: 1
    },            
  ];

  await Currency.deleteMany({});
  await Currency.insertMany(currency);

  console.log('currency seeded successfully.');
}
