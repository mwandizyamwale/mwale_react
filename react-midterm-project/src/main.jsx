import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
//main.jsx is the entry point of the React application. It imports necessary modules and renders the App component wrapped in BrowserRouter for routing capabilities. The React.StrictMode is used to highlight potential problems in the application during development.