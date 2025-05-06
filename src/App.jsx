import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import ResultSidebar from './ResultSidebar';
import { SettingsProvider, useSettings } from './SettingsContext';
import './styles.css';
import { HomeIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const SettingsURL = () => {
  const { serverUrl, setServerUrl } = useSettings();
  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
  <label className="text-blue-800 font-semibold text-lg">
    Server:
  </label>
  <input
    type="text"
    value={serverUrl}
    onChange={(e) => setServerUrl(e.target.value)}
    className="p-2 border border-blue-300 rounded-md text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter server URL"
  />
</div>

  );
};
const SettingsAuto = () => {
  const { autoSend, setAutoSend } = useSettings();
  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
  <label className="flex items-center space-x-2">
    {/* Checkbox (Hidden) */}
    <input
      type="checkbox"
      checked={autoSend}
      onChange={() => setAutoSend(!autoSend)}
      className="hidden"
    />
    {/* Toggle Slider */}
    <span className="w-12 h-6 bg-blue-300 rounded-full relative">
      <span
        className={`absolute w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
          autoSend ? 'translate-x-6 bg-blue-500' : 'bg-gray-400'
        }`}
      ></span>
    </span>
    {/* Label Text */}
    <span className="text-blue-800 font-semibold">{autoSend ? 'Auto-Capture ON' : 'Auto-Capture OFF'}</span>
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-t from-blue-50 via-blue-100 to-blue-200">
  {/* Header */}
  <header className="h-25 bg-gradient-to-r from-white-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
    {/* Left: Home Icon with padding */}
  <div className="flex items-center justify-start w-1/6 pl-2">
    <HomeIcon className="h-9 w-9 text-white cursor-pointer p-1 hover:bg-blue-400 rounded" title="Home" />
  </div>

  {/* Center: Title */}
  <div className="flex-1 text-center">
    <h1 className="text-xl font-semibold">Liveliness Detection</h1>
  </div>

  {/* Right: Help Icon with padding */}
  <div className="flex items-center justify-end w-1/6 pr-2">
    <QuestionMarkCircleIcon className="h-9 w-9 text-white cursor-pointer p-1 hover:bg-blue-400 rounded" title="Help" />
  </div>
  </header>

  {/* Center content (3-column layout) */}
  <main className="flex-1 flex items-center justify-center bg-blue-900">
    <div className="w-[98%] h-[95%] flex gap-2 justify-between  rounded-lg overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/4  rounded-lg flex flex-col bg-white shadow-lg">
        <SettingsAuto />
        <div className="flex-1 bg-blue-50 text-black flex flex-col shadow-md p-4 space-y-4 overflow-auto">
          <ResultSidebar
            results={autoResults}
            position="left"
            title="Auto Results"
          />
        </div>
      </div>

      {/* Center Main */}
      <div className="w-1/2  rounded-lg overflow-hidden bg-blue-900 shadow-lg">
        <WebcamCapture
          addManualResult={addManualResult}
          addAutoResult={addAutoResult}
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4  rounded-lg flex flex-col bg-white shadow-lg">
        <SettingsURL />
        <div className="flex-1 bg-blue-50 text-black flex flex-col shadow-md p-4 space-y-4 overflow-auto">
          <ResultSidebar
            results={manualResults}
            position="right"
            title="Manual Results"
          />
        </div>
      </div>
    </div>
  </main>
</div>



  );
};

const App = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;