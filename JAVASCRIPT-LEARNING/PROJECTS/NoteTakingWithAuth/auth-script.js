import connectSupaBaseClient from "./supabase-client.js";

class Auth {
    constructor() {
        this.supabaseClient = connectSupaBaseClient()
    }

    async getUser() {
        const { data, error } = await this.supabaseClient.auth.getSession();
        if (error) {
            throw error;
        }
        return data;
    }

    async signIn(email, password) {
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return data;
    }

    async signUp(email, password) {
        const { data, error } = await this.supabaseClient.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return data;
    }
}


const authApi = new Auth();
export default authApi;

