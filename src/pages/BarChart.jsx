import * as d3 from 'd3';
import { useEffect, useState, useRef, useReducer } from 'react';

const BarChart = ({ width = 1200, height = 800, padding = 80, barGap = 1 }) => {
  const [data, setData] = useState([]);
  const [GDP, setGDP] = useState([]);
  const [tooltip, setTooltip] = useState({
    top: 0,
    left: 0,
    quarter: 'Q1 2022 $1billion',
    opacity: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
      );
      const data = await res.json();
      setData(data.data);
      setGDP(data.data.map((item) => item[1]));
    }
    fetchData();
  }, []);

  // Y-Axis
  const gy = useRef();
  const gdpMax = Math.max(...GDP);
  const yScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([height - padding, padding]);

  useEffect(
    () =>
      void d3
        .select(gy.current)
        .call(d3.axisLeft(yScale).tickFormat(d3.format('d'))),
    [gy, yScale]
  );
  // X-AXIS
  const gx = useRef();

  const yearsList = data.map((item) => new Date(item[0]));
  const xScale = d3
    .scaleTime()
    .domain([Math.min(...yearsList), Math.max(...yearsList)])
    .range([padding, width - padding]);

  useEffect(
    () => void d3.select(gx.current).call(d3.axisBottom(xScale)),
    [gx, xScale]
  );
  useEffect(() => {
    console.log('TOOLTIP: ', tooltip);
  }, [tooltip]);
  // BARS
  const barWidth = (width - 2 * padding) / GDP.length;
  const linearScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([padding, height - padding]);
  const scaledGDP = GDP.map((item) => linearScale(item));
  // console.log('unscaled: ', GDP[0], 'scaled: ', scaledGDP[0]);
  const bars = scaledGDP.map((item, i) => {
    return (
      <rect
        key={i}
        x={i * barWidth + padding}
        y={height - item}
        width={barWidth - barGap}
        height={item - padding}
        className='bar'
        data-gdp={GDP[i]}
        data-date={data[i][0]}
        index={i}
        fill='#5c715e'
        onMouseEnter={(e) => {
          const { gdp, date } = e.target.dataset;
          // console.log(gdp, date);
          setTooltip({
            top: e.pageY,
            left: e.pageX,
            quarter: date + ' $' + gdp + ' Billion',
            opacity: 1,
          });
          // tooltip.transition().duration(200).style('opacity', 1);
          // tooltip
          //   .html(date + '<br>' + '$' + gdp + ' Billion')
          //   .attr('data-date', date)
          //   .style('left', 350 + 'px')
          //   .style('top', 350 + 'px');
        }}
        onMouseLeave={(e) => {
          // tooltip.transition().duration(1000).style('opacity', 0);
          setTooltip({ ...tooltip, opacity: 0 });
        }}
      />
    );
  });

  return (
    <div id='bar-chart'>
      <svg width={width} height={height}>
        <text x={240} y={80} id='title'>
          US Gross Domestic Product
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
          style={{ fontSize: '15' }}
        ></g>
        {bars}
      </svg>
      <div
        id='tooltip'
        style={{
          top: tooltip.top,
          left: tooltip.left,
          opacity: tooltip.opacity,
        }}
      >
        {tooltip.quarter}
      </div>
    </div>
  );
};

export default BarChart;

var maxArea = function (height) {
  let big = 0;

  for (
    let left = 0, right = height.length - 1;
    right - left > 0;
    height[left] > height[right] ? right-- : left++
  ) {
    let shortSide = height[left] > height[right] ? height[right] : height[left];

    let area = (right - left) * shortSide;
    if (area > big) big = area;
  }

  return big;
};
