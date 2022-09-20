import {
  useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import {
  extent, scaleLinear, select, axisBottom,
  axisLeft, line, curveCardinal, area, scaleTime, timeParse, timeFormat,
} from 'd3';

export const MARGIN = {
  top: 30, right: 30, bottom: 50, left: 50,
};

export type Point = { x: string; y: number };

export type AreaChartProps = {
  width: number;
  height: number;
  data: Point[];
  color: string;
  gradientId: string;
  maxDisplayX: number;
  title:string;
};

export const useAreaChart = ({
  width, height, data, color, gradientId, maxDisplayX,
} :AreaChartProps) : any => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const [maxY, setMaxY] = useState(30);
  const axesRef = useRef(null);

  // Y axis
  const [, max] = extent(data, (d) => d.y);
  if (max && max > maxY) {
    setMaxY(max);
  }
  const yScale = useMemo(() => scaleLinear()
    .domain([0, maxY])
    .range([boundsHeight, 0]), [boundsHeight, maxY]);

  // X axis
  const xScale = useMemo(() => scaleTime()
    .domain(extent(data, (d) => timeParse('%H:%M:%SZ')(d.x)) as [Date, Date])
    .range([0, boundsWidth]), [boundsWidth, data]);

  const chartArea = area<Point>()
    .x((d) => xScale(timeParse('%H:%M:%SZ')(d.x) as Date))
    .y0(boundsHeight)
    .y1((d) => yScale(d.y))
    .curve(curveCardinal);

  const chartLine = line<Point>()
    .x((d) => xScale(timeParse('%H:%M:%SZ')(d.x) as Date))
    .y((d) => yScale(d.y)).curve(curveCardinal);

  useLayoutEffect(() => {
    const svgElement = select(axesRef.current);
    svgElement.selectAll('*').remove();
    const createAxisX = axisBottom(xScale).ticks(maxDisplayX).tickSizeOuter(0).tickFormat((date) => timeFormat('%M:%S')(date as Date));
    svgElement
      .append('g')
      .attr('transform', `translate(0,${boundsHeight})`)
      .call(createAxisX);

    const createAxisY = axisLeft(yScale);
    svgElement
      .append('g')
      .call(createAxisY);

    // gradient definition
    svgElement.append('defs')
      .append('linearGradient')
      .attr('id', `${gradientId}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', `${color}`)
      .attr('stop-opacity', 0.51);

    svgElement.select('defs')
      .select('linearGradient')
      .attr('id', `${gradientId}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', `${color}`)
      .attr('stop-opacity', 0);

    svgElement.append('path').data([data])
      .attr('class', 'area')
      .attr('d', chartArea)
      .attr('fill', `url(#${gradientId})`);
    // .attr('stroke', `${color}`)
    // .attr('stroke-width', '2');

    svgElement.append('path').data([data]).attr('class', 'line').attr('d', chartLine)
      .attr('fill', 'none')
      .attr('stroke', `${color}`)
      .attr('stroke-width', '2px');
    if (data.length > (maxDisplayX + 10)) {
      data.splice(0, 1);
    }
  }, [boundsHeight, chartArea, chartLine, color, data, gradientId, xScale, yScale]);

  // const linePath = lineBuilder(data);

  return {
    boundsWidth, boundsHeight, axesRef,
  };
};
