import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import TextInputComponent from "../../components/TextInput";
import Button from "../../components/Button";
import styles from "./styles";
import Logo from "../../components/Logo";

export default function CadastroPrecos({ navigation, route }) {
  const [valorSaida, setValorSaida] = useState("");
  const [valorPorKm, setValorPorKm] = useState("");

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
    placa
  } = route.params;

  // Função para formatar valor monetário brasileiro (R$)
  const formatarValor = (text) => {
    // Remove tudo que não é número (inclui R$, espaços, etc)
    let numeric = text.replace(/[^0-9]/g, '');
    
    // Se estiver vazio, retorna vazio
    if (numeric === '') return '';
    
    // Converte para número e divide por 100 para ter centavos
    const valor = parseFloat(numeric) / 100;
    
    // Formata como moeda brasileira
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para exibir valor com R$
  const exibirValor = (valor) => {
    if (!valor || valor === '') return '';
    return `R$ ${valor}`;
  };

  // Função para converter valor formatado de volta para número
  const parseValor = (text) => {
    // Remove R$, espaços e formatação, mantém apenas números
    const numeric = text.replace(/[^0-9]/g, '');
    if (numeric === '') return '0';
    // Converte centavos para reais
    return (parseFloat(numeric) / 100).toString();
  };

  function handleSignIn() {
    if (!valorSaida || !valorPorKm || valorSaida.trim() === '' || valorPorKm.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Preencha todos os campos obrigatórios!',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    const valorSaidaNum = parseFloat(parseValor(valorSaida));
    const valorPorKmNum = parseFloat(parseValor(valorPorKm));

    if (isNaN(valorSaidaNum) || valorSaidaNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Valor da saída deve ser maior que zero!',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    if (isNaN(valorPorKmNum) || valorPorKmNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Valor por Km deve ser maior que zero!',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    navigation.navigate("CadastroDocumentos", {
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
      valorSaida: valorSaidaNum,
      valorPorKm: valorPorKmNum
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <Logo />
        <Image style={{ height: 270, width: 270 }} source={require("../../assets/images/register.png")} />
        <Text style={styles.texto}>Minha tabela de preços</Text>

        <TextInputComponent
          placeholder="Valor da Saída..."
          name="cash-outline"
          value={exibirValor(valorSaida)}
          onChangeText={(text) => {
            const formatted = formatarValor(text);
            setValorSaida(formatted);
          }}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <TextInputComponent
          placeholder="Valor por Km..."
          name="cash-outline"
          value={exibirValor(valorPorKm)}
          onChangeText={(text) => {
            const formatted = formatarValor(text);
            setValorPorKm(formatted);
          }}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />

        <Text style={styles.texto2}>
          Esses valores podem ser alterados nas configurações do aplicativo.
        </Text>

        <Button style={{ marginTop: 12, marginBottom: 30 }} text={"Próximo"} onPress={handleSignIn} />
      </KeyboardAwareScrollView>
    </View>
  );
}

