import './index.css';
import { Link, Outlet } from 'react-router-dom';
const App = () => {
  return (
    <div id='wrapper'>
      <nav>
        <Link to='/heatmap'>Monthly Global Land-Surface Temperature</Link>
        <Link to='/barchart'>US Gross Domestic Product</Link>
        <Link to='/scatterplot'>Doping in Professional Biking</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
