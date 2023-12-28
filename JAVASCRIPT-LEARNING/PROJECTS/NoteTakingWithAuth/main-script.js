import env from "./secret.js";

async function getData(supabaseObj) {
    // const { data, error } = await supabaseObj.auth.signUp({
    //     email: 'example2@email.com',
    //     password: 'example1-password',
    //   })
      const { data, error } = await supabaseObj.auth.getSession()
      return data
}

export function connectToClient() {
    const supabaseObj = supabase.createClient(env.CLIENT_URL, env.ANON_KEY);
    // getData(supabaseObj).then(data => {
    //     console.log(data);
    // });
    
}

