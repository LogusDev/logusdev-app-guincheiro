import api from './api';


export const registerDriver = async (driverData) => {
    try {
        const response = await api.post('/guincheiros', driverData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const registerGuincheiro = async (guincheiroData) => {
    try {
        console.log('[SERVICE] registerGuincheiro - Enviando dados:', guincheiroData);
        const response = await api.post('/guincheiros', guincheiroData);
        console.log('[SERVICE] registerGuincheiro - Resposta:', response.data);
        return response.data;
    } catch (error) {
        console.error('[SERVICE] registerGuincheiro - Erro:', error.response?.data || error.message);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const createGuincho = async (guinchoData) => {
    try {
        console.log('[SERVICE] createGuincho - Enviando dados:', guinchoData);
        const response = await api.post('/guinchos', guinchoData);
        console.log('[SERVICE] createGuincho - Resposta:', response.data);
        return response.data;
    } catch (error) {
        console.error('[SERVICE] createGuincho - Erro:', error.response?.data || error.message);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const criarValoresGuincho = async (valoresData) => {
    try {
        console.log('[SERVICE] criarValoresGuincho - Enviando dados:', valoresData);
        const response = await api.post('/valores-guincho', valoresData);
        console.log('[SERVICE] criarValoresGuincho - Resposta:', response.data);
        return response.data;
    } catch (error) {
        console.error('[SERVICE] criarValoresGuincho - Erro:', error.response?.data || error.message);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


export const updateDriver = async (id, driverData) => {
    try {
        const response = await api.put(`/guincheiros/${id}`, driverData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


export const createVehicle = async (vehicleData, token) => {
    try {
        const response = await api.post('/veiculos', vehicleData, {
            headers: { 'x-access-token': token }
        });
        return response.data;
    } catch (error) {
        console.log('Erro Axios:', error.response?.data || error.message);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


export const updateVehicle = async (vehicleId, vehicleData, token) => {
    try {
        const response = await api.put(`/veiculos/${vehicleId}`, vehicleData, {
            headers: { 'x-access-token': token }
        });
        return response.data;
    } catch (error) {
        console.log('Erro Axios:', error.response?.data || error.message);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const getVehicles = async (driverId, token) => {
    try {
        const response = await api.get(`/veiculos/${driverId}`, {
            headers: { 'x-access-token': token }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};
