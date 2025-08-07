import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18+ way
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';

// If you have registerServiceWorker, keep it; else comment it out
// import registerServiceWorker from './registerServiceWorker';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// registerServiceWorker();  // Uncomment if you have this set up properly
