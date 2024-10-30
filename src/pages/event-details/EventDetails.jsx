import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './EventDetails.module.scss';
import { useAuth } from '../../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  };

  useEffect(() => {
    fetchEventById();
  }, []);

  const fetchEventById = async () => {
    try {
      let response = await fetch(`${apiUrl}/api/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching event details');
      }

      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      navigate('/log-in');
    } else {
      navigate(`/event/${id}/buy`);
    }
  };

  const formatCapacity = (totalCapacity, ticketsRemaining, ticketsSold) => {
    if (ticketsSold > 0) {
      return `${ticketsRemaining} / ${totalCapacity}`;
    }
    
    return `${totalCapacity}`;
  };

  return (
    <div className={styles.eventDetails}>

      <h2>{event.eventName}</h2>
      <img src={`${apiUrl}/${event.image}`} alt={event.eventName} />
      <p>Date: <span>{formatDate(event.eventDate)}</span></p>
      <p>Time: <span>{event.eventTime}</span></p>
      <p>Location: <span>{event.eventLocation}</span></p>
      <p>Price: <span>${event.price}</span></p>
      <p>Total Capacity: <span>{formatCapacity(event.totalCapacity, event.ticketsRemaining, event.ticketsSold)}</span></p>
      <p>Comments: <span>{event.comments}</span></p>
      <button onClick={handleBuyTicket}>Buy Ticket</button>
    </div>
  );
};

export default EventDetails;
