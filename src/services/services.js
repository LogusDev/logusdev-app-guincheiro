import api from './api';

// Criar guincho
export const createGuincho = async (guinchoData) => {
    try {
        const response = await api.post('/guinchos', guinchoData);
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

// Buscar todos os guinchos do guincheiro logado
export const getGuinchosByGuincheiro = async (guincheiroId, token) => {
    try {
        const response = await api.get(`/guinchos/guincheiro/${guincheiroId}`, {
            headers: { 'x-access-token': token }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao carregar guinchos';
    }
};

// Buscar guincho por ID
export const getGuinchoById = async (id) => {
    try {
        const response = await api.get(`/guinchos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao buscar guincho';
    }
};

// Atualizar guincho
export const updateGuincho = async (id, data) => {
    try {
        const response = await api.put(`/guinchos/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao atualizar guincho';
    }
};

// Deletar guincho
export const deleteGuincho = async (id, guincheiro_id) => {
    try {
        const response = await api.delete(`/guinchos/${id}`, {
            data: { guincheiro_id }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao remover guincho';
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

export const selecionarGuincho = async (guinchoId, guincheiroId) => {
    try {
        const response = await api.put(`/guinchos/${guinchoId}/selecionar`, {
            guincheiro_id: guincheiroId
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao selecionar guincho';
    }
};
