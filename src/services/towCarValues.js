import api from './api';

export const getValorAtual = async (idGuincheiro, token) => {
  const response = await api.get(`/valores-guincho/guincheiro/${idGuincheiro}/atual`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateValoresGuincho = async (id, token, valores) => {
  const response = await api.put(`/valores-guincho/${id}`, valores, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
