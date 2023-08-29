import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import './index.css';
import { v4 as uuid } from 'uuid';

const HeatMap = ({
  data,
  baseTemp,
  width = 1400,
  height = 600,
  padding = 80,
}) => {
  const [tooltip, setTooltip] = useState([0, 0, 'date', 'temp']);
  const [showTooltip, setShowTooltip] = useState(true);
  const gx = useRef();
  const gy = useRef();
  const gyLegend = useRef();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const yearMin = d3.min(data?.map((el) => el.year)) || 0;
  const yearMax = d3.max(data?.map((el) => el.year)) || 0;

  const xScale = d3
    .scaleLinear()
    .domain([yearMin, yearMax + 1])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([height - padding, padding]);

  const legendYScale = d3
    .scaleBand()
    .domain([-2, -1, 0, 1, 2])
    .range([height - padding, padding]);

  useEffect(
    () =>
      void d3
        .select(gx.current)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d'))),
    [gx, xScale]
  );
  useEffect(
    () =>
      void d3.select(gy.current).call(
        d3
          .axisLeft(yScale)
          .tickValues(yScale.domain())
          .tickFormat((d, i) =>
            'JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC'.slice(i * 3, i * 3 + 3)
          )
      ),
    [gy, yScale]
  );
  useEffect(
    () =>
      void d3
        .select(gyLegend.current)
        .call(d3.axisLeft(legendYScale).tickValues(legendYScale.domain())),
    [gyLegend, legendYScale]
  );
  const varianceColor = (variance) =>
    variance <= -2
      ? 'minus-two'
      : variance <= -1
      ? 'minus-one'
      : variance <= 0
      ? 'minus-zero'
      : variance <= 1
      ? 'plus-one'
      : 'plus-two';
  const rectangles = data?.map((d, i) => {
    return (
      <rect
        key={uuid()}
        className='cell'
        fill={`var(--cl-${varianceColor(d.variance)})`}
        data-month={d.month - 1}
        data-year={d.year}
        data-temp={d.variance}
        height={(height - 2 * padding) / 12}
        y={yScale(d.month - 1)}
        width={(width - 2 * padding) / (yearMax - yearMin)}
        x={xScale(d.year)}
        onMouseEnter={(e) => {
          const { year, month, temp } = e.target.dataset;
          setTooltip([
            e.pageX,
            e.pageY,
            `${months[month]} ${year}`,
            `${Number(temp) + baseTemp}\u2103`,
          ]);
          setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
      />
    );
  });
  const legendRectangles = [-2, -1, 0, 1, 2].map((el) => (
    <rect
      key={uuid()}
      fill={`var(--cl-${varianceColor(el)})`}
      y={legendYScale(el)}
      width={'30'}
      height={(height - 2 * padding) / 5}
    />
  ));
  return (
    <>
      <svg width={width} height={height}>
        <text x={810} y={65} id='description'>
          1753 - 2015: base temperature 8.66℃
        </text>
        <text x={800} y={40} id='title'>
          Monthly Global Land-Surface Temperature
        </text>
        <g
          ref={gx}
          id='x-axis'
          transform={`translate(0,${height - padding})`}
        ></g>
        <g ref={gy} id='y-axis' transform={`translate(${padding},0)`}></g>
        <g
          id='legend'
          ref={gyLegend}
          transform={`translate(${width - padding + padding / 2}, 0)`}
        >
          <g>{legendRectangles}</g>
        </g>
        {rectangles}
      </svg>
      <div
        id='tooltip'
        style={{
          top: tooltip[1],
          left: tooltip[0],
          display: showTooltip ? 'block' : 'none',
        }}
      >
        <h2>{tooltip[2]}</h2>
        <h3>{tooltip[3]}</h3>
      </div>
    </>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [baseTemp, setBaseTemp] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
      );
      const data = await res.json();
      setBaseTemp(data.baseTemperature);
      setData(data.monthlyVariance);
    }
    fetchData();
  }, []);
  return (
    <div id='wrapper'>
      <HeatMap data={data} baseTemp={baseTemp} />
    </div>
  );
};

export default App;
