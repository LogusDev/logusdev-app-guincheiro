import api from './api'; 

export const uploadFotoPorEmail = async (email, imagem) => {
  console.log('[UPLOAD] Iniciando upload - Email:', email, 'Imagem URI:', imagem?.uri);
  const formData = new FormData();
  
  
  formData.append('foto', {
    uri: imagem.uri,
    name: `foto_${Date.now()}.jpg`, 
    type: 'image/jpeg', 
  });

  
  formData.append('email', email);

  try {
    // Tenta primeiro para guincheiros, se não funcionar, usa clientes como fallback
    let response;
    try {
      console.log('[UPLOAD] Tentando upload para guincheiros:', `/guincheiros/${email}/upload-foto`);
      response = await api.post(
        `/guincheiros/${email}/upload-foto`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('[UPLOAD] Upload para guincheiros bem-sucedido:', response.data);
    } catch (error) {
      console.log('[UPLOAD] Erro no upload para guincheiros, tentando clientes:', error.response?.data || error.message);
      // Fallback para rota de clientes se a de guincheiros não existir
      response = await api.post(
        `/clientes/${email}/upload-foto`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('[UPLOAD] Upload para clientes bem-sucedido:', response.data);
    }
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[UPLOAD] Erro detalhado no upload:', error.response?.data || error.message);
    console.error('[UPLOAD] Status do erro:', error.response?.status);
    throw new Error(error.response?.data?.error || 'Erro ao enviar foto');
  }
};