import appJson from '../app.json';

export const AppConfig = {
  name: appJson.expo.name,
  slug: appJson.expo.slug,
  version: appJson.expo.version,
  scheme: appJson.expo.scheme,
} as const;

export type AppConfigType = typeof AppConfig;