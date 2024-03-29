export const REDIS_URL: string = process.env.REDIS_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const MYSQL_USER: string = process.env.MYSQL_USER || "";
export const MYSQL_PASS: string = process.env.MYSQL_PASS || "";
export const MYSQL_HOST: string = process.env.MYSQL_HOST || "";
export const MYSQL_DB: string = process.env.MYSQL_DB || "";
export const SERVER_NAME: string = process.env.SERVER_NAME || 'test';
export const ADMIN_EMAILS: string[] = [
  "ajpat1234@gmail.com",
  "yytonyxin@gmail.com",
  "liu.z.jonathan@gmail.com",
  "aidanjsmith0@gmail.com",
];


export const MAILCHIMP: { [key: string]: string } = {
  ORIGIN: 'https://us10.api.mailchimp.com',
  API_KEY: 'c976a90dc0c856fba3bb4459b2ac5a7a-us10',
  LIST_ID: '258332ec01'
};

export const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';