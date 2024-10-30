import {createContext, useContext, useState, useEffect} from 'react'

const apiUrl = import.meta.env.VITE_API_URL
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const getInitialAuthState = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated === "true"; 
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState)
  const [accessToken, setAccessToken] = useState('')
  const [userInfo, setUserInfo] = useState({
    firstName: ''
  })
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() =>{
    const checkAuth = async () =>{
      if(isAuthenticated && !accessToken){
        await newAccessToken()
      }
    }
    checkAuth()
  }, [])

  const newAccessToken = async () =>{
    try {
      const response = await fetch(`${apiUrl}/api/refresh-token`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if(!response.ok){
        setIsAuthenticated(false)
        localStorage.setItem("isAuthenticated", "false")
        return
      }

      const data = await response.json()
      setAccessToken(data.newAccessToken)
      setUserInfo({
        firstName: data.firstName
      })
      setIsAdmin(data.isAdmin)
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")


      return data.newAccessToken
    } catch (error) {
      console.log(error)
      setIsAuthenticated(false)
      localStorage.setItem("isAuthenticated", "false")
    }
  }

  const authenticate = async (values, {setFieldError, resetForm}) =>{
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include'
      })

      const data = await response.json()
      if(!response.ok){
        if(data === "Incorrect email or password"){
          setFieldError("password", "Incorrect email or password")
          return
        }
      }

      resetForm()
      setAccessToken(data.accessToken)
      setUserInfo({
        firstName: data.firstName
      })
      setIsAdmin(data.isAdmin)
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")

      
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setAccessToken('');
        setUserInfo({ firstName: ''});
        setIsAdmin(false)
        localStorage.removeItem("isAuthenticated")
        
      } 
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return(
    <AuthContext.Provider value={{isAuthenticated, authenticate, accessToken, userInfo, isAdmin, logout, newAccessToken}}>
      {children}
    </AuthContext.Provider>
  )
}