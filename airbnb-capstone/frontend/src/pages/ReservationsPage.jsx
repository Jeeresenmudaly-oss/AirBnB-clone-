import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ReservationsPage() {
  const { isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    const fetchReservations = async () => {
      try {
        const { data } = await api.get('/api/reservations/user');
        setReservations(data.reservations);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [isAuthenticated]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/api/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      setNotice('Reservation cancelled.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this reservation.');
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString();

  if (!isAuthenticated) {
    return (
      <div className="reservations">
        <div className="empty">
          <p>Please log in to view your reservations.</p>
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loader label="Loading your reservations…" />;

  return (
    <div className="reservations">
      <h1 className="page-title">My reservations</h1>
      <Message type="error">{error}</Message>
      <Message type="success">{notice}</Message>

      {reservations.length === 0 ? (
        <div className="empty">
          <p>You have no reservations yet.</p>
          <Link to="/location" className="btn btn--primary">
            Explore stays
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.accommodation?.title || '—'}</td>
                  <td>{r.accommodation?.location || '—'}</td>
                  <td>{fmt(r.checkIn)}</td>
                  <td>{fmt(r.checkOut)}</td>
                  <td>{r.guests}</td>
                  <td>${r.total}</td>
                  <td>
                    <button className="btn btn--danger btn--sm" onClick={() => cancel(r._id)}>
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
