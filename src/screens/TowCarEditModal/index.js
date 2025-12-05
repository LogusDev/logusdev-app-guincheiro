import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../../components/Button";
import PickerSelect from "../../components/PickerSelect";
import { Ionicons } from "@expo/vector-icons";
import styles from "./style";
import api from "../../services/api";
import { DriverContext } from "../../contexts/DriverContext";
import { updateGuincho } from "../../services/services";

export default function TowCarEditModal({ visible, onClose, guincho, onSave }) {
  const { driver } = useContext(DriverContext);

  const [listaCompleta, setListaCompleta] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [placa, setPlaca] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [comprimento, setComprimento] = useState("");

  // Limpa os campos quando o modal fecha
  useEffect(() => {
    if (!visible) {
      setMarcaSelecionada(null);
      setModeloSelecionado(null);
      setPlaca("");
      setAnoFabricacao("");
      setCapacidade("");
      setComprimento("");
      setModelos([]);
      return;
    }

    if (visible && guincho) {
      let placaFormatada = guincho.placa || "";
      if (placaFormatada && !placaFormatada.includes("-")) {
        placaFormatada = placaFormatada.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (placaFormatada.length > 3) {
          placaFormatada = placaFormatada.slice(0, 3) + "-" + placaFormatada.slice(3);
        }
      }

      setPlaca(placaFormatada);
      setAnoFabricacao(guincho.ano_fabricacao?.toString() || "");
      setCapacidade(guincho.capacidade?.toString() || "");
      setComprimento(guincho.comprimento_plataforma?.toString() || "");
    }
  }, [visible, guincho]);

  // Buscar marcas e modelos
  useEffect(() => {
    if (visible) {
      api
        .get("/guinchos/modelos")
        .then((res) => {
          setListaCompleta(res.data);

          const marcasList = [...new Set(res.data.map((e) => e.marca))].map((m) => ({ label: m, value: m }));
          setMarcas(marcasList);

          if (guincho?.marca) {
            setMarcaSelecionada(guincho.marca);
          }
        })
        .catch((err) => console.log("Erro ao carregar modelos:", err));
    }
  }, [visible]);

  // Carrega modelos quando a marca muda
  useEffect(() => {
    if (!marcaSelecionada) {
      setModelos([]);
      setModeloSelecionado(null);
      return;
    }

    const filtrados = listaCompleta
      .filter((e) => e.marca === marcaSelecionada)
      .map((e) => ({ label: e.modelo, value: e.modelo }));

    setModelos(filtrados);

    if (guincho?.modelo) {
      setModeloSelecionado(guincho.modelo);
    }
  }, [marcaSelecionada, listaCompleta]);

  // Auto-preencher campos
  useEffect(() => {
    if (modeloSelecionado && listaCompleta.length > 0 && guincho?.modelo !== modeloSelecionado) {
      const info = listaCompleta.find(
        (e) => e.marca === marcaSelecionada && e.modelo === modeloSelecionado
      );

      if (info) {
        setAnoFabricacao(info.ano_fabricacao?.toString() || "");
        setCapacidade(info.capacidade?.toString() || "");
        setComprimento(info.comprimento_plataforma?.toString() || "");
      }
    }
  }, [modeloSelecionado]);

  const handleSave = async () => {
    if (!marcaSelecionada || !modeloSelecionado || !placa.trim()) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Preencha todos os campos.",
        position: "top",
        visibilityTime: 2000,
      });  
      return;
    }

    const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const data = {
      placa: placaLimpa,
      marca: marcaSelecionada,
      modelo: modeloSelecionado,
      ano_fabricacao: parseInt(anoFabricacao),
      capacidade: parseFloat(capacidade),
      comprimento_plataforma: parseFloat(comprimento),
      guincheiro_id: driver.id,
    };

    try {
      await updateGuincho(guincho.id, data);

      if (onSave) onSave({ ...guincho, ...data });

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Guincho atualizado com sucesso!",
        position: "top",
        visibilityTime: 2000,
      });

      onClose();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao atualizar.",
      });
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#666" pointerEvents="none" />
            </TouchableOpacity>

            <Text style={styles.title}>Editar Guincho</Text>

            {/* Marca */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Marca do guincho...", value: null }}
                items={marcas}
                value={marcaSelecionada}
                onValueChange={setMarcaSelecionada}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"car-sport-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Modelo */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Modelo...", value: null }}
                items={modelos}
                value={modeloSelecionado}
                onValueChange={setModeloSelecionado}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"car-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Ano */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Ano de Fabricação"
                placeholderTextColor="#888"
                value={anoFabricacao}
                onChangeText={setAnoFabricacao}
              />
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#b9b9b9ff"
                style={styles.iconStyleRight}
                pointerEvents="none"
              />
            </View>

            {/* Capacidade */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Capacidade (kg)"
                placeholderTextColor="#888"
                value={capacidade}
                onChangeText={setCapacidade}
              />
              <Ionicons
                name="scale-outline"
                size={24}
                color="#b9b9b9ff"
                style={styles.iconStyleRight}
                pointerEvents="none"
              />
            </View>

            {/* Comprimento */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Comprimento da Plataforma (m)"
                placeholderTextColor="#888"
                value={comprimento}
                onChangeText={setComprimento}
              />
              <Ionicons
                name="resize-outline"
                size={24}
                color="#b9b9b9ff"
                style={styles.iconStyleRight}
                pointerEvents="none"
              />
            </View>

            {/* Placa */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Placa"
                placeholderTextColor="#999"
                value={placa}
                onChangeText={(text) => {
                  let formatted = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                  if (formatted.length > 3) formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
                  if (formatted.length > 8) formatted = formatted.slice(0, 8);
                  setPlaca(formatted);
                }}
                maxLength={8}
                autoCapitalize="characters"
              />
              <Ionicons
                name="key-outline"
                size={24}
                color="#b9b9b9ff"
                style={styles.iconStyleRight}
                pointerEvents="none"
              />
            </View>

            <Button style={styles.button} text="Salvar" onPress={handleSave} />

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
