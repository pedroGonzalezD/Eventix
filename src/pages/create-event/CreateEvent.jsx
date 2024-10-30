import styles from './CreateEvent.module.scss'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {useState} from 'react'

const apiUrl = import.meta.env.VITE_API_URL

const validate = (values) => {
  const errors = {};
  
  if (!values.applicant) {
    errors.applicant = 'Applicant name is required';
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\d[\d\s]*\d$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Phone number must only contain numbers';
  }

  if (!values.eventName) {
    errors.eventName = 'Event name is required';
  }

  if (!values.eventLocation) {
    errors.eventLocation = 'Event location is required';
  }

  if (!values.totalCapacity) {
    errors.totalCapacity = 'Total capacity is required';
  } else if (!/^\d+$/.test(values.totalCapacity)) {
    errors.totalCapacity = 'Must be a positive integer';
  }

  if (!values.eventType) {
    errors.eventType = 'Event type is required';
  }

  if (!values.eventDate) {
    errors.eventDate = 'Event date is required';
  }

  if (!values.eventTime) {
    errors.eventTime = 'Event time is required';
  }

  if (!values.price) {
    errors.price = 'price is required';
  }

  return errors;
};

const CreateEvent = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  return (
      

    <Formik
      initialValues={{
        applicant: '',
        phoneNumber: '',
        eventName: '',
        eventLocation: '',
        totalCapacity: '',
        eventType: '',
        eventDate: '',
        eventTime: '',
        comments: '',
        price: '',
      }}
      validate={validate}
      onSubmit={ async (values, { setSubmitting, setFieldError, resetForm }) => {
        setSubmitting(true)
        
        const formData = new FormData()

        formData.append('applicant', values.applicant);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('eventName', values.eventName);
        formData.append('eventLocation', values.eventLocation);
        formData.append('totalCapacity', values.totalCapacity);
        formData.append('eventType', values.eventType);
        formData.append('eventDate', values.eventDate);
        formData.append('eventTime', values.eventTime);
        formData.append('comments', values.comments);
        formData.append('price', values.price);

        if(file){
          formData.append('image', file)
        }

        try {
          const response = await fetch(`${apiUrl}/api/events`,{
            method: 'POST',
            body: formData,
          })

          const data = await response.json()

          if(!response.ok){
            if(data === 'All required fields must be provided'){

              setFieldError('general', data)

              if(!values.applicant){
                setFieldError('applicant', 'Applicant is required')
              }
              if (!values.phoneNumber) {
                setFieldError('phoneNumber', 'Phone number is required');
              }
              if (!values.eventName) {
                setFieldError('eventName', 'Event name is required');
              }
              if (!values.eventLocation) {
                setFieldError('eventLocation', 'Event location is required');
              }
              if (!values.totalCapacity) {
                setFieldError('totalCapacity', 'Total capacity is required');
              }
              if (!values.eventType) {
                setFieldError('eventType', 'Event type is required');
              }
              if (!values.eventDate) {
                setFieldError('eventDate', 'Event date is required');
              }
              if (!values.eventTime) {
                setFieldError('eventTime', 'Event time is required');
              }
              if (!values.price) {
                setFieldError('price', 'Price is required');
              }
            }
          }

          console.log(data)
          resetForm()
          alert('Data sent successfully')
          setFile('')

        } catch (error) {
          console.log(error)
          setFieldError('general', error);
        } finally {
          setSubmitting(false)
        }
        
      }}
      >
      {({ setFieldValue }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Event Creation Form</h2>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <label>
                Applicant <span>*</span>
                <Field type="text" name="applicant" className={styles.input} />
                <ErrorMessage name="applicant" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Phone Number <span>*</span>
                <Field type="tel" name="phoneNumber" className={styles.input}/>
                <ErrorMessage name="phoneNumber" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Event Name <span>*</span>
                <Field type="text" name="eventName" className={styles.input} />
                <ErrorMessage name="eventName" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Event Location <span>*</span>
                <Field type="text" name="eventLocation" className={styles.input} />
                <ErrorMessage name="eventLocation" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Total Capacity for Sale <span>*</span>
                <Field type="number" name="totalCapacity" className={styles.input} />
                <ErrorMessage name="totalCapacity" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Price <span>*</span>
                <Field type="number" name="price" className={styles.input} />
                <ErrorMessage name="price" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Event Type <span>*</span>
                <Field as="select" name="eventType" className={styles.input}>
                  <option value="">Select an event type</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Party">Party</option>
                  <option value="Gala">Gala</option>
                  <option value="Festival">Festival</option>
                  <option value="Bootcamp">Bootcamp</option>
                </Field>
                <ErrorMessage name="eventType" component="div" className={styles.error} />
              </label>
              </li>

            <li className={styles.li}>
              <label>
                Event Date <span>*</span>
                <Field type="date" name="eventDate" className={styles.input} 
                min={new Date().toISOString().split('T')[0]}
                />
                <ErrorMessage name="eventDate" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Event Time <span>*</span>
                <Field type="time" name="eventTime" className={styles.input} />
                <ErrorMessage name="eventTime" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
              <label>
                Comments 
                <Field as="textarea" name="comments" className={styles.textarea}/>
                <ErrorMessage name="comments" component="div" className={styles.error}/>
              </label>
            </li>

            <li className={styles.li}>
            <label className={styles.label}>
              Select your image to upload
            </label>
            <div className={styles.uploadContainer}>
              <button
                type="button"
                className={styles.uploadButton}
                onClick={() => document.getElementById('fileUpload').click()}
                > 
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                Upload Image
              </button>
              <p>Or drop files</p>
              <input
                id="fileUpload"
                type="file"
                name="file"
                accept="image/*"
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files[0];
                      if (selectedFile) {
                        if (selectedFile.type.startsWith('image/')) {
                          if (selectedFile.size > 5 * 1024 * 1024) {
                            setFileError('File size must be less than 5MB');
                            setFieldValue('file', null);
                          } else {
                            setFile(selectedFile);
                            setFieldValue('file', selectedFile);
                            setFileError(null);
                          }
                        } else {
                          setFileError('Only image files are allowed');
                          setFieldValue('file', null);
                        }
                      }
                    }}
                    className={styles.hiddenFileInput}
                  />
            </div>
            <ErrorMessage name="file" component="div" className={styles.error} />

            {fileError && <div className={styles.error}>{fileError}</div>}

            {file && (
              <p className={styles.fileName}>Selected file: {file.name}</p>
            )}
          </li>
          </ul>
          <ErrorMessage name='general' component='div' className={styles.error}/>
            <button type="submit" className={styles.submit}>
              Enviar
            </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateEvent