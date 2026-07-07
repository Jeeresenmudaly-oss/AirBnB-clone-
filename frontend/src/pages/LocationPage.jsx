import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StarRating from '../components/StarRating';

function LocationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = searchParams.get('location') || '';

  const [filter, setFilter] = useState(location);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch accommodations whenever the location query changes.
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const url = location
          ? `/api/accommodations?location=${encodeURIComponent(location)}`
          : '/api/accommodations';
        const { data } = await api.get(url);
        setListings(data.accommodations);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load stays.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [location]);

  const applyFilter = (e) => {
    e.preventDefault();
    const q = filter.trim();
    setSearchParams(q ? { location: q } : {});
  };

  const heading = location
    ? `${listings.length} stay${listings.length === 1 ? '' : 's'} in ${location}`
    : `${listings.length} stay${listings.length === 1 ? '' : 's'} available`;

  return (
    <div className="location-page">
      {/* Location filter */}
      <form className="location-filter" onSubmit={applyFilter}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
          placeholder="Filter by location (e.g. New York)"
        />
        <button type="submit" className="btn btn--primary">
          Search
        </button>
      </form>

      {loading ? (
        <Loader label="Finding stays…" />
      ) : (
        <>
          <h1 className="location-page__heading">{heading}</h1>
          <Message type="error">{error}</Message>

          {listings.length === 0 ? (
            <div className="empty">
              <p>No stays found{location ? ` in ${location}` : ''}.</p>
              <button className="btn btn--outline" onClick={() => navigate('/')}>
                Back to home
              </button>
            </div>
          ) : (
            <div className="location-list">
              {listings.map((l) => (
                <Link className="loc-card" to={`/rooms/${l._id}`} key={l._id}>
                  <div className="loc-card__image">
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt={l.title} />
                    ) : (
                      <div className="loc-card__placeholder">No image</div>
                    )}
                  </div>
                  <div className="loc-card__body">
                    <div className="loc-card__top">
                      <p className="loc-card__type">
                        {l.type} in {l.location}
                      </p>
                      <h3 className="loc-card__title">{l.title}</h3>
                      <p className="loc-card__amenities">
                        {(l.amenities || []).slice(0, 4).join(' · ') || 'Great amenities'}
                      </p>
                    </div>
                    <div className="loc-card__bottom">
                      <StarRating rating={l.rating} reviews={l.reviews} />
                      <p className="loc-card__price">
                        <strong>${l.price}</strong> <span>night</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LocationPage;
