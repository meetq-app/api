import { Types } from 'mongoose';
import { appLanguage } from '../../enum/app.enum';
import Offering from '../../models/offering.model';

export default async function offeringSeed() {
  const offerings = [
    {
      _id: new Types.ObjectId('65b549d17e3d8e5a4fbde89a'),
      name: {
        [appLanguage.EN]: 'Psychological Counseling',
        [appLanguage.RU]: 'Психологическое консультирование',
        [appLanguage.AM]: 'Հոգեբանական խորհրդատուն',
      },
      description: {
        [appLanguage.EN]: 'Offering psychological counseling services for individuals and groups.',
        [appLanguage.RU]: 'Предоставление услуг психологического консультирования для физических и юридических лиц.',
        [appLanguage.AM]: 'Անհատական եւ աջակցումներ անհատական խորհրդատուն սերվիսները անհատական եւ ինչպես նաև իրավիճակասերի համար:',
      },
    },
    {
      _id: new Types.ObjectId('65b61d169b702b84dbebc6a1'),
      name: {
        [appLanguage.EN]: 'Family Therapy',
        [appLanguage.RU]: 'Семейная терапия',
        [appLanguage.AM]: 'Ընտանիքի թերապիա',
      },
      description: {
        [appLanguage.EN]: 'Specialized therapy sessions for families to improve relationships and communication.',
        [appLanguage.RU]: 'Специализированные сеансы терапии для семей для улучшения отношений и коммуникации.',
        [appLanguage.AM]: 'Ընտանիքի հարաբերությունների եւ կապակցության բարելավման համար հատուկ թերապիայի սեսիաներ:',
      },
    },
    {
      _id: new Types.ObjectId('65b61d169b702b84dbebc6a2'),
      name: {
        [appLanguage.EN]: 'Children Therapy',
        [appLanguage.RU]: 'Терапия для детей',
        [appLanguage.AM]: 'Մանկական թերապիա',
      },
      description: {
        [appLanguage.EN]: 'Therapeutic sessions tailored for children to address emotional and behavioral concerns.',
        [appLanguage.RU]: 'Терапевтические сеансы, ориентированные на детей, для решения эмоциональных и поведенческих проблем.',
        [appLanguage.AM]: 'Տերապեվտիկ սեսիաներ, նախատեսված երեխային առումների համար, որոնք լուծում են հետագա եւ վարկանիշային հարցերը:',
      },
    },
  ];

  await Offering.deleteMany({});
  await Offering.insertMany(offerings);

  console.log('offerings seeded successfully.');
}
