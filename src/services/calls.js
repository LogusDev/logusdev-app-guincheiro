import api from "./api"

export const getCallsWaiting = async (latitude, longitude) => {
    try {
        const response = await api.get("/chamados/andamento", {
            params: {
                lat: latitude,
                lng: longitude
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