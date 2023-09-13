import './index.css';
import { Link, Outlet } from 'react-router-dom';
const App = () => {
  return (
    <div id='wrapper'>
      <nav>
        <Link to='/heatmap'>Heat Map</Link>
        <Link to='/barchart'>Bar Chart</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
