/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv & {
      readonly PROD: boolean; // ✅ Add this
      readonly DEV: boolean;
      readonly MODE: string;
    };
  }
  