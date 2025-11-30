import React, { createContext, useState } from 'react';
import api from '../services/api';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('/guincheiros/login', credentials);

      setDriver(response.data.guincheiro);
      setToken(response.data.token);

      console.log("Login bem-sucedido:", response.data);
      return response.data;

    } catch (error) {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor";
    }
  };

  return (
    <DriverContext.Provider value={{ driver, setDriver, token, setToken, login }}>
      {children}
    </DriverContext.Provider>
  );
};
