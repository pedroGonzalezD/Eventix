import styles from './Events.module.scss';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import Switch from '../../components/switch/Switch';

const apiUrl = import.meta.env.VITE_API_URL;

const Events = () => {
  const { accessToken, newAccessToken } = useAuth();
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [image, setImage] = useState(null);
  const [showVisibleOnly, setShowVisibleOnly] = useState(false);

  const handleToggleVisible = () => {
    setShowVisibleOnly((prev) => !prev);
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setImage(null); 
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
    setImage(null); 
  };

  useEffect(() => {
    if(accessToken){
      getAllEvent();
    }
  }, [accessToken]);

  const isExpired = (eventDate) => {
    const today = new Date(); 
    const eventDateObj = new Date(eventDate); 
    return eventDateObj < today; 
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  };

  const formatCapacity = (totalCapacity, ticketsRemaining, ticketsSold) => {
    if (ticketsSold > 0) {
      return `${ticketsRemaining} / ${totalCapacity}`;
    }
    
    return `${totalCapacity}`;
  };


  const getAllEvent = async () => {
    const response = await fetch(`${apiUrl}/api/admin/events`, {
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

      const retryResponse = await fetch(`${apiUrl}/api/admin/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
      });

      const data = await retryResponse.json();

      if (!retryResponse.ok) {
        console.log(data);
        return;
      }
      setList(data);
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      console.log(data);
    }

    setList(data);
  };

  const handleUpdateEvent = async (values) => {
    let updatedEvent = { ...selectedEvent, ...values };

    const formData = new FormData(); 
    Object.keys(updatedEvent).forEach((key) => {
      formData.append(key, updatedEvent[key]);
    });
    if (image) {
      formData.append('image', image); 
    }

    const updateEvent = async (token) => {
      const response = await fetch(`${apiUrl}/api/admin/events/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return response;
    };

    let response = await updateEvent(accessToken);

    if (response.status === 401 || response.status === 403) {
      const newToken = await newAccessToken();

      if (!newToken) {
        return console.log('access denied');
      }

      response = await updateEvent(newToken);
    }

    if (response.ok) {
      const updatedData = await response.json();
      setList((prevList) =>
        prevList.map((event) =>
          event._id === updatedData._id ? updatedData : event
        )
      );
      closeModal();
    } else {
      console.log('Error updating event');
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');

    if (confirmed) {
      const deleteEvent = async (token) => {
        const response = await fetch(`${apiUrl}/api/admin/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        return response;
      };

      let response = await deleteEvent(accessToken);

      if (response.status === 401 || response.status === 403) {
        const newToken = await newAccessToken();

        if (!newToken) {
          return console.log('access denied');
        }

        response = await deleteEvent(newToken);
      }

      if (response.ok) {
        setList((prevList) => prevList.filter((event) => event._id !== id));
      } else {
        console.log('Error deleting event');
      }
    }
  };

  return (
    <div className={styles.cont}>
        <h2>Events</h2>
        <div className={styles.show}>
          <Switch 
            isChecked={showVisibleOnly} 
            onToggle={handleToggleVisible} 
          />
          <p>{showVisibleOnly ? 'Visible Only' : 'All Events'}</p>
        </div>
        <div className={styles.border}>
          <ul className={styles.ul}>
             {list.filter((it) => (showVisibleOnly ? it.isVisible : true))
              .map((it) => (
              <li key={it._id} className={styles.li} onClick={() => openModal(it)}>
                <div className={styles.contentImg}>
                  <img src={`${apiUrl}/${it.image}`} alt={it.eventName} />
                </div>
                <h4>
                  Name:<span>{` ${it.eventName}`}</span>
                </h4>
                <p>
                  Applicant:<span>{` ${it.applicant}`}</span>
                </p>
                <p>
                  Phone number:<span>{` ${it.phoneNumber}`}</span>
                </p>
                <p>
                  Visibility:<span>{it.isVisible ? ' 👁️' : ' 🚫'}</span>
                </p>
                <p>Event Location:<span>{` ${it.eventLocation}`}</span></p>
                <p>Capacity:<span>{` ${formatCapacity(it.totalCapacity, it.ticketRemaining, it.ticketsSold)}`}</span></p>
                <p>Event Date:<span>{` ${formatDate(it.eventDate)}`}</span></p>
                {isExpired(it.eventDate) && (
                  <p className={styles.expired}>Event Expired</p>
                )}
                <button 
                  className={styles.deleteButton} 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteEvent(it._id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

       
        {isOpen && selectedEvent && (
          <div className={styles.overlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>Edit Event</h2>
              <div className={styles.imgContent}>
                <img src={`${apiUrl}/${selectedEvent.image}`} alt={selectedEvent.eventName} className={styles.image} /> 

              </div>

              <Formik
                initialValues={{
                  eventName: selectedEvent.eventName,
                  applicant: selectedEvent.applicant,
                  phoneNumber: selectedEvent.phoneNumber,
                  eventType: selectedEvent.eventType,
                  eventDate: formatDate(selectedEvent.eventDate),
                  eventTime: selectedEvent.eventTime,
                  eventLocation: selectedEvent.eventLocation,
                  comments: selectedEvent.comments,
                  totalCapacity: selectedEvent.totalCapacity,
                  price: selectedEvent.price || 0,
                  isVisible: selectedEvent.isVisible,
                }}
                onSubmit={handleUpdateEvent}
              >
                {() => (
                  <Form className={styles.form}>
                    <div>
                      <label className={styles.label}>Event Name:</label>
                      <Field name="eventName" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Applicant:</label>
                      <Field name="applicant" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Phone Number:</label>
                      <Field name="phoneNumber" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Event Type:</label>
                      <Field name="eventType" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Event Date:</label>
                      <Field name="eventDate" type="date" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Event Time:</label>
                      <Field name="eventTime" type="time" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Event Location:</label>
                      <Field name="eventLocation" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Comments:</label>
                      <Field name="comments" type="text" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Total Capacity:</label>
                      <Field name="totalCapacity" type="number" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Price:</label>
                      <Field name="price" type="number" className={styles.field}/>
                    </div>
                    <div>
                      <label className={styles.label}>Is Visible:</label>
                      <Field name="isVisible" type="checkbox" className={styles.checkbox}/>
                    </div>
                    <div>
                    <label className={styles.label}>Image:</label>
                    <div className={styles.uploadContainer}>
                      <button
                        type="button"
                        className={styles.uploadButton}
                        onClick={() => document.getElementById('updateFileUpload').click()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#5f6368"
                        >
                          <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                        </svg>
                        Upload New Image
                      </button>
                      <p>Or drop files</p>
                      <input
                        id="updateFileUpload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const selectedFile = event.target.files[0];
                          if (selectedFile) {
                            if (selectedFile.type.startsWith('image/')) {
                              if (selectedFile.size > 5 * 1024 * 1024) {
                                setImage(null); 
                              } else {
                                setImage(selectedFile); 
                                console.log(selectedFile)
                              }
                            } else {
                              setImage(null);
                            }
                          }
                        }}
                        className={styles.hiddenFileInput}
                      />
                      {image && <p className={styles.fileName}>Selected file: {image.name}</p>}
                    </div>
                  </div>
                    <button type="submit" className={styles.submitButton}>Update Event</button>
                    <button type="button" onClick={closeModal} className={styles.closeButton}>Close</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
  );
};

export default Events;
