import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Message from './Message';

// LoginModal — a small dialog for logging in
function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!email) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2 className="modal__title">Log in</h2>
        </div>

        <div className="modal__body">
          <h3 className="modal__welcome">Welcome to Airbnb</h3>
          <Message type="error">{apiError}</Message>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input input--error' : 'input'}
                placeholder="Email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input input--error' : 'input'}
                placeholder="Password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Logging in…' : 'Continue'}
            </button>
          </form>

          <p className="modal__hint">
            Try the seeded guest account:
            <br />
            <strong>john@airbnb.com</strong> / <strong>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
