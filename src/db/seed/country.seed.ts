import { Types } from 'mongoose';
import Country from '../../models/country.model';

export default async function countrySeed() {
  const countries = [
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9360"), name: "Armenia", countryCode: "AM" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9361"), name: "Russia", countryCode: "RU" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9362"), name: "Georgia", countryCode: "GE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9363"), name: "United Arab Emirates", countryCode: "AE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9364"), name: "United Kingdom", countryCode: "GB" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9365"), name: "United States", countryCode: "US" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9366"), name: "Germany", countryCode: "DE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9367"), name: "Poland", countryCode: "PL" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9368"), name: "France", countryCode: "FR" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9369"), name: "Italy", countryCode: "IT" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9370"), name: "Spain", countryCode: "ES" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9371"), name: "Portugal", countryCode: "PT" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9372"), name: "Czech Republic", countryCode: "CZ" }
  ]; 

  await Country.deleteMany({});
  await Country.insertMany(countries);

  console.log('Country seeded successfully.');
}
