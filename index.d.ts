declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    environment: string;
    commitHash: string;
    buildTime: string;
    cognitoAppClientId: string;
    cognitoUrl: string;
    cognitoUserPoolUrl: string;
    eiamLogoutUrl: string;
    eiamIdentityProvider: string;
    serviceControlBase: string;
    defaultM2MScope: string;
    superuserGroup: string;
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {};
