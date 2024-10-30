import {createBrowserRouter, Navigate} from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/home/Home'
import CreateEvent from '../pages/create-event/CreateEvent';
import LogIn from '../pages/log-in/LogIn';
import SignUp from '../pages/sign-up/SignUp';
import Account from '../pages/account/Account';
import Ticket from '../pages/ticket/Ticket';
import Profile from '../pages/profile/Profile';
import ProtectedRoute from '../components/protected/ProtectedRoute';
import Events from '../pages/events/Events';
import EventDetails from '../pages/event-details/EventDetails'
import BuyTicketPage from '../pages/buy-ticket/BuyTicketPage';

const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children: [
      {
        index: true,
        element:<Home/>
      },
      {
        path: '/create-event',
        element:<CreateEvent/>
      },
      {
        path: '/log-in',
        element: <LogIn/>
      },
      {
        path: '/sign-up',
        element: <SignUp/>
      },
      {
        path: '/event/:id',
        element: <EventDetails />,
      },
      {
        path: '/event/:id/buy',
        element: <ProtectedRoute><BuyTicketPage /></ProtectedRoute>,
      },
      {
        path: '/account',
        element: <ProtectedRoute> <Account/> </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Navigate to='tickets' replace/>
          },
          {
            path: 'tickets',
            element: <Ticket/>
          },
          {
            path: 'profile',
            element: <Profile/>
          },
          {
            path: 'events',
            element: <Events/>
          }
        ]
      }
    ]
  }
  ])

export default router