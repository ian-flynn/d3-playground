import * as d3 from 'd3';
import { useEffect, useState, useRef, useReducer } from 'react';
import bikeDopingData from '../content/bikeDoping.json';

const ScatterPlot = ({ width = 800, height = 800, padding = 80 }) => {
  // const [data, setData] = useState([]);
  const [timeParsedData, setTimeParsedData] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await fetch(
  //       'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  //     );
  //     setData(await res.json());
  //   }
  //   fetchData();
  // }, []);

  // Y-Axis
  const gy = useRef();
  const timeParse = (data) => {
    return data.map((datum) => {
      datum = JSON.parse(JSON.stringify(datum));
      var parsedTime = datum.Time.split(':');
      datum.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      return datum;
    });
  };
  const newData = timeParse(bikeDopingData);
  var yScale = d3
    .scaleTime()
    .domain([d3.min(newData, (d) => d.Time), d3.max(newData, (d) => d.Time)])
    .range([padding, height - padding]);
  useEffect(() => {
    void d3
      .select(gy.current)
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')));
  }, [gy, yScale]);

  // X AXIS
  const gx = useRef();
  var xScale = d3
    .scaleTime()
    .domain([
      d3.min(bikeDopingData, (d) => d.Year - 1),
      d3.max(bikeDopingData, (d) => d.Year + 1),
    ])
    .range([padding, width - padding]);

  useEffect(() => {
    void d3
      .select(gx.current)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
  }, [gx, xScale]);

  // DOTS
  const dots = bikeDopingData.map((datum) => {
    return (
      <circle
        r={8}
        cx={(d) => xScale(d.Year)}
        cy={10}
        class='dot'
        data-xvalue={(d) => d.Year}
        data-yvalue={(d) => d.Time}
      ></circle>
    );
  });

  return (
    <div id='scatter-plot'>
      <svg width={width} height={height}>
        <text x='375' y='69' fontSize='30' id='title'>
          Doping in Professional Biking
        </text>
        <text x='482' y='96' fontSize='20' id='subtitle'>
          35 Fastest times up Alpe d'Huez
        </text>
        <g
          ref={gy}
          id='y-axis'
          transform={`translate(${padding}, 0)`}
          style={{ fontSize: '15' }}
        ></g>
        <g
          ref={gx}
          id='x-axis'
          transform={`translate(0, ${height - padding})`}
        ></g>
        {dots}
      </svg>
    </div>
  );
};

export default ScatterPlot;
