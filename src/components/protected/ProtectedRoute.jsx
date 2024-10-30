import {Navigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useAuth()

  return (
      isAuthenticated ? children : <Navigate to= '/log-in'/>
  )
}

export default ProtectedRoute