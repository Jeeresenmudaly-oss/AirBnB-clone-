import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ListingForm from '../components/ListingForm';

function CreateListingPage() {
  const navigate = useNavigate();

  // Called by ListingForm with the validated payload.
  const handleCreate = async (payload) => {
    await api.post('/api/accommodations', payload);
    navigate('/listings');
  };

  return (
    <div className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">Add a new listing</h1>
      </div>
      <ListingForm onSubmit={handleCreate} submitLabel="Create listing" />
    </div>
  );
}

export default CreateListingPage;
