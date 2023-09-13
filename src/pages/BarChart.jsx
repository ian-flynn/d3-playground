import * as d3 from 'd3';
import { useEffect, useState } from 'react';

const BarChart = ({ width = 1200, height = 800, padding = 80, barGap = 1 }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
      );
      const data = await res.json();
      setData(data.data);
    }
    fetchData();
  }, []);

  var tooltip = d3
    .select('#svgBox')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  const svg = d3
    .select('#svgBox')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.json(
    'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  ).then((datas) => {
    const GDP = datas.data.map((item) => item[1]);
    // TITLE
    svg
      .append('text')
      .attr('x', 240)
      .attr('y', 80)
      .text('US Gross Domestic Product')
      .style('font-size', 30)
      .attr('id', 'title');

    // Y-AXIS
    const gdpMax = d3.max(GDP);
    const yAxis = d3.axisLeft(
      d3
        .scaleLinear()
        .domain([0, gdpMax])
        .range([height - padding, padding])
    );
    svg
      .append('g')
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis)
      .attr('id', 'y-axis')
      .style('font-size', '15');

    // X-AXIS
    const barWidth = (width - 2 * padding) / GDP.length;
    const yearsList = datas.data.map((item) => {
      return new Date(item[0]);
    });
    const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsList), d3.max(yearsList)])
      .range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + (height - padding) + ')')
      .call(xAxis)
      .attr('id', 'x-axis')
      .style('font-size', '15');

    // TOOLTIP DATE FORMATTING
    const quarterDates = datas.data.map((item) => {
      const quarter =
        item[0].substring(5, 7) === '01'
          ? 'Q1'
          : item[0].substring(5, 7) === '04'
          ? 'Q2'
          : item[0].substring(5, 7) === '07'
          ? 'Q3'
          : 'Q4';
      return quarter + ' ' + item[0].substring(0, 4);
    });
    // BARS
    var linearScale = d3
      .scaleLinear()
      .domain([0, gdpMax])
      .range([padding, height - padding]);
    const scaledGDP = GDP.map((item) => linearScale(item));

    svg
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * barWidth + padding)
      .attr('y', (d) => height - d)
      .attr('width', barWidth - barGap)
      .attr('height', (d) => d - padding)
      .attr('class', 'bar')
      .attr('data-gdp', (d, i) => datas.data[i][1])
      .attr('data-date', (d, i) => datas.data[i][0])
      .attr('index', (d, i) => i)
      .attr('fill', '#5c715e')

      // TOOLTIPS
      .on('mouseover', function (event, d) {
        var i = this.getAttribute('index');
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(
            quarterDates[i] +
              '<br>' +
              ' $' +
              this.getAttribute('data-gdp') +
              ' Billion'
          )
          .attr('data-date', datas.data[i][0])
          .style('left', 350 + 'px')
          .style('top', 350 + 'px');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(1000).style('opacity', 0);
      });
  });
  return (
    <div>
      <h1>BarChart</h1>
      <svg width={width} height={height}></svg>
      <div id='main'>
        <div id='svgBox'></div>
      </div>
    </div>
  );
};

export default BarChart;
