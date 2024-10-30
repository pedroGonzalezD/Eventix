import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} Pedro Gonzalez. All rights reserved.</p>
    </footer>
  );
};

export default Footer;