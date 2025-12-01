import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import './NotificationsTable.css';

function NotificationsTable({ theme }) {
    const [notifications, setNotifications] = useState([]); // receipts
    const [loading, setLoading] = useState(true);
    const [expandedReceiptId, setExpandedReceiptId] = useState(null);
    const [receiptItems, setReceiptItems] = useState({});
    const [profilesMap, setProfilesMap] = useState({});
    const [updatingIds, setUpdatingIds] = useState({});

    // Actualiza el estado del recibo (PENDIENTE <-> ENVIADO)
    const updateReceiptStatus = async (receiptId, newStatus) => {
        try {
            setUpdatingIds((p) => ({ ...p, [receiptId]: true }));
            const { data, error } = await supabase
                .from('receipts')
                .update({ status: newStatus })
                .eq('id', receiptId);

            if (error) {
                console.error('Error updating receipt status:', error);
                alert('No se pudo actualizar el estado del comprobante.');
                return;
            }

            setNotifications((prev) => prev.map((r) => r.id === receiptId ? { ...r, status: newStatus } : r));
        } catch (err) {
            console.error('Error updating receipt status:', err);
            alert('Ocurrió un error al actualizar el estado.');
        } finally {
            setUpdatingIds((p) => {
                const copy = { ...p };
                delete copy[receiptId];
                return copy;
            });
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        // Usar la tabla `receipts` como fuente principal
        const { data: receiptsData, error: receiptsError } = await supabase
            .from('receipts')
            .select('*')
            .order('created_at', { ascending: false });

        if (receiptsError) {
            console.error('Error fetching receipts:', receiptsError);
            setNotifications([]);
            setLoading(false);
            return;
        }

        const receipts = receiptsData || [];

        // Determinar user ids buscando campos comunes en receipts
        const extractUserId = (r) => r.user_id || r.profile_id || r.customer_id || r.buyer_id || null;
        const userIds = [...new Set(receipts.map(extractUserId).filter(Boolean))];

        // Traer perfiles (profiles) de los user ids encontrados
        let profiles = [];
        if (userIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .in('id', userIds);
            if (profilesError) console.warn('Error fetching profiles:', profilesError);
            profiles = profilesData || [];
        }

        const profilesById = profiles.reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
        }, {});

          // 4. Traer correos desde auth.users
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

        if (usersError) {
            console.warn("Error fetching auth users:", usersError);
        }

            const usersById = {};
        if (usersData?.users) {
            usersData.users.forEach((u) => {
                usersById[u.id] = u;
            });
         }

        
            // 5. Unir receipts + profiles + auth.users
            const receiptsWithFullData = receipts.map((receipt) => {
                const profile = profilesById[receipt.user_id] || null;
                const authUser = usersById[receipt.user_id] || null;

                return {
                    ...receipt,
                    profile,
                    authEmail: authUser?.email || null,
                };
            });

            setNotifications(receiptsWithFullData);
            setLoading(false);
        };

    const fetchReceiptItems = async (receiptId) => {
        if (receiptItems[receiptId]) return;

        // Primero: intentar leer items desde el campo JSONB `items_details` de la propia fila `receipts`
        const receiptRow = notifications.find((r) => r.id === receiptId);
        const itemsFromJson = receiptRow?.items_details || receiptRow?.items || receiptRow?.itemsDetails || null;
        if (itemsFromJson && Array.isArray(itemsFromJson)) {
            setReceiptItems((prev) => ({
                ...prev,
                [receiptId]: itemsFromJson
            }));
            return;
        }

        // Si no hay JSON en la fila, probar nombres comunes de tablas/columnas para items de recibos
        const candidates = [
            { table: 'receipt_items', fk: 'receipt_id' },
            { table: 'receipts_item', fk: 'receipt_id' },
            { table: 'receipts_items', fk: 'receipt_id' },
            { table: 'receipt_item', fk: 'receipt_id' },
            { table: 'receipt_items', fk: 'receiptId' },
        ];

        for (const c of candidates) {
            try {
                const { data, error } = await supabase.from(c.table).select('*').eq(c.fk, receiptId);
                if (!error && data) {
                    setReceiptItems((prev) => ({
                        ...prev,
                        [receiptId]: data || []
                    }));
                    return;
                }
            } catch (err) {
                // ignore and try next
            }
        }

        // Si no se encontró nada, dejar vacío para evitar reintentos innecesarios
        setReceiptItems((prev) => ({
            ...prev,
            [receiptId]: []
        }));
    };

    const toggleExpand = (receiptId) => {
        if (expandedReceiptId === receiptId) {
            setExpandedReceiptId(null);
        } else {
            setExpandedReceiptId(receiptId);
            fetchReceiptItems(receiptId);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const subscription = supabase
            .channel('receipts_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'receipts' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className={`notifications-container ${theme}`}><p>Cargando notificaciones...</p></div>;
    }

    return (
        <div className={`notifications-container ${theme}`}>
            <h2>Notificaciones de Compras</h2>
            <div className="table-wrapper">
                <table className="notifications-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Información</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length > 0 ? (
                            notifications.map((receipt) => (
                                <React.Fragment key={receipt.id}>
                                    <tr>
                                        <td>{receipt.id}</td>
                                        <td>{receipt.profile?.username || '--'}</td>
                                        <td>{receipt.profile?.email || '—'}</td>
                                        <td>{receipt.profile?.number || '—'}</td>
                                        <td>{receipt.profile?.address || '—'}</td>
                                        <td>
                                            <div className={`status-control ${updatingIds[receipt.id] ? 'updating' : ''}`}>
                                                <select
                                                    value={receipt.status || 'PENDIENTE'}
                                                    onChange={(e) => updateReceiptStatus(receipt.id, e.target.value)}
                                                    disabled={!!updatingIds[receipt.id]}
                                                >
                                                    <option value="PENDIENTE">PENDIENTE</option>
                                                    <option value="ENVIADO">ENVIADO</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td>${parseFloat(receipt.total_amount || receipt.total || receipt.amount || 0).toFixed(2)}</td>
                                        <td>
                                            <button 
                                                className="btn-details"
                                                onClick={() => toggleExpand(receipt.id)}
                                            >
                                                {expandedReceiptId === receipt.id ? '▼ Ocultar' : '▶ Detalles'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedReceiptId === receipt.id && (
                                        <tr className="details-row">
                                            <td colSpan="8">
                                                <div className="order-details">
                                                    <h4>Productos del Comprobante</h4>
                                                    {receiptItems[receipt.id] && receiptItems[receipt.id].length > 0 ? (
                                                        <table className="items-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Producto</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Precio Unitario</th>
                                                                    <th>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {receiptItems[receipt.id].map((item) => (
                                                                    <tr key={item.id}>
                                                                        <td>{item.product_name || item.name || item.title}</td>
                                                                        <td>{item.quantity || item.qty || 1}</td>
                                                                        <td>${parseFloat(item.price || item.unit_price || 0).toFixed(2)}</td>
                                                                        <td>${((item.quantity || item.qty || 1) * parseFloat(item.price || item.unit_price || 0)).toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="no-items">No hay productos en este comprobante</p>
                                                    )}

                                                    <h4>Perfil del Cliente</h4>
                                                    {receipt.profile ? (
                                                        <div className="profile-info">
                                                            <p><strong>Usuario:</strong> {receipt.profile.username || '—'}</p>
                                                            <p><strong>Correo:</strong> {receipt.profile?.email || '—'}</p>
                                                            <p><strong>Teléfono:</strong> {receipt.profile.number || '—'}</p>
                                                            <p><strong>Dirección:</strong> {receipt.profile.address || '—'}</p>
                                                        </div>
                                                    ) : (
                                                        <p>No hay perfil asociado a este comprobante</p>
                                                    )}

                                                    <h4>Archivo Comprobante</h4>
                                                    { (receipt.url || receipt.file_url || receipt.receipt_url || receipt.path) ? (
                                                        <p><a href={receipt.url || receipt.file_url || receipt.receipt_url || receipt.path} target="_blank" rel="noreferrer">Abrir comprobante</a></p>
                                                    ) : (
                                                        <p>No hay fichero de comprobante asociado</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="empty-message">No hay comprobantes registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NotificationsTable;
