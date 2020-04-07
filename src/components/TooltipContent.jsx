import React from 'react';

const TooltipContent = ({ active, payload, label }) => {
  if (!active || !payload.length) {
    return null;
  }

  const sorted = payload.sort((a, b) => (a.value > b.value ? -1 : 1));

  const date = new Date(label);
  return (
    <div className="tooltip">
      {sorted.map((item) => (
        <p>
          <span className="tooltip-label">
            {date.toLocaleDateString()}
          </span>
          {' '}
          <strong>{item.value.toLocaleString()}</strong>
          {' '}
          {item.name.replace(/-/g, ' ').replace('combined', '')}
        </p>
      ))}

    </div>
  );
};

export default TooltipContent;
