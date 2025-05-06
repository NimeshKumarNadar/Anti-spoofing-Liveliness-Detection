import React from 'react';

const ResultSidebar = ({ results, position, title }) => (
  <div
    className={`sidebar ${position} overflow-x-hidden break-words whitespace-pre-wrap rounded-lg border border-gray-300 shadow-sm`}
  >
    {/* Sidebar Header */}
    <div className="sidebar-header bg-blue-300 px-4 py-2 rounded-t-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>

    {/* Results List */}
    <ul className="space-y-2 px-2 py-2">
      {[...results].reverse().map(({ id, timestamp, status, data, msg }, index) => (
        <li
          key={id}
          className={`
            p-2 text-sm leading-snug rounded-md
            ${index % 2 === 0
              ? 'bg-gradient-to-r from-sky-100 to-sky-200'
              : 'bg-gradient-to-l from-indigo-100 to-indigo-200'}
          `}
        >
          <strong>{timestamp}</strong> – {status}
          <pre className="break-words whitespace-pre-wrap">
            {status === 'done' ? JSON.stringify(data, null, 2) : data || ''}
          </pre>
          <pre className="break-words whitespace-pre-wrap">
            {status === 'done' ? JSON.stringify(msg, null, 2) : msg || ''}
          </pre>
        </li>
      ))}
    </ul>
  </div>
);

export default ResultSidebar;
