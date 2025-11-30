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


export const getDriverCalls = async (id, token) => {
  try {
    const response = await api.get(`/chamados/guincheiro/meus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    console.log("Erro ao buscar chamados do guincheiro:", error);
    throw error.response ? error.response.data : "Erro ao conectar com o servidor";
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