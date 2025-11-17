import {Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from "../services/supabaseClient";

const AdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null); // Estado para verificar si es admin

    useEffect(() => {
        const checkRole = async () => {
            const {data: { user }} = await supabase.auth.getUser();
            if (!user) {
                setIsAdmin(false);
                return;
            }

            const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

            setIsAdmin(profile?.role === 'admin');
        }

        checkRole();
    }, []);

    if (isAdmin === null) 
        return <p>Cargando...</p>; // O un spinner de carga
    if (!isAdmin) return <Navigate to="/" />;

    return children;
    
}

export default AdminRoute;