'use strict'

import connectSupaBaseClient from "./supabase-client.js";

const supabaseClient = connectSupaBaseClient()

export class Auth {
    async getUser() {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
            throw error;
        }
        return data;
    }

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return data;
    }

    async signUp(email, password) {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return data;
    }
}


class NoteDb extends Auth{
    async addNote(noteContent) {
        const {data, error} = await supabaseClient
            .from("notes")
            .insert({note_content: noteContent})
            .select();
        if (error) {
            throw error;
        }
        return data;
    }
    async updateNote(noteContent){

    }

    async getNote() {
        const {
            data,
            error
        } = await supabaseClient.from("notes").select();
        if (error) {
            throw error;
        }
        return data;
    }
    async deleteNote(){

    }


}

export const authApi = new Auth();
export const noteApi = new NoteDb();


