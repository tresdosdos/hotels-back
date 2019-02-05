export enum Env {
  DEV = 'dev',
  PROD = 'prod',
  DEFAULT = 'dev',
}

export function getEnv(): string {
  return process.env.NODE_ENV || Env.DEFAULT;
}
