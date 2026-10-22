import './App.css'

import Home from './Home'
import Planner from './Planner'
import Progress from './Progress'

import Navbar from '../components/Navigation/Navbar'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, {
    path: "/planner",
    element: <Planner />,
  }, {
    path: "/progress",
    element: <Progress />,
  }
]);


export default function App() {
  return (
    <>
      <div className="app-shell"> {/* outermost */}
        <main className="app-main">
          <Navbar />
          <RouterProvider router={router} />
        </main>
      </div>
    </>
  )
}
