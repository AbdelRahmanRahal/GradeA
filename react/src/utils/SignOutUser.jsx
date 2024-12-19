import { supabase } from '../supabase.js';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { clearCache } from './CacheWorkings.jsx';
import 'react-toastify/dist/ReactToastify.css';

export async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast.error("Error signing out: " + error.message);
    } else {
        clearCache();
        toast.info("User signed out successfully");
    }
}

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOutUser();
        navigate("/login");
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default LogoutButton;