import React from 'react';

import { AreaChartProps, MARGIN, useAreaChart } from '../../../hooks/useAreachart';

import styles from './style.module.css';

export function AreaChart({
  width, height, data, color, gradientId, maxDisplayX, title,
}: AreaChartProps): JSX.Element | null {
  const {
    boundsWidth, boundsHeight, axesRef,
  } = useAreaChart({
    width, height, data, color, gradientId, maxDisplayX, title,
  });

  return (
    <div className={styles.chartContainer}>
      <span className={styles.chartTitle}>{title}</span>
      <svg
        className={styles.areaChart}
        width={width}
        height={height}
        viewBox={`0 0 ${height} ${width}`}
      >
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </div>
  );
}
