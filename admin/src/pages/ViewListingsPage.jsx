import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ViewListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/accommodations');
      setListings(data.accommodations);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/accommodations/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      setNotice(`"${title}" was deleted.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this listing.');
    }
  };

  if (loading) return <Loader label="Loading listings…" />;

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Your listings</h1>
          <p className="page__subtitle">
            {listings.length} propert{listings.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
        <Link to="/listings/create" className="btn btn--primary">
          + Add listing
        </Link>
      </div>

      <Message type="error">{error}</Message>
      <Message type="success">{notice}</Message>

      {listings.length === 0 ? (
        <div className="empty">
          <p>You don't have any listings yet.</p>
          <Link to="/listings/create" className="btn btn--primary">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map((listing) => (
            <article className="listing-card" key={listing._id}>
              <div className="listing-card__image">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} />
                ) : (
                  <div className="listing-card__placeholder">No image</div>
                )}
              </div>
              <div className="listing-card__body">
                <h3 className="listing-card__title">{listing.title}</h3>
                <p className="listing-card__location">{listing.location}</p>
                <p className="listing-card__price">
                  <strong>${listing.price}</strong> / night
                </p>
                <div className="listing-card__actions">
                  <Link to={`/listings/${listing._id}/edit`} className="btn btn--outline btn--sm">
                    Edit
                  </Link>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(listing._id, listing.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewListingsPage;
