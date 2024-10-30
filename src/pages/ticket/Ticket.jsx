import { useState, useEffect } from 'react';
import styles from './Ticket.module.scss';
import { useAuth } from '../../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const { accessToken, newAccessToken } = useAuth();

  useEffect(() => {
    if(accessToken){
      fetchTicketDetails();
    }
  }, [accessToken]);

  const fetchTicketDetails = async () => {
    try {
      let response = await fetch(`${apiUrl}/api/tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include"
      });

      if (response.status === 401 || response.status === 403) {
        const newToken = await newAccessToken();

        if (!newToken) {
          return console.log('access denied');
        }

        response = await fetch(`${apiUrl}/tickets`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error('Error fetching ticket details');
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleBlur = (index) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket, i) =>
        i === index ? { ...ticket, isBlurred: !ticket.isBlurred } : ticket
      )
    );
  };

  return (
    <div className={styles.ticketList}>
      {tickets.map((ticket, index) => (
        <div key={ticket._id} className={styles.ticket}>
          <h2>Ticket for {ticket.eventId.eventName}</h2>
          <p>Date: {new Date(ticket.eventId.eventDate).toLocaleDateString()}</p>
          <p>Location: {ticket.eventId.eventLocation}</p>
          <div className={styles.ticketCodeContainer}>
            <p className={ticket.isBlurred ? '' : styles.blurred}>Code: {ticket.code}</p>
            <button onClick={() => toggleBlur(index)} className={styles.toggleBlurButton}>
              {ticket.isBlurred ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ticket;
