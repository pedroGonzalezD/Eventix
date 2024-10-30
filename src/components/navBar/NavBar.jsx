import { Link } from 'react-router-dom'
import styles from './NavBar.module.scss'
import { useMenu } from '../../context/MenuContext'
import { useAuth } from '../../context/AuthContext'
import { CSSTransition } from 'react-transition-group';
import {useRef} from 'react'

const NavBar = () => {
  const { isMenuOpen, toggleMenu, isAccountMenuOpen, setIsAccountMenuOpen } = useMenu()
  const { isAuthenticated, logout, isAdmin } = useAuth()
  const nodeRef = useRef(null)
  

  const toggleLogout = () => {
    if(isMenuOpen && isAccountMenuOpen){
      logout()
      toggleMenu()
      toggleAccountMenu()
      return
    }

    if(isAccountMenuOpen){
      logout()
      toggleAccountMenu()
    }
  }

  const close = () => {
    if(isMenuOpen && isAccountMenuOpen){
      toggleMenu()
      toggleAccountMenu()
      return
    }

    if(isMenuOpen){
      toggleMenu()
      return
    }

    if(isAccountMenuOpen){
      toggleAccountMenu()
      return
  }
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(prev => !prev)
  }

  return (
    <>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
        <ul>
          <li>
            <Link to='/' onClick={close}>Home</Link>
          </li>
          <li>
            <Link to='/create-event' onClick={close}>Create event</Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button className={styles.accountButton} onClick={toggleAccountMenu}>
                Account
                <span className={`${styles.arrow} ${isAccountMenuOpen ? styles.open : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z"/></svg>
                </span>
              </button>
                <CSSTransition
                  in={isAccountMenuOpen}
                  timeout={300}
                  classNames={{
                    enter: styles.slideEnter,
                    enterActive: styles.slideEnterActive,
                    exit: styles.slideExit,
                    exitActive: styles.slideExitActive,
                  }}
                  unmountOnExit
                  nodeRef={nodeRef}
                >

                <ul ref={nodeRef} className={styles.accountMenu} >
                  {isAdmin ? 
                    <li className={`${styles.accountA} ${styles.border}`}>
                      <Link to='/account/events' onClick={close}>Events</Link>
                    </li> : ''}
                  
                  <li className={styles.accountA}>
                    <Link to='/account/tickets' onClick={close}>My Tickets</Link>
                  </li>
                  <li>
                    <button className={styles.logoutButton} onClick={toggleLogout}>Sign out</button>
                  </li>
                </ul>
                </CSSTransition>
            </li>
          ) : (
            <li>
              <Link to='/log-in' onClick={toggleMenu}>Log In / Sign Up</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className={`${styles.overlay} ${isMenuOpen ? styles.visible : ''}`} onClick={close}>
      </div>
    </>
  )
}

export default NavBar
