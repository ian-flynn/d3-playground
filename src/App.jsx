import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import './index.css';
import { v4 as uuid } from 'uuid';
import HeatMap from './pages/HeatMap.jsx';
import { Link, Outlet } from 'react-router-dom';
const App = () => {
  return (
    <div id='wrapper'>
      <nav>
        <Link to='/heatmap'>Heat Map</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
