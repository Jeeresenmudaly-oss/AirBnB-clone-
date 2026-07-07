import { useState, useMemo } from 'react';
import StarRating from './StarRating';

// Number of nights between two ISO date strings
function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  const nights = Math.round(ms / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

// CostCalculator — the sticky booking card on the
function CostCalculator({ accommodation, onReserve, reserving, feedback }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  // Recompute the price breakdown whenever inputs change.
  const breakdown = useMemo(() => {
    const nights = nightsBetween(checkIn, checkOut);
    const subtotal = accommodation.price * nights;
    const discount = nights >= 7 ? (subtotal * (accommodation.weeklyDiscount || 0)) / 100 : 0;
    const total =
      subtotal -
      discount +
      (nights > 0
        ? accommodation.cleaningFee + accommodation.serviceFee + accommodation.occupancyTaxes
        : 0);
    return { nights, subtotal, discount, total };
  }, [checkIn, checkOut, accommodation]);

  const canReserve = breakdown.nights > 0 && guests > 0;

  const handleReserve = () => {
    if (!canReserve) return;
    onReserve({ checkIn, checkOut, guests: Number(guests) });
  };

  return (
    <aside className="calc">
      <div className="calc__head">
        <span className="calc__price">
          <strong>${accommodation.price}</strong> night
        </span>
        <StarRating rating={accommodation.rating} reviews={accommodation.reviews} size={13} />
      </div>

      <div className="calc__dates">
        <label className="calc__field">
          <span>Check-in</span>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </label>
        <label className="calc__field">
          <span>Check-out</span>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>
      </div>

      <label className="calc__field calc__guests">
        <span>Guests</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          {Array.from({ length: accommodation.guests || 1 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </label>

      <button
        className="btn btn--primary btn--full calc__reserve"
        onClick={handleReserve}
        disabled={!canReserve || reserving}
      >
        {reserving ? 'Reserving…' : canReserve ? 'Reserve' : 'Select dates'}
      </button>

      {breakdown.nights > 0 && (
        <div className="calc__breakdown">
          <div className="calc__row">
            <span>
              ${accommodation.price} × {breakdown.nights} night
              {breakdown.nights > 1 ? 's' : ''}
            </span>
            <span>${breakdown.subtotal}</span>
          </div>
          {breakdown.discount > 0 && (
            <div className="calc__row calc__row--discount">
              <span>Weekly discount</span>
              <span>−${breakdown.discount.toFixed(0)}</span>
            </div>
          )}
          <div className="calc__row">
            <span>Cleaning fee</span>
            <span>${accommodation.cleaningFee}</span>
          </div>
          <div className="calc__row">
            <span>Service fee</span>
            <span>${accommodation.serviceFee}</span>
          </div>
          <div className="calc__row">
            <span>Occupancy taxes &amp; fees</span>
            <span>${accommodation.occupancyTaxes}</span>
          </div>
          <div className="calc__row calc__row--total">
            <span>Total</span>
            <span>${breakdown.total.toFixed(0)}</span>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`calc__feedback calc__feedback--${feedback.type}`}>{feedback.text}</div>
      )}
    </aside>
  );
}

export default CostCalculator;
