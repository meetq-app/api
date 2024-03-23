export enum userRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export enum userGender {
  MALE = 'male',
  FEMALE = 'female',
  NOT_SPECIFIED = 'not specified',
}

export enum userLanguage {
  AM = 'am',
  EN = 'en',
  RU = 'ru',
}

export const userLanguageData = [
  {
    id: "am",
    title: "Armenian",
    nativeTitle: "Հայերեն"
  },
  {
    id: "ru",
    title: "Russian",
    nativeTitle: "Русский"
  },
  {
    id: "en",
    title: "English",
    nativeTitle: "English"
  }
]

export enum userCurrency {
  AMD = 'AMD',
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  GPB = 'GPB',
  AED = 'AED',
}

export enum userCountry {
  ARMENIA = 'Armenia',
  RUSSIA = 'Russia',
  US = 'United States',
  UK = 'United Kingdom',
  UAE = 'United Arab Emirates',
  DE = 'Germany',
  PL = 'Poland',
}

export enum activeStatus {
  ACTIVE = 1,
  PASSIVE = 2,
}

export enum speciality {
  PSYCHOLOGIST = 'Psychologist',
  PSYCHOTHERAPIST = 'Psychotherapist',
  PSYCHIATRIST = 'Psychiatrist'
}

export enum timeZoneConvertionType {
  FROM_TIMEZONE_TO_UTC = 'fromTimezoneToUTC',
  FROM_UTC_TO_TIMEZONE = 'fromUTCToTimezone'
}