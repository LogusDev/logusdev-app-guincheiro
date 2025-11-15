import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import TextInputComponent from "../../components/TextInput";
import Button from "../../components/Button";
import styles from "../CadastroGuincho/styles";
import PickerSelect from "../../components/PickerSelect";
import axios from "axios";
import Logo from "../../components/Logo";

export default function CadastroGuincho({ navigation }) {
  const [guinchos, setGuinchos] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);

  const [capacidade, setCapacidade] = useState("");
  const [comprimentoPlataforma, setComprimentoPlataforma] = useState("");
  const [capacidadeValue, setCapacidadeValue] = useState(""); 

  useEffect(() => {
    axios.get("http://192.168.15.9:3333/guinchos")
      .then(res => {
        setGuinchos(res.data);

        const marcasUnicas = [...new Set(res.data.map(g => g.marca))];
        setMarcas(marcasUnicas.map(m => ({ label: m, value: m })));
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (marcaSelecionada) {
      const modelosFiltrados = guinchos
        .filter(g => g.marca === marcaSelecionada)
        .map(g => g.modelo);
      const modelosUnicos = [...new Set(modelosFiltrados)];
      setModelos(modelosUnicos.map(m => ({ label: m, value: m })));

      setModeloSelecionado(null);
      setAnoSelecionado(null);
      setCapacidade("");
      setComprimentoPlataforma("");
    }
  }, [marcaSelecionada]);

  useEffect(() => {
    if (modeloSelecionado) {
      const anosFiltrados = guinchos
        .filter(g => g.marca === marcaSelecionada && g.modelo === modeloSelecionado)
        .map(g => g.ano_fabricacao);
      const anosUnicos = [...new Set(anosFiltrados)];
      setAnos(anosUnicos.map(a => ({ label: String(a), value: a })));

      setAnoSelecionado(null);
      setCapacidade("");
      setComprimentoPlataforma("");
    }
  }, [modeloSelecionado]);

  useEffect(() => {
    if (anoSelecionado) {
      const guinchoSelecionado = guinchos.find(
        g => g.marca === marcaSelecionada &&
             g.modelo === modeloSelecionado &&
             g.ano_fabricacao === anoSelecionado
      );

      if (guinchoSelecionado) {
        setCapacidadeValue(String(guinchoSelecionado.capacidade));
        setComprimentoPlataforma(String(guinchoSelecionado.comprimento_plataforma));
      }
    }
  }, [anoSelecionado]);

  function handleSignIn() {
    if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    console.log({
      marcaSelecionada,
      modeloSelecionado,
      anoSelecionado,
      capacidade,
      comprimentoPlataforma
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <StatusBar barStyle="light-content" />
        <Logo />
        <Image style={{ height: 270, width: 270 }} source={require("../../assets/images/register.png")} />
        <Text style={styles.texto}>Dados do veículo</Text>

        <PickerSelect
          placeholder={{ label: "Selecione a marca...", value: null }}
          items={marcas}
          value={marcaSelecionada}
          name={"car-sport-outline"}
          onValueChange={setMarcaSelecionada}
        />

        <PickerSelect
          placeholder={{ label: "Selecione o modelo...", value: null }}
          items={modelos}
          value={modeloSelecionado}
          name={"car-outline"}
          onValueChange={setModeloSelecionado}
        />

        <PickerSelect
          placeholder={{ label: "Selecione o ano...", value: null }}
          items={anos}
          value={anoSelecionado}
          name={"calendar-outline"}
          onValueChange={setAnoSelecionado}
        />

        <TextInputComponent
            placeholder="Capacidade (Kg)"
            placeholderTextColor="#999999"
            value={capacidadeValue ? `${capacidadeValue} kg` : ''}
            onChangeText={(text) => {
            const numeric = text.replace(/[^0-9.]/g,'');
            setCapacidadeValue(numeric);
        }}
        />

        <TextInputComponent
            placeholder="Comprimento da plataforma (m)"
            name="resize-outline"
            value={comprimentoPlataforma}
            onChangeText={(text) => {
                let numeric = text.replace(/[^0-9.]/g, '');
                if (numeric.includes('.')) {
                const parts = numeric.split('.');
                numeric = parts[0] + '.' + parts[1].slice(0, 2);
                }

                setComprimentoPlataforma(numeric ? `${numeric} m` : '');
            }}
            keyboardType="numeric"
            placeholderTextColor="#999999"
        />


        <Button style={{ marginTop: 12 }} text={"Próximo"} onPress={handleSignIn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
