import api from "./api"

export const getCallsWaiting = async (latitude, longitude, guincheiroId) => {
    try {
        const response = await api.get("/chamados/andamento", {
            params: {
                lat: latitude,
                lng: longitude,
                guincheiro_id: guincheiroId
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        throw error;
    }
};



export const getCallDetails = async (callId) => {
    try {
        const response = await api.get(`/chamados/detalhes/${callId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching call details:", error);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor'; 
    }
}

export const confirmCall = async (callId, guincheiroId) => {
    try {
        const response = await api.post(`/chamados/${callId}/aceitar`, { guincheiro_id: guincheiroId });
        return response.data;
    } catch (error) {
        console.error("Error confirming call:", error);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}

export const refuseCall = async (callId, guincheiroId) => {
    try {
        const response = await api.post(`/chamados/${callId}/recusar`, { guincheiro_id: guincheiroId });
        return response.data;
    } catch (error) {
        console.error("Error refusing call:", error);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}

export const updateCall = async (callId, body) => {
    try {
        const response = await api.patch(`/chamados/${callId}`, body);
        return response.data;
    } catch (error) {
        console.error("Error updating call:", error);
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}

export const getMessages = async (callId) => {
    try {
        const response = await api.get(`/mensagens/${callId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return [];
    }
};