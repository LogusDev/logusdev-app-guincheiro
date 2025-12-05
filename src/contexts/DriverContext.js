import React, { createContext, useState } from 'react';
import api from '../services/api';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('/guincheiros/login', credentials);

      const guincheiroData = response.data.guincheiro;
      const authToken = response.data.token;

      setDriver(guincheiroData);
      setToken(authToken);

      return { guincheiroData, authToken };
    } catch (error) {
      throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
  };

  const logout = () => {
    setDriver(null);
    setToken(null);
  };

  return (
    <DriverContext.Provider value={{ driver, token, setDriver, setToken, login, logout }}>
      {children}
    </DriverContext.Provider>
  );
};
