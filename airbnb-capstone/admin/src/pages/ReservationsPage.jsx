import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Hosts/admins see bookings on their listings; regular users
  const isHostOrAdmin = user?.role === 'host' || user?.role === 'admin';
  const endpoint = isHostOrAdmin ? '/api/reservations/host' : '/api/reservations/user';

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(endpoint);
      setReservations(data.reservations);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/api/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      setNotice('Reservation cancelled.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this reservation.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();

  if (loading) return <Loader label="Loading reservations…" />;

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Reservations</h1>
          <p className="page__subtitle">
            {isHostOrAdmin ? 'Bookings on your listings' : 'Trips you have booked'}
          </p>
        </div>
      </div>

      <Message type="error">{error}</Message>
      <Message type="success">{notice}</Message>

      {reservations.length === 0 ? (
        <div className="empty">
          <p>No reservations yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>{isHostOrAdmin ? 'Guest' : 'Host'}</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Nights</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.accommodation?.title || '—'}</td>
                  <td>{isHostOrAdmin ? r.user?.username || '—' : r.host?.username || '—'}</td>
                  <td>{formatDate(r.checkIn)}</td>
                  <td>{formatDate(r.checkOut)}</td>
                  <td>{r.guests}</td>
                  <td>{r.nights}</td>
                  <td>${r.total}</td>
                  <td>
                    <button className="btn btn--danger btn--sm" onClick={() => handleCancel(r._id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReservationsPage;
