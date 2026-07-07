import { useState } from 'react';
import api from '../api/axios';
import Message from './Message';

// The empty shape of a listing, used when
const EMPTY = {
  title: '',
  location: '',
  type: '',
  description: '',
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  price: '',
  amenities: '', // kept as a comma-separated string in the form
  images: [],
  weeklyDiscount: 0,
  cleaningFee: 0,
  serviceFee: 0,
  occupancyTaxes: 0,
  enhancedCleaning: false,
  selfCheckIn: false,
};

// ListingForm — used by both the Create and
function ListingForm({ initialValues, onSubmit, submitLabel = 'Save listing' }) {
  // Turn an incoming listing (with amenities as an
  const buildInitial = () => {
    if (!initialValues) return EMPTY;
    return {
      ...EMPTY,
      ...initialValues,
      amenities: Array.isArray(initialValues.amenities)
        ? initialValues.amenities.join(', ')
        : initialValues.amenities || '',
    };
  };

  const [form, setForm] = useState(buildInitial);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Generic change handler for text / number /
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ---- Image helpers --------------------------------------------------------

  const addImageByUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrl('');
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Upload selected files to the backend, which returns
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError('');
    try {
      const data = new FormData();
      files.forEach((file) => data.append('images', file));
      const res = await api.post('/api/accommodations/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, images: [...prev.images, ...res.data.images] }));
    } catch (err) {
      setUploadError(
        err.response?.data?.message ||
          'Image upload failed. You can also paste an image URL instead.',
      );
    } finally {
      setUploading(false);
      e.target.value = ''; // reset the file input
    }
  };

  // ---- Validation -----------------------------------------------------------

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.type.trim()) next.type = 'Property type is required';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (Number(form.guests) < 1) next.guests = 'At least 1 guest';
    if (Number(form.bedrooms) < 0) next.bedrooms = 'Cannot be negative';
    if (Number(form.bathrooms) < 0) next.bathrooms = 'Cannot be negative';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ---- Submit ---------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    // Convert the form into the payload the API
    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      type: form.type.trim(),
      description: form.description.trim(),
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      price: Number(form.price),
      weeklyDiscount: Number(form.weeklyDiscount),
      cleaningFee: Number(form.cleaningFee),
      serviceFee: Number(form.serviceFee),
      occupancyTaxes: Number(form.occupancyTaxes),
      enhancedCleaning: form.enhancedCleaning,
      selfCheckIn: form.selfCheckIn,
      images: form.images,
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Could not save the listing. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Small helper to render a labelled field with
  const field = (name, label, extra = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={errors[name] ? 'input input--error' : 'input'}
        {...extra}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      <Message type="error">{submitError}</Message>

      <div className="form-section">
        <h3 className="form-section__title">Basics</h3>
        {field('title', 'Title', { placeholder: 'Modern Apartment in New York' })}
        <div className="form-row">
          {field('location', 'Location', { placeholder: 'New York' })}
          {field('type', 'Property type', { placeholder: 'Entire apartment' })}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="input"
            placeholder="Tell guests what makes your place special…"
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Capacity</h3>
        <div className="form-row form-row--3">
          {field('guests', 'Guests', { type: 'number', min: 1 })}
          {field('bedrooms', 'Bedrooms', { type: 'number', min: 0 })}
          {field('bathrooms', 'Bathrooms', { type: 'number', min: 0 })}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Amenities</h3>
        <div className="form-group">
          <label htmlFor="amenities">Amenities (comma separated)</label>
          <input
            id="amenities"
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            className="input"
            placeholder="wifi, kitchen, free parking"
          />
        </div>
        <div className="form-row">
          <label className="checkbox">
            <input
              type="checkbox"
              name="enhancedCleaning"
              checked={form.enhancedCleaning}
              onChange={handleChange}
            />
            Enhanced cleaning
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              name="selfCheckIn"
              checked={form.selfCheckIn}
              onChange={handleChange}
            />
            Self check-in
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Pricing (per night)</h3>
        <div className="form-row form-row--3">
          {field('price', 'Price', { type: 'number', min: 0 })}
          {field('weeklyDiscount', 'Weekly discount (%)', { type: 'number', min: 0 })}
          {field('cleaningFee', 'Cleaning fee', { type: 'number', min: 0 })}
        </div>
        <div className="form-row">
          {field('serviceFee', 'Service fee', { type: 'number', min: 0 })}
          {field('occupancyTaxes', 'Occupancy taxes', { type: 'number', min: 0 })}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Images</h3>

        <div className="upload-row">
          <label className="btn btn--outline upload-btn">
            {uploading ? 'Uploading…' : 'Upload images'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              hidden
              disabled={uploading}
            />
          </label>
          <span className="upload-hint">or paste an image URL:</span>
        </div>

        <div className="form-row url-row">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input"
            placeholder="https://…"
          />
          <button type="button" className="btn btn--outline" onClick={addImageByUrl}>
            Add URL
          </button>
        </div>

        <Message type="error">{uploadError}</Message>

        {form.images.length > 0 && (
          <div className="thumbs">
            {form.images.map((src, i) => (
              <div className="thumb" key={`${src}-${i}`}>
                <img src={src} alt={`Listing ${i + 1}`} />
                <button
                  type="button"
                  className="thumb__remove"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

export default ListingForm;
