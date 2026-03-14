import React from 'react'
import {RouterProvider  } from "react-router-dom";
import {routes} from "./App.Routes";

function App() {
  return (
    <RouterProvider router={routes} />
  )
}

export default App