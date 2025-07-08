interface ImportMetaEnv {
  readonly BASE_URL: string;
  // add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
