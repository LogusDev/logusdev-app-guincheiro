import React, { useState } from 'react';
import { View, ActivityIndicator, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import styles from './styles.js';
import Button from '../../components/Button/index.js';
import PhotoPicker from '../../components/PhotoPicker/index.js';
import Logo from '../../components/Logo/index.js';
import { uploadFotoPorEmail } from '../../services/upload.js';
import { registerGuincheiro, createGuincho, criarValoresGuincho } from '../../services/services.js';

export default function CadastroDocumentos({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFotoMotorista, setSelectedFotoMotorista] = useState(null);

  // Verificar se route e route.params existem - retornar null para evitar crash
  // Usar valores padrão para evitar erro de desestruturação
  const params = route?.params || {};

  const {
    email,
    password,
    name,
    cpf: unmaskedCpf,
    phone: unmaskedPhone,
    cnh_num,
    anoSelecionado,
    modeloSelecionado,
    marcaSelecionada,
    capacidade,
    comprimentoPlataforma,
    placa,
    valorSaida,
    valorPorKm
  } = params;

  // Se não houver parâmetros essenciais, retornar null
  if (!email || !password || !name) {
    return null;
  }

  const successAlert = () => {
    Toast.show({
      type: 'success',
      text1: 'Usuário cadastrado com sucesso',
      position: 'top',
      visibilityTime: 1500,
    });
  };

  const errorAlert = () => {
    Toast.show({
      type: 'error',
      text1: 'Erro ao cadastrar',
      text2: 'Verifique os dados e tente novamente',
      position: 'bottom',
      visibilityTime: 1500,
      bottomOffset: 300
    });
  };

  const handleSelectImage = async (setImage) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permissão necessária',
          text2: 'Precisamos acessar suas fotos para fazer o upload',
          position: 'bottom',
          visibilityTime: 2000,
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível selecionar a imagem',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const handleUpload = async (imagem, email) => {
    return await uploadFotoPorEmail(email, imagem);
  };

  const handleSignIn = async () => {
    console.log('=== INÍCIO DO CADASTRO ===');
    console.log('Dados recebidos:', {
      email,
      name,
      cpf: unmaskedCpf,
      phone: unmaskedPhone,
      cnh_num,
      anoSelecionado,
      modeloSelecionado,
      marcaSelecionada,
      capacidade,
      comprimentoPlataforma,
      placa,
      valorSaida,
      valorPorKm
    });

    if (!selectedFotoMotorista) {
      console.log('❌ Erro: Foto do motorista não selecionada');
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Selecione a foto do motorista!',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Iniciando upload da foto do motorista...');
      // Upload da foto do motorista
      const uploadFotoMotorista = await handleUpload(selectedFotoMotorista, email);
      console.log('✅ Upload da foto concluído:', uploadFotoMotorista);

      // Validação rigorosa do upload
      if (!uploadFotoMotorista?.success || !uploadFotoMotorista?.data?.fotoUrl) {
        console.log('❌ Erro: Upload da foto falhou:', uploadFotoMotorista);
        throw new Error('Falha ao enviar foto do motorista');
      }

      console.log('📝 Foto URL obtida:', uploadFotoMotorista.data.fotoUrl);

      // Cadastro do guincheiro
      const guincheiroPayload = {
        nome: name,
        cpf: unmaskedCpf,
        telefone: unmaskedPhone,
        email,
        senha: password,
        cnh_num: '25461235231',
        foto_url: uploadFotoMotorista.data.fotoUrl
      };

      console.log('👤 Cadastrando guincheiro com payload:', guincheiroPayload);
      const guincheiroRes = await registerGuincheiro(guincheiroPayload);
      console.log('✅ Guincheiro cadastrado com sucesso:', guincheiroRes);
      
      // Verificar diferentes formatos de resposta
      const guincheiroId = guincheiroRes?.id || guincheiroRes?.data?.id || guincheiroRes?.guincheiro?.id;
      console.log('🆔 ID do guincheiro:', guincheiroId);
      console.log('📋 Resposta completa do servidor:', JSON.stringify(guincheiroRes, null, 2));

      if (!guincheiroId) {
        console.error('❌ Erro: Resposta do servidor não contém ID:', JSON.stringify(guincheiroRes, null, 2));
        throw new Error('ID do guincheiro não foi retornado pelo servidor');
      }

      // Tratar ano (caso venha com textinho a mais)
      const ano = anoSelecionado 
        ? (typeof anoSelecionado === 'string' 
            ? anoSelecionado.slice(0, 4) 
            : String(anoSelecionado).slice(0, 4))
        : null;
      console.log('📅 Ano processado:', ano);

      if (!ano || isNaN(parseInt(ano))) {
        throw new Error('Ano de fabricação inválido');
      }

      // Cadastro do guincho
      // Remove hífen da placa para enviar apenas 7 caracteres (formato do banco)
      const placaLimpa = placa ? placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
      
      if (!placaLimpa || placaLimpa.length !== 7) {
        throw new Error('Placa inválida. Deve conter 7 caracteres');
      }
      
      // Validações adicionais antes de criar o guincho
      if (!marcaSelecionada || !modeloSelecionado) {
        throw new Error('Marca e modelo são obrigatórios');
      }

      if (!capacidade || isNaN(parseFloat(capacidade)) || parseFloat(capacidade) <= 0) {
        throw new Error('Capacidade inválida');
      }

      if (!comprimentoPlataforma || isNaN(parseFloat(comprimentoPlataforma)) || parseFloat(comprimentoPlataforma) <= 0) {
        throw new Error('Comprimento da plataforma inválido');
      }

      const guinchoPayload = {
        placa: placaLimpa,
        marca: marcaSelecionada,
        modelo: modeloSelecionado,
        ano_fabricacao: parseInt(ano),
        capacidade: parseFloat(capacidade),
        comprimento_plataforma: parseFloat(comprimentoPlataforma),
        guincheiro_id: guincheiroId
      };

      console.log('🚗 Cadastrando guincho com payload:', guinchoPayload);
      const guinchoRes = await createGuincho(guinchoPayload);
      console.log('✅ Guincho cadastrado com sucesso:', guinchoRes);

      // Validações antes de criar valores
      if (!valorSaida || isNaN(parseFloat(valorSaida)) || parseFloat(valorSaida) <= 0) {
        throw new Error('Valor da saída inválido');
      }

      if (!valorPorKm || isNaN(parseFloat(valorPorKm)) || parseFloat(valorPorKm) <= 0) {
        throw new Error('Valor por Km inválido');
      }

      // Cadastro dos valores do guincho na tabela ValoresGuincho
      const valoresPayload = {
        idGuincheiro: guincheiroId,
        valorSaida: parseFloat(valorSaida),
        valorKm: parseFloat(valorPorKm)
      };

      console.log('💰 Cadastrando valores do guincho com payload:', valoresPayload);
      const valoresRes = await criarValoresGuincho(valoresPayload);
      console.log('✅ Valores cadastrados com sucesso:', valoresRes);

      console.log('✅ === CADASTRO CONCLUÍDO COM SUCESSO ===');
      successAlert();

      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);

    } catch (error) {
      console.error('❌ === ERRO NO CADASTRO ===');
      console.error('Tipo do erro:', error?.constructor?.name);
      console.error('Mensagem do erro:', error?.message);
      console.error('Stack do erro:', error?.stack);
      console.error('Resposta completa do erro:', error?.response?.data || error);
      console.error('Status do erro:', error?.response?.status);
      console.error('=== FIM DO ERRO ===');
      
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: error?.response?.data?.error || error?.message || 'Verifique os dados e tente novamente',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 300
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <Logo />
        <Image source={require('../../assets/images/register.png')} />
        
        <Text style={styles.texto}>Cadastro da foto de perfil</Text>
        <Text style={styles.texto2}>
          Envie a imagem solicitada abaixo para validar sua conta GuinchAqui.
        </Text>

        <PhotoPicker 
          onPress={() => handleSelectImage(setSelectedFotoMotorista)} 
          name={'person-outline'} 
          label={'Foto do motorista'}
        />
        {selectedFotoMotorista && (
          <Image
            source={{ uri: selectedFotoMotorista.uri }}
            style={{ width: 120, height: 120, alignSelf: 'center', marginVertical: 10, borderRadius: 10 }}
          />
        )}

        <View style={{ width: '100%', alignItems: 'center', marginTop: 20, marginBottom: 30 }}>
          <Button 
            text={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : "Criar sua conta"} 
            onPress={handleSignIn} 
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
