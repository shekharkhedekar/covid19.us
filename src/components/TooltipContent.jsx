import React from 'react';

const TooltipContent = ({
  active, payload, label, activeDotValue,
}) => {
  console.log('payload', payload);
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
      {sorted.map((item) => {
        const name = item.name.replace(/-/g, ' ').replace('combined', '').replace('cases', '').replace('deaths', '');
        const formattedValue = item.value.toLocaleString();
        return (
          <p key={item.name}>
            {activeDotValue === item.value ? (
              <strong>
                {formattedValue}
                {name ? ` - ${name}` : ''}
              </strong>
            ) : (
              <span>
                {formattedValue}
                {name ? ` - ${name}` : ''}
              </span>
            )}

          </p>
        );
      })}

    </div>
  );
};

export default TooltipContent;
