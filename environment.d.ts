// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // app base url
      NEXT_PUBLIC_APP_BASE_URL: string;

      // appwrite
      NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
      NEXT_PUBLIC_APPWRITE_PROJECT: string;
      NEXT_APPWRITE_KEY: string;
    }
  }
}
