import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './style.module.css';
import { AreaChart } from '../../Atoms/Areachart/index';
import { Point } from '../../../hooks/useAreachart';

const socket = io('ws://localhost:3001', {
  reconnectionDelayMax: 10000,
  // auth: {
  //   token: "123"
  // },
  // query: {
  //   "my-key": "my-value"
  // }
});

export const ChartContainer = () : JSX.Element | null => {
  const [temperature, setTemperature] = useState<Point[]>([]);
  const [humidity, setHumidity] = useState<Point[]>([]);
  const [precipitation, setPrecipitation] = useState<Point[]>([]);

  useEffect(() => {
    socket.on('temperature', ({ x, y }:Point) => {
      setTemperature([...temperature, {
        x,
        y,
      }]);
    });

    socket.on('humidity', ({ x, y }:Point) => {
      setHumidity([...humidity, {
        x,
        y,
      }]);
    });

    // I know that it doesn't have sense
    socket.on('precipitation', ({ x, y }:Point) => {
      setPrecipitation([...precipitation, {
        x,
        y,
      }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [temperature, humidity, precipitation]);

  return (
    <div className={styles.chartContainer}>
      <AreaChart data={temperature} width={500} height={500} color="#44D600" gradientId="green-gradient" maxDisplayX={5} title="Temperature" />
      <AreaChart data={humidity} width={500} height={500} color="#1A75FF" gradientId="blue-gradient" maxDisplayX={6} title="Humidity" />
      <AreaChart data={precipitation} width={500} height={500} color="#FFA31A" gradientId="orange-gradient" maxDisplayX={7} title="Precipitation" />
    </div>
  );
};
