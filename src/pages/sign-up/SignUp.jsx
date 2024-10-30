
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {Link, useNavigate} from 'react-router-dom'
import styles from './SignUp.module.scss'

const apiUrl = import.meta.env.VITE_API_URL

const validate = (values) => {
  const errors = {};
  
  if (!values.firstName) {
    errors.firstName = 'First name is required';
  }
  
  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  }
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords must match';
  }
  
  return errors;
};

const SignUp = () => {
  const navigate = useNavigate();
  
  return (

    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validate={validate}
      onSubmit={async (values, {setSubmitting, setFieldError, resetForm}) => {
        setSubmitting(true)

        try {
          const response = await fetch(`${apiUrl}/api/register`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values),
          })

          const data = await response.json()

          if (!response.ok) {
            if (data === 'All fields are required') {
              if (!values.firstName) {
                setFieldError('firstName', 'First name is required');
              }
              if (!values.lastName) {
                setFieldError('lastName', 'Last name is required');
              }
              if (!values.email) {
                setFieldError('email', 'Email is required');
              }
              if (!values.password) {
                setFieldError('password', 'Password is required');
              }
              if (!values.confirmPassword) {
                setFieldError('confirmPassword', 'Confirm password is required');
              }
            } 
            if (data === 'passwords do not match') {
              setFieldError('confirmPassword', 'Passwords must match');
            } 
            if (data === 'The email is already in use') {
              setFieldError('email', 'The email is already in use');
            }

            throw new Error('Validation errors');
          } else {
            alert('User registered successfully');
            resetForm()
            navigate('/log-in')
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (

        <Form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.title}>Sign Up</p>
          <p className={styles.message}>Sign up now and get full access to our app.</p>

          <div className={styles.flex}>
            <label>
              <Field
                required
                placeholder=""
                type="text"
                name="firstName"
                className={styles.input}
                />
              <span>First name</span>
              <ErrorMessage name="firstName" component="div" className={styles.error} />
            </label>

            <label>
              <Field
                required
                placeholder=""
                type="text"
                name="lastName"
                className={styles.input}
                />
              <span>Last name</span>
              <ErrorMessage name="lastName" component="div" className={styles.error} />
            </label>
          </div>

          <label>
            <Field
              required
              placeholder=""
              type="email"
              name="email"
              className={styles.input}
              />
            <span>Email</span>
            <ErrorMessage name="email" component="div" className={styles.error} />
          </label>

          <label>
            <Field
              required
              placeholder=""
              type="password"
              name="password"
              className={styles.input}
              />
            <span>Password</span>
            <ErrorMessage name="password" component="div" className={styles.error} />
          </label>

          <label>
            <Field
              required
              placeholder=""
              type="password"
              name="confirmPassword"
              className={styles.input}
              />
            <span>Confirm password</span>
            <ErrorMessage name="confirmPassword" component="div" className={styles.error}/>
          </label>

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <p className={styles.logIn}>Already have an account? <Link to='/log-in'>Log in</Link></p>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
