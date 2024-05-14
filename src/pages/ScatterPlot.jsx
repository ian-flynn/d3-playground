import * as d3 from 'd3';
import { useEffect, useState, useRef, useReducer } from 'react';

const ScatterPlot = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
      );
      const datas = await res.json();
      setData(datas.data);

      console.log(datas, 'hey');
    }
    fetchData();
  });

  return (
    <div id='scatter-plot'>
      <svg width='800' height='800' padding='80'>
        <text x='375' y='69' font-size='30' id='title'>
          Doping in Professional Biking
        </text>
        <text x='482' y='96' font-size='20' id='subtitle'>
          35 Fastest times up Alpe d'Huez
        </text>
        <g
          ref={gy}
          id='y-axis'
          transform={`translate(${padding}, 0)`}
          style={{ fontSize: '15' }}
        ></g>
      </svg>
    </div>
  );
};

export default ScatterPlot;
