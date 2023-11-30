import { appLanguage } from '../../enum/app.enum';
import Offering from '../../models/offering.model';

export default async function offeringSeed() {
  const offerings = [
    {
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
