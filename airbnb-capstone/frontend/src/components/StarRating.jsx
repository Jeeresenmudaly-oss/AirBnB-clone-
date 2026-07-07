// StarRating — shows a filled star, the numeric
function StarRating({ rating = 0, reviews, size = 14, showReviews = true }) {
  return (
    <span className="star-rating" style={{ fontSize: size }}>
      <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 12.2 3.7 14.6l.8-4.8L1 6.4l4.8-.7L8 1.3l2.2 4.4 4.8.7-3.5 3.4.8 4.8z"
        />
      </svg>
      <span className="star-rating__value">{Number(rating).toFixed(1)}</span>
      {showReviews && reviews != null && (
        <span className="star-rating__reviews"> · {reviews} reviews</span>
      )}
    </span>
  );
}

export default StarRating;
