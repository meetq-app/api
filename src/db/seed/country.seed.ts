import { Types } from 'mongoose';
import Country from '../../models/country.model';

export default async function countrySeed() {
  const countries = [
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9360"), name: { am: "Հայաստան", ru: "Армения", en: "Armenia" }, countryCode: "AM" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9361"), name: { am: "Ռուսաստան", ru: "Россия", en: "Russia" }, countryCode: "RU" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9362"), name: { am: "Վրաստան", ru: "Грузия", en: "Georgia" }, countryCode: "GE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9363"), name: { am: "ԱՄՆ", ru: "Объединенные Арабские Эмираты", en: "United Arab Emirates" }, countryCode: "AE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9364"), name: { am: "Միացյալ Թագավորություն", ru: "Соединенное Королевство", en: "United Kingdom" }, countryCode: "GB" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9365"), name: { am: "ԱՄՆ", ru: "Соединенные Штаты", en: "United States" }, countryCode: "US" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9366"), name: { am: "Գերմանիա", ru: "Германия", en: "Germany" }, countryCode: "DE" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9367"), name: { am: "Լեհաստան", ru: "Польша", en: "Poland" }, countryCode: "PL" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9368"), name: { am: "Ֆրանսիա", ru: "Франция", en: "France" }, countryCode: "FR" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9369"), name: { am: "Իտալիա", ru: "Италия", en: "Italy" }, countryCode: "IT" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9370"), name: { am: "Իսպանիա", ru: "Испания", en: "Spain" }, countryCode: "ES" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9371"), name: { am: "Պորտուգալիա", ru: "Португалия", en: "Portugal" }, countryCode: "PT" },
    { _id: new Types.ObjectId("65b61d7a8db4edc72edb9372"), name: { am: "Չեխիա", ru: "Чехия", en: "Czech Republic" }, countryCode: "CZ" }
];

  await Country.deleteMany({});
  await Country.insertMany(countries);

  console.log('Country seeded successfully.');
}
