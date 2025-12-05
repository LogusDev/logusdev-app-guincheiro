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
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../../components/Button";
import PickerSelect from "../../components/PickerSelect";
import styles from "./style";
import api from "../../services/api";
import { DriverContext } from "../../contexts/DriverContext";
import { createGuincho } from "../../services/services";

export default function TowCarAddModal({ visible, onClose, onSave }) {
  const { driver } = useContext(DriverContext);

  const [listaCompleta, setListaCompleta] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [marca, setMarca] = useState(null);
  const [modelo, setModelo] = useState(null);

  const [ano, setAno] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [placa, setPlaca] = useState("");



const resetFields = () => {
  setMarca(null);
  setModelo(null);
  setAno("");
  setCapacidade("");
  setComprimento("");
  setPlaca("");
};

useEffect(() => {
  if (!visible) {
    resetFields();
  }
}, [visible]);


  useEffect(() => {
    if (visible) {
      api.get("/guinchos/modelos")
        .then(res => {
          setListaCompleta(res.data);

          // Apenas marcas
          setMarcas(
            [...new Set(res.data.map(e => e.marca))]
              .map(m => ({ label: m, value: m }))
          );
        })
        .catch(err => console.log("Erro ao carregar modelos:", err));
    }
  }, [visible]);


  useEffect(() => {
    if (marca) {
      setModelo(null);
      setAno("");
      setCapacidade("");
      setComprimento("");

      const filtrados = listaCompleta
        .filter(e => e.marca === marca)
        .map(e => ({ label: e.modelo, value: e.modelo }));

      setModelos(filtrados);
    }
  }, [marca]);


  useEffect(() => {
    if (modelo && listaCompleta.length > 0) {
      const info = listaCompleta.find(e => e.modelo === modelo);

      if (info) {
        setAno(info.ano_fabricacao?.toString() || "");
        setCapacidade(info.capacidade?.toString() || "");
        setComprimento(info.comprimento_plataforma?.toString() || "");
      }
    }
  }, [modelo, listaCompleta]);

  const handlePlaca = (t) => {
    let tx = t.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (tx.length > 3) tx = tx.slice(0, 3) + "-" + tx.slice(3);
    if (tx.length > 8) tx = tx.slice(0, 8);
    setPlaca(tx);
  };

  const handleSave = async () => {
    if (!driver?.id) {
      Alert.alert("Erro", "Dados do guincheiro não encontrados.");
      return;
    }

    if (!marca || !modelo || !placa.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    // Remove hífen da placa para enviar apenas 7 caracteres
    const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const payload = {
      placa: placaLimpa,
      marca,
      modelo,
      ano_fabricacao: parseInt(ano) || 0,
      capacidade: parseFloat(capacidade) || 0,
      comprimento_plataforma: parseFloat(comprimento) || 0,
      guincheiro_id: driver.id,
    };

    try {
      const novoGuincho = await createGuincho(payload);
      if (onSave) onSave(novoGuincho);
      onClose();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível adicionar o guincho.");
      console.log(err);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>

            <Text style={styles.title}>Adicionar Guincho</Text>

            {/* Marca */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Escolha a marca...", value: null }}
                items={marcas}
                value={marca}
                onValueChange={setMarca}
                name="car-outline"
                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: styles.textInput,
                }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Modelo */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Escolha o modelo...", value: null }}
                items={modelos}
                value={modelo}
                onValueChange={setModelo}
                name="hardware-chip-outline"
                style={{
                  inputIOS: styles.textInput,
                  inputAndroid: styles.textInput,
                }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Ano (automático) */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Ano"
                placeholderTextColor="#888"
                value={ano}
                editable={false}
              />
              <Icon name="calendar-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Capacidade (automático) */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Capacidade (ton)"
                placeholderTextColor="#888"
                value={capacidade}
                editable={false}
              />
              <Icon name="speedometer-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Comprimento (automático) */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Comprimento (m)"
                placeholderTextColor="#888"
                value={comprimento}
                editable={false}
              />
              <Icon name="resize-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Placa */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Placa"
                placeholderTextColor="#888"
                value={placa}
                onChangeText={handlePlaca}
                maxLength={8}
              />
              <Icon name="pricetag-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
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
