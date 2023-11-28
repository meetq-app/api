const constants = {
  SALT_ROUNDS: 12,
  USER_TYPES: {
    REGULAR: 1,
    SOCIAL: 2,
  },
  JWT_SECRET: '6a3014f6-7a01-43cd-ae57-8151fcb18edf',
  SOCIAL_USER: 'social_user',
  DB_ERROR: 'something_went_wrong',
  DEFAULT_PLACE_LIMIT: 20,
  ERR_RESPONSE: {
    EMPTY_EMAIL_OR_PASS: 'email_or_pass_is_empty',
    EMPTY_TYPE: 'type_is_empty',
    EMPTY_SOCIAL_TOKEN: 'social_token_is_empty',
    WRONG_PASSWORD_FORMAT: 'wrong_password_format',
    EMAIL_IS_TAKEN: 'email_is_taken',
    INVALID_FILE_TYPE: 'invalid_file_type',
    LIMIT_UNEXPECTED_FILE: 'limit_unexpected_file',
    INVALID_ID: 'invalid_id',
    WRONG_EMAIL_OR_PASSWORD: 'wrong_email_or_password',
    EMPTY_NAME_LAT_LON: 'Name, Lat and Lon are mandatory',
    FILE_UPLOAD: "Couldn't upload current file",
  },
};

export default constants;
