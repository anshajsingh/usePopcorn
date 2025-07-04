import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
//import CurrencyApp from './CurrencyApp';
import Geolocation from './Geolocation';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <CurrencyApp /> */}
    <Geolocation />
  </React.StrictMode>
);

