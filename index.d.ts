declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    commit_hash: string;
    build_time: string;
    end_user_client_id: string;
    m2m_user_client_id: string;
    federated_login_url: string;
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {};
