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


class NoteDb{
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
    async updateNote(noteId,noteContent){

    }
    async deleteNote(){

    }

    async searchAndGet(searchedValue,form,to){
        const {error, data, count } = await supabaseClient
            .from('notes')
            .select('*', { count: 'exact' })
            .ilike('note_content', `%${searchedValue}%`)
            .range(form,to);
        if(error){
            throw error
        }
        return {data,count};
    }
}

export const authApi = new Auth();
export const noteApi = new NoteDb();
export async function checkUserAuthentication(){
    try{
        const {session} = await authApi.getUser()
        return session
    }catch(error){
        throw error
    }
}


