import env from "./secret.js";

export default function connectSupaBaseClient (){
    return supabase.createClient(env.CLIENT_URL, env.ANON_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: true,
            detectSessionInUrl: false,
            storageKey: "auth-token"
        }
    });
}