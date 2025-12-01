import BaseLayout from "../../components/layout";
import "./Profile.css";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const response = await api.get(`/profile/${user.id}`);
                setProfile(response.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("No se pudo cargar la información del perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <BaseLayout>
                <div className="profile-loading">
                    <div className="spinner"></div>
                    <p>Cargando perfil...</p>
                </div>
            </BaseLayout>
        );
    }

    if (error) {
        return (
            <BaseLayout>
                <div className="profile-error">
                    <p>{error}</p>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h1>{profile?.username || 'Usuario'}</h1>
                        <span className="profile-role">{profile?.role || 'User'}</span>
                    </div>

                    <div className="profile-details">

                        <div className="detail-item">
                            <span className="detail-label">Miembro desde</span>
                            <span className="detail-value">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{user?.email}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Dirección</span>
                            <span className="detail-value">{profile?.address || "Sin dirección"}  </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Número</span>
                            <span className="detail-value">{profile?.number || "Sin número"}  </span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Profile;