import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/dms/api/items.php')
      .then(res => {
        if (res.data.success) {
          setItems(res.data.items);
        } else {
          setError(res.data.message || 'Failed to load items');
        }
      })
      .catch(err => {
        console.error('Failed to fetch items:', err);
        setError('Failed to connect to the server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Donation Received</h1>
      <p>This is the Items page where you can view and manage donation items.</p>
      <ul>
        {items.length > 0 ? (
          items.map(item => (
            <li key={item.item_id}>
                <strong> {item.item_name} </strong>
                <p> {item.item_description} </p>
                <p> Category: {item.item_category} </p>
                <p> Condition: {item.item_condition} </p>
                <p> Quantity: {item.item_quantity} </p>
            </li>
          ))
        ) : (
          <li>No items found.</li>
        )}
      </ul>
    </div>
  );
}
