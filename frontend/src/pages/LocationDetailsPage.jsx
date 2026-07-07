import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StarRating from '../components/StarRating';
import CostCalculator from '../components/CostCalculator';
import LoginModal from '../components/LoginModal';

// Labels for the six specific rating categories.
const RATING_LABELS = {
  cleanliness: 'Cleanliness',
  communication: 'Communication',
  checkIn: 'Check-in',
  accuracy: 'Accuracy',
  location: 'Location',
  value: 'Value',
};

function LocationDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reserving, setReserving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, text }
  const [showLogin, setShowLogin] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/api/accommodations/${id}`);
        setItem(data.accommodation);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this stay.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Send the reservation to the API (creating a
  const createReservation = async (booking) => {
    setReserving(true);
    setFeedback(null);
    try {
      await api.post('/api/reservations', {
        accommodationId: item._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
      });
      setFeedback({ type: 'success', text: 'Reserved! See it under "My reservations".' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Could not complete the reservation.',
      });
    } finally {
      setReserving(false);
    }
  };

  // If not logged in, open the login modal
  const handleReserve = (booking) => {
    if (!isAuthenticated) {
      setPendingBooking(booking);
      setShowLogin(true);
      return;
    }
    createReservation(booking);
  };

  if (loading) return <Loader label="Loading stay…" />;
  if (error)
    return (
      <div className="details">
        <Message type="error">{error}</Message>
      </div>
    );
  if (!item) return null;

  const gallery = item.images && item.images.length ? item.images : [];

  return (
    <div className="details">
      {/* Heading + subheading */}
      <h1 className="details__title">
        {item.type} in {item.location}
      </h1>
      <div className="details__subhead">
        <StarRating rating={item.rating} reviews={item.reviews} />
        <span className="details__dot">·</span>
        <span className="details__location">{item.location}</span>
      </div>

      {/* Image gallery: one large + up to four smaller (2×2) */}
      <div className="gallery">
        <div className="gallery__main">
          {gallery[0] ? <img src={gallery[0]} alt={item.title} /> : <div className="gallery__ph" />}
        </div>
        <div className="gallery__grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="gallery__cell" key={i}>
              {gallery[i] ? (
                <img src={gallery[i]} alt={`${item.title} ${i}`} />
              ) : (
                <div className="gallery__ph" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: details (left) + cost calculator (right) */}
      <div className="details__columns">
        <div className="details__left">
          <section className="details__section details__host-row">
            <div>
              <h2>
                {item.type} hosted by {item.host?.username || 'your host'}
              </h2>
              <p className="details__meta">
                {item.guests} guests · {item.bedrooms} bedrooms · {item.bathrooms} bathrooms
              </p>
            </div>
            <div className="host-avatar">
              {(item.host?.username || 'H').charAt(0).toUpperCase()}
            </div>
          </section>

          {(item.enhancedCleaning || item.selfCheckIn) && (
            <section className="details__section highlights">
              {item.enhancedCleaning && (
                <div className="highlight">
                  <strong>Enhanced Clean</strong>
                  <span>Committed to a high cleaning standard.</span>
                </div>
              )}
              {item.selfCheckIn && (
                <div className="highlight">
                  <strong>Self check-in</strong>
                  <span>Check yourself in with ease.</span>
                </div>
              )}
            </section>
          )}

          {item.description && (
            <section className="details__section">
              <p className="details__desc">{item.description}</p>
            </section>
          )}

          {/* Where you'll sleep */}
          <section className="details__section">
            <h3>Where you'll sleep</h3>
            <div className="sleep-card">
              <div className="sleep-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 7v10M3 12h18v5M21 12v-2a3 3 0 0 0-3-3H8v5" />
                </svg>
              </div>
              <div>
                <strong>
                  {item.bedrooms} Bedroom{item.bedrooms === 1 ? '' : 's'}
                </strong>
                <p>{item.guests} guests</p>
              </div>
            </div>
          </section>

          {/* What this place offers */}
          <section className="details__section">
            <h3>What this place offers</h3>
            <ul className="amenities-list">
              {(item.amenities && item.amenities.length
                ? item.amenities
                : ['Wifi', 'Kitchen', 'Free parking']
              ).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section className="details__section">
            <h3 className="reviews-head">
              <StarRating rating={item.rating} reviews={item.reviews} showReviews={false} />
              <span> · {item.reviews} reviews</span>
            </h3>
            {item.specificRatings && (
              <div className="ratings-grid">
                {Object.entries(RATING_LABELS).map(([key, label]) => {
                  const val = item.specificRatings[key] || 0;
                  return (
                    <div className="rating-row" key={key}>
                      <span>{label}</span>
                      <span className="rating-row__bar">
                        <span
                          className="rating-row__fill"
                          style={{ width: `${(val / 5) * 100}%` }}
                        />
                      </span>
                      <span className="rating-row__num">{Number(val).toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Host details */}
          <section className="details__section host-block">
            <div className="host-avatar host-avatar--lg">
              {(item.host?.username || 'H').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>Hosted by {item.host?.username || 'your host'}</h3>
              <p className="details__meta">Superhost · Responds within an hour</p>
            </div>
          </section>

          {/* Things to know */}
          <section className="details__section know">
            <div>
              <h4>House rules</h4>
              <p>Check-in after 3:00 pm</p>
              <p>Checkout before 11:00 am</p>
              <p>No smoking · No parties</p>
            </div>
            <div>
              <h4>Health &amp; safety</h4>
              <p>Enhanced cleaning in place</p>
              <p>Carbon monoxide alarm</p>
              <p>Smoke alarm</p>
            </div>
            <div>
              <h4>Cancellation policy</h4>
              <p>Free cancellation for 48 hours.</p>
              <p>Review the full policy before booking.</p>
            </div>
          </section>
        </div>

        {/* Right: cost calculator */}
        <div className="details__right">
          <CostCalculator
            accommodation={item}
            onReserve={handleReserve}
            reserving={reserving}
            feedback={feedback}
          />
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            // After logging in, automatically complete the pending booking.
            if (pendingBooking) {
              createReservation(pendingBooking);
              setPendingBooking(null);
            }
          }}
        />
      )}
    </div>
  );
}

export default LocationDetailsPage;
