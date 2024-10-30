import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import styles from './BuyTicketPage.module.scss';
import { useAuth } from '../../context/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const apiUrl = import.meta.env.VITE_API_URL;

const BuyTicketPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const ticketQuantityRef = useRef(1); 
  const navigate = useNavigate();
  const { isAuthenticated, accessToken, newAccessToken } = useAuth();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      let response = await fetch(`${apiUrl}/api/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        const newToken = await newAccessToken();

        if (!newToken) {
          return navigate('/log-in');
        }

        response = await fetch(`${apiUrl}/events/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error('Error fetching event details');
      }

      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
  
    if (value === "") {
      setTicketQuantity(value); 
      ticketQuantityRef.current = value;
      return;
    }

    const numericValue = Math.max(1, Math.min(Number(value), event.ticketsRemaining));
    setTicketQuantity(numericValue);
    ticketQuantityRef.current = numericValue; 
  };

  const handlePaymentSuccess = async (details) => {
    console.log('Tickets purchased:', ticketQuantityRef.current);

    try {
      const response = await fetch(`${apiUrl}/api/payments/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          orderId: details.id,
          eventId: event._id,
          ticketQuantity: ticketQuantityRef.current, 
        }),
      });

      if (!response.ok) {
        throw new Error('Error storing payment details');
      }

      const ticketData = await response.json();
      navigate('/account/tickets');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.buyTicketPage}>
      <h2>Buy Tickets for </h2>
      <h3>{event.eventName}</h3>
      <p>Date: <span>{formatDate(event.eventDate)}</span></p>
      <p>Location: <span>{event.eventLocation}</span></p>
      <p>Time: <span>{event.eventTime}</span></p>
      <p>Price per Ticket: <span>${event.price}</span></p>
      <p>Capacity Available: <span>{event.ticketsRemaining}</span></p>

      <div className={styles.quantity}>
        <label>Number of Tickets:</label>
        <input
          type="number"
          value={ticketQuantity}
          min="1"
          max={event.ticketsRemaining}
          onChange={handleQuantityChange}
        />
      </div>

      <p>Total Price: ${(event.price * ticketQuantity).toFixed(2)}</p>

      {!isAuthenticated && (
        <button onClick={() => navigate('/log-in')} className={styles.purchaseButton}>
          Log in to Buy Tickets
        </button>
      )}

{isAuthenticated && (
        <PayPalScriptProvider options={{ 'client-id': 'Aew0OjALrUSU_rOxUQlgz2u1d-WOvFK1_r6f4yUkH0KFZaUkDmkoMTGgPxcC-RnYJOBSxwq1lgZHwZZb', currency: 'USD' }}>
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={async (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: (event.price * ticketQuantityRef.current).toFixed(2),
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              handlePaymentSuccess(details);
            }}
            onError={(err) => {
              console.error('Payment error:', err);
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default BuyTicketPage;
