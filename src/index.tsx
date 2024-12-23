import React from 'react';
import ReactDOM from 'react-dom/client';

import "./App.css"
import './index.css';
import { Provider } from 'react-redux';
import Main from './pages/Main';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
      
      
  <React.StrictMode>
  <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
  
);

