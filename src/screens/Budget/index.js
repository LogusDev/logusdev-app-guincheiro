import React, { useState, useEffect, useContext } from "react";
import { View, Text, StatusBar, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import TextInputComponent from "../../components/TextInput";
import Button from "../../components/Button";
import styles from "./styles";
import { DriverContext } from "../../contexts/DriverContext";
import { getValorAtual, updateValoresGuincho } from "../../services/towCarValues";

export default function Budget() {
  const { driver, token } = useContext(DriverContext);
  const [valorSaida, setValorSaida] = useState("");
  const [valorKm, setValorKm] = useState("");
  const [valorId, setValorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const exibirValor = (valor) => (valor ? `R$ ${parseFloat(valor).toFixed(2)}` : "");

  const parseValor = (text) => {
    const numeric = text.replace(/[^0-9]/g, "");
    return numeric ? (parseFloat(numeric) / 100).toString() : "0";
  };

  useEffect(() => {
    async function fetchValores() {
      if (!driver || !token) return;
      try {
        setLoading(true);
        const valorAtual = await getValorAtual(driver.id, token);
        console.log("Dados recebidos: ", valorAtual)
        setValorSaida(valorAtual.valorSaida.toString());
        setValorKm(valorAtual.valorKm.toString());
        setValorId(valorAtual.idValor);
        console.log("Valor Id:", valorAtual.idValor);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os valores.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchValores();
  }, [driver, token]);

  const handleSave = async () => {
    if (!valorSaida || !valorKm) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Preencha todos os campos!",
      });
      return;
    }

    try {
      await updateValoresGuincho(valorId, token, {
        // valorSaida: parseFloat(parseValor(valorSaida)),
        // valorKm: parseFloat(parseValor(valorKm)),
        valorSaida: Number(valorSaida.replace(',', '.')),
        valorKm: Number(valorKm.replace(',', '.')),
      });

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Valores atualizados com sucesso!",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar os valores.",
      });
    }
  };

  if (loading) return <Text style={{ textAlign: "center", marginTop: 20 }}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >

    <Image style={{ height: 270, width: 270 }} source={require("../../assets/images/register.png")} />

        <Text style={styles.texto}>Minha tabela de preços</Text>

        <TextInputComponent
          placeholder="Valor da Saída..."
          value={exibirValor(valorSaida)}
          onChangeText={(text) => setValorSaida(parseValor(text))}
          keyboardType="numeric"
        />

        <TextInputComponent
          placeholder="Valor por Km..."
          value={exibirValor(valorKm)}
          onChangeText={(text) => setValorKm(parseValor(text))}
          keyboardType="numeric"
        />

        <Text style={styles.texto2}>
          Esses valores podem ser alterados a qualquer momento.
        </Text>

        <Button text="Salvar" onPress={handleSave} />
      </KeyboardAwareScrollView>
    </View>
  );
}
