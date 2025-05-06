import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import ResultSidebar from './ResultSidebar';
import { SettingsProvider, useSettings } from './SettingsContext';
import './styles.css';

const Settings = () => {
  const { serverUrl, setServerUrl, autoSend, setAutoSend } = useSettings();
  return (
    <div className="settings">
      <label>
        Server :
        <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
      </label>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={autoSend}
          onChange={() => setAutoSend(!autoSend)}
        />
        <span className="slider"></span>
        <span className="label-text">{autoSend ? 'Auto-Capture ON' : 'Auto-Capture OFF'}</span>
      </label>

    </div>
  );
};

const AppContent = () => {
  const [manualResults, setManualResults] = useState([]);
  const [autoResults, setAutoResults] = useState([]);


  const addManualResult = (result) => {
    setManualResults(prev => {
      const updated = prev.map(r => r.id === result.id ? result : r);
      return updated.some(r => r.id === result.id) ? updated : [...prev, result];
    });
  };

  const addAutoResult = (result) => {
    setAutoResults(prev => {
      const updated = prev.map(r => r.id === result.id ? result : r);
      return updated.some(r => r.id === result.id) ? updated : [...prev, result];
    });
  };

  return (
    <div className="app">
      {(
        <ResultSidebar
          results={autoResults}
          position="left"
          title="Auto Results"
          
        />
      )}
      <div className="center-panel">
        <Settings />
        <WebcamCapture
          addManualResult={addManualResult}
          addAutoResult={addAutoResult}
        />
      </div>
      {(
        <ResultSidebar
          results={manualResults}
          position="right"
          title="Manual Results"
          
        />
      )}
    </div>
  );
};

const App = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;