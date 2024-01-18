'use strict';

import connectSupaBaseClient from "./supabase-client.js";

const supabaseClient = connectSupaBaseClient();

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


class NoteDb {
    async addNote(noteContent, creationDate, creationTime) {
        const { data, error } = await supabaseClient
            .from("notes")
            .insert({
                note_content: noteContent,
                created_at: creationDate,
                updated_at: creationDate,
                n_time: creationTime,
            })
            .select();
        if (error) {
            throw error;
        }
        return data;
    }
    async updateNote(noteId, noteContent, updateDate, updateTime) {
        const { data, error } = await supabaseClient
            .from('notes')
            .update({
                note_content: noteContent,
                updated_at: updateDate,
                n_time: updateTime,
            })
            .eq('id', noteId)
            .select();
        if (error) {
            throw error;
        }
        return data;
    }
    async deleteNote(noteId) {
        const { error,status,statusText } = await supabaseClient
            .from('notes')
            .delete()
            .eq('id', noteId);
        if(error){
            throw error;
        }
        return status;
        
    }
    async searchAndGet(selectType, searchedValue, from, to) {
        if (selectType === "note_content") {
            const { error, data, count } = await supabaseClient
                .from('notes')
                .select('*', { count: 'exact' })
                .ilike(selectType, `%${searchedValue}%`)
                .range(from, to);
            if (error) {
                throw error;
            }
            return { data, count };
        } else {
            const { error, data, count } = await supabaseClient
                .from('notes')
                .select("*", { count: 'exact' })
                .eq(selectType, searchedValue)
                .range(from, to);
            if (error) {
                throw error;
            }
            return { data, count };
        }
    }

    async sortNote(selectDataType, isAscending) {
        const { data, error } = await supabaseClient
            .from('notes')
            .select('*')
            .order(selectDataType, isAscending);
        if (error) {
            throw error;
        }
        return data;
    }
}

export const authApi = new Auth();
export const noteApi = new NoteDb();
export async function checkUserAuthentication() {
    try {
        const { session } = await authApi.getUser();
        return session;
    } catch (error) {
        throw error;
    }
}


