import React from 'react';

const TooltipContent = ({ active, payload, label }) => {
  if (!active || !payload.length) {
    return null;
  }


  const sorted = payload.sort((a, b) => (a.value > b.value ? -1 : 1));

  const date = new Date(label);
  return (
    <div className="tooltip">
      <p className="tooltip-label">
        {date.toLocaleDateString()}
      </p>
      {sorted.map((item) => (
        <p key={item.name}>
          {item.value.toLocaleString()}
          {' '}
          {item.name.replace(/-/g, ' ').replace('combined', '')}
        </p>
      ))}

    </div>
  );
};

export default TooltipContent;
