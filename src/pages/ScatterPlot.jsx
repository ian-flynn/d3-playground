import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import bikeDopingJson from '../content/bikeDoping.json';

const ScatterPlot = ({ width = 800, height = 800, padding = 80 }) => {
  const [tooltip, setTooltip] = useState({ display: false, top: 0, left: 0 });

  // Y-Axis
  const gy = useRef();
  const bikeDopingData = bikeDopingJson.map((d) => {
    d = JSON.parse(JSON.stringify(d));
    const [hours, seconds] = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, hours, seconds);
    return d;
  });
  var yScale = d3
    .scaleTime()
    .domain([
      d3.min(bikeDopingData, (d) => d.Time),
      d3.max(bikeDopingData, (d) => d.Time),
    ])
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
  const dots = bikeDopingData.map((datum, index) => {
    return (
      <circle
        key={index}
        r={8}
        cx={xScale(datum.Year)}
        cy={yScale(datum.Time)}
        data-xvalue={datum.Year}
        data-yvalue={datum.Time}
        className={datum.Doping ? 'dot dopers' : 'dot bikers'}
        onMouseEnter={(e) => {
          console.log(e.target.dataset);

          setTooltip({
            display: true,
            top: e.pageY,
            left: e.pageX,
          });
        }}
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
      <div
        id='tooltip'
        style={{
          top: tooltip.top,
          left: tooltip.left,
          display: tooltip.display ? 'block' : 'none',
        }}
      >
        Tooltip
      </div>
    </div>
  );
};

export default ScatterPlot;
