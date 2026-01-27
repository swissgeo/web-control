declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    commitHash: string;
    buildTime: string;
    endUserClientId: string;
    m2mUserClientId: string;
    federated_login_url: string;
    cognitoDomain: string;
    cognitoCfProxyDomain: string;
    cognitoUserPoolUrl: string;
    eiamLogoutUrl: string;
    eiamIdentityProvider: string;
    serviceControlBase: string;
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {};
