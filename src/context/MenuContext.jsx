import {createContext, useState, useContext} from 'react'

const MenuContext = createContext('')

export const MenuProvider = ({children}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const toggleMenu = () =>{
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <MenuContext.Provider value={{isMenuOpen, toggleMenu, isAccountMenuOpen, setIsAccountMenuOpen}}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)