import React, { createContext, useState } from 'react';
import api from '../services/api';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await api.post('/guincheiros/login', credentials);

    const logout = () => {
        setDriver(null);
    };

    return(
        <DriverContext.Provider value={{driver, setDriver, login, logout}}>
            {children}
        </DriverContext.Provider>
    )
}
      const guincheiroData = response.data.guincheiro;
      const authToken = response.data.token;

      setDriver(guincheiroData);
      setToken(authToken);

      console.log('Login bem-sucedido:', { guincheiroData, authToken });
      return { guincheiroData, authToken };
    } catch (error) {
      throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
  };

  return (
    <DriverContext.Provider value={{ driver, setDriver, token, setToken, login }}>
      {children}
    </DriverContext.Provider>
  );
};
