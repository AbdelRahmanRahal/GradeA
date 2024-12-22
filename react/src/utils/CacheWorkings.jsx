import { supabase } from '../supabase.js';
import 'react-toastify/dist/ReactToastify.css';

export async function createCache() {

        const {data: {user}} = await supabase.auth.getUser();
        if (user) {
            console.log("User is:" + user);}
        // Fetch the user's role from the profiles table
        const {data: profile, error: profileError} = await supabase
            .from("profiles")
            .select("first_name, role")
            .eq("id", user.id)
            .single();
        localStorage.setItem('cachedFirstName', profile.first_name);
        localStorage.setItem('cachedRole', profile.role);
}

export function clearCache() {
    localStorage.clear();
    console.log("Cache has been cleared for some reason!!!!")
}

export const fetchFirstName = async () => {

    if (!localStorage.getItem('cachedFirstName')) {
        await createCache();
        console.log("It had to create cache!!!")
    }
    else {console.log("It did not have to create cache!")}
        return localStorage.getItem('cachedFirstName');
};

export const fetchRole = async () => {

    if (!localStorage.getItem('cachedRole')) {
        await createCache();
        console.log("It had to create cache!!!")
    }
    else {console.log("It did not have to create cache!")}
    return localStorage.getItem('cachedRole');
};