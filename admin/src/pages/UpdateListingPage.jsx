import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ListingForm from '../components/ListingForm';
import Loader from '../components/Loader';
import Message from '../components/Message';

function UpdateListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the existing listing so the form can
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/api/accommodations/${id}`);
        setListing(data.accommodation);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this listing.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleUpdate = async (payload) => {
    await api.put(`/api/accommodations/${id}`, payload);
    navigate('/listings');
  };

  if (loading) return <Loader label="Loading listing…" />;
  if (error)
    return (
      <div className="page page--narrow">
        <Message type="error">{error}</Message>
      </div>
    );

  return (
    <div className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">Edit listing</h1>
      </div>
      <ListingForm initialValues={listing} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}

export default UpdateListingPage;
