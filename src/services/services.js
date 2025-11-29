import api from './api';


export const registerDriver = async (driverData) => {
    try {
        const response = await api.post('/guincheiros', driverData);
        return response.data;
    } catch (error) {
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
