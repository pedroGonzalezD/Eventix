import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { AuthProvider } from './context/AuthContext'
import router from './router'
import './index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MenuProvider>
        <RouterProvider router={router}/>
      </MenuProvider>
    </AuthProvider>
  </StrictMode>,
)
