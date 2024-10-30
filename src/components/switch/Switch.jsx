import styles from './Switch.module.scss';

const Switch = ({ isChecked, onToggle }) => {
  return (
    <label className={styles.switch}>
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={onToggle} 
        className={styles.input}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default Switch;