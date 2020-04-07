import React from 'react';

import { SHORTCUTS } from '../constants';

const Shortcuts = ({ onChange }) => (
  <div className="shortcuts">
    <h2>Quick Links</h2>
    {SHORTCUTS.map((s) => (
      <div
        key={s.name}
        className="shortcut"
        role="button"
        onClick={() => onChange(s)}
      >
        {s.name}
      </div>
    ))}
  </div>
);

export default Shortcuts;
