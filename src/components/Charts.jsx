import React from 'react';
import {
  LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid,
} from 'recharts';

import TooltipContent from './TooltipContent';

const getMax = (name, data) => data.reduce((acc, current) => {
  const keys = Object.keys(current).filter((k) => k.includes(name));
  const values = keys.map((key) => current[key]);
  return Math.max(acc, Math.round(Math.max.apply(null, values) * 1.1));
}, 0);

const SIZE = 800;

const Charts = ({
  name,
  data,
  title,
  onDotMouseOver,
  onDotMouseLeave,
  activeDotValue,
}) => (
  <div className="charts-container">
    <h2>{title}</h2>
    <div className="charts">


      {['cases', 'deaths'].map((name) => (
        <div key={name}>
          <h3 className="chart-title">
            {name}
          </h3>
          <LineChart
            width={SIZE}
            height={SIZE}
            margin={{
              top: 25,
              right: 30,
              left: 70,
              bottom: 100,
            }}
            data={data}
          >
            <XAxis dataKey="date" tickFormatter={(v) => `${(new Date(v)).toLocaleDateString()}`} angle={-45} textAnchor="end" />
            <YAxis
              domain={[0, getMax(name, data)]}
              interval={0}
              tickFormatter={(v) => `${v.toLocaleString()}`}
            />
            <CartesianGrid />
            <Tooltip content={({ active, payload, label }) => (
              <TooltipContent
                active={active}
                payload={payload}
                label={label}
                activeDotValue={activeDotValue}
              />
            )}
            />

            {Object.keys(data[data.length - 1]).filter((k) => k.includes(name)).map((k) => (
              <Line
                key={k}
                type="natural"
                dataKey={k}
                stroke="#8884d8"
                dot={false}
                activeDot={{ onMouseOver: onDotMouseOver, onMouseLeave: onDotMouseLeave }}
              />
            ))}

          </LineChart>
        </div>
      ))}

    </div>
  </div>
);

export default Charts;
