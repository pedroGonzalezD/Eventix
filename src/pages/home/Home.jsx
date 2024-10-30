import styles from './Home.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const imageInterval = 3000; 

  useEffect(() => {
    fetchVisibleEvents();
  }, []);

  const fetchVisibleEvents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching events');
      }

      const data = await response.json();
      const sortedEvents = data.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );

      setEvents(sortedEvents); 
      setUpcomingEvents(sortedEvents.slice(0, 5)); 
      setFilteredEvents(sortedEvents); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === upcomingEvents.length - 1 ? 0 : prevIndex + 1
      );
    }, imageInterval);

    return () => clearInterval(interval); 
  }, [upcomingEvents]);

  
  useEffect(() => {
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  return (
    <div className={styles.home}>
      <h2>Upcoming Event</h2>

      <div className={styles.slider}>
        {upcomingEvents.length > 0 && (
          <img
            src={`${apiUrl}/${upcomingEvents[currentImageIndex].image}`}
            alt={upcomingEvents[currentImageIndex].eventName}
            className={styles.sliderImage}
            onClick={() =>
              navigate(`/event/${upcomingEvents[currentImageIndex]._id}`)
            }
          />
        )}
      </div>

      <div className={styles.indicators}>
        {upcomingEvents.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentImageIndex ? styles.active : ''
            }`}
          />
        ))}
      </div>


      
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.grid}>
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className={styles.gridItem}
            onClick={() => navigate(`/event/${event._id}`)}
          >
            <h3>{event.eventName}</h3>
            <p>{new Date(event.eventDate).toLocaleDateString()}</p>
            <p>{event.eventLocation}</p>
            <img
              src={`${apiUrl}/${event.image}`}
              alt={event.eventName}
              className={styles.gridImage}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event._id}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
