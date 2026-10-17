import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './app/App'
import Navbar from './components/Navigation/Navbar'
import './index.css'

// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";

// import Home from './app/App.jsx';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   }]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <Navbar />
    {/* <Home /> */}
  </StrictMode>,
)
