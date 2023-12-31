import connectSupaBaseClient from "./supabase-client.js";

class NoteDb {
    constructor() {
        this.supabaseClient = connectSupaBaseClient();
    }
    async addNote(noteContent) {
        const {data, error} = await this.supabaseClient
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
        } = await this.supabaseClient.from("notes").select();
        if (error) {
            throw error;
        }
        return data;
    }
    async deleteNote(){

    }


}

const noteApi = new NoteDb();
export default noteApi;