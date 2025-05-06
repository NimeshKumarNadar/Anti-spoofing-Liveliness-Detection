import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [serverUrl, setServerUrl] = useState('');
  const [autoSend, setAutoSend] = useState(false);

  return (
    <SettingsContext.Provider value={{
      serverUrl, setServerUrl,
      autoSend, setAutoSend
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
