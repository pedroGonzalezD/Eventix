import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const {authenticate, isAuthenticated} = useAuth()

  if(isAuthenticated){
    return <Navigate to='/account'/>
  }


  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={(values,{setFieldError, resetForm}) => {
       authenticate(values,{setFieldError, resetForm} )
      }}
    >
      {({ handleSubmit }) => (
        <Form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.title}>Log In</p>
          <p className={styles.message}>Log in to access your account.</p>

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
              minLength="8"
            />
            <span>Password</span>
            <ErrorMessage name="password" component="div" className={styles.error} />
          </label>

          <button type="submit" className={styles.submit}>Log In</button>
          <p className={styles.signUp}>Don&apos;t have an account? <Link to='/sign-up'>Sign up</Link></p>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
