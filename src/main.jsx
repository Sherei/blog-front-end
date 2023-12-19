import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import meraStore from './Components/store/Store';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
   <Provider store={meraStore}>
    <App />
    </Provider>
  </React.StrictMode>,
)
