import React from 'react';

const ResultSidebar = ({ results, position, title }) => (

  <div className={`sidebar ${position}`}>
    <div className="sidebar-header">
      <h3>{title}</h3>
      
    </div>
    <ul>
      {[...results].reverse().map(({ id, timestamp, status, data, msg }) => (
        <li key={id}>
          <strong>{timestamp}</strong> - {status}
          <pre>{status === 'done' ? JSON.stringify(data, null, 2) : data || ''}</pre>
          <pre>{status === 'done' ? JSON.stringify(msg, null, 2) : msg || ''}</pre>
        </li>
      ))}
    </ul>
  </div>
);

export default ResultSidebar;