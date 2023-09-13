import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HeatMap from './pages/HeatMap.jsx';
import BarChart from './pages/BarChart.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'heatmap',
        element: <HeatMap />,
      },
      {
        path: 'barchart',
        element: <BarChart />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
