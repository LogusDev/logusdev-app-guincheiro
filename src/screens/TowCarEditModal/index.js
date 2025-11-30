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
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./style";
import { DriverContext } from "../../contexts/DriverContext";
import { updateGuincho } from "../../services/services";

export default function TowCarEditModal({ visible, onClose, guincho, onSave }) {
  const { driver } = useContext(DriverContext);

  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [comprimento, setComprimento] = useState("");


  useEffect(() => {
    if (guincho) {
      setPlaca(guincho.placa || "");
      setMarca(guincho.marca || "");
      setModelo(guincho.modelo || "");
      setAnoFabricacao(guincho.ano_fabricacao?.toString() || "");
      setCapacidade(guincho.capacidade?.toString() || "");
      setComprimento(guincho.comprimento_plataforma?.toString() || "");
    }
  }, [guincho, visible]);

  const handleSave = async () => {
    if (!placa || !marca || !modelo || !anoFabricacao || !capacidade || !comprimento) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const data = {
      placa,
      marca,
      modelo,
      ano_fabricacao: parseInt(anoFabricacao),
      capacidade: parseFloat(capacidade),
      comprimento_plataforma: parseFloat(comprimento),
      guincheiro_id: driver.id,
    };

    try {
      const updated = await updateGuincho(guincho.id, data, driver.token);

      if (onSave) {
        onSave({
          ...guincho,
          ...data,
        });
      }

      onClose();
    } catch (err) {
      console.log("Erro ao atualizar guincho:", err);
      Alert.alert("Erro", "Não foi possível atualizar o guincho.");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Editar Guincho</Text>

            {/* Placa */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Placa"
                value={placa}
                onChangeText={(text) => {
                  let formatted = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                  if (formatted.length > 3)
                    formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
                  if (formatted.length > 8) formatted = formatted.slice(0, 8);
                  setPlaca(formatted);
                }}
                maxLength={8}
              />
              <Icon name="pricetag-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Marca */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Marca"
                value={marca}
                onChangeText={setMarca}
              />
              <Icon name="business-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Modelo */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Modelo"
                value={modelo}
                onChangeText={setModelo}
              />
              <Icon name="car-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Ano de Fabricação */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Ano de Fabricação"
                keyboardType="numeric"
                value={anoFabricacao}
                onChangeText={setAnoFabricacao}
                maxLength={4}
              />
              <Icon name="calendar-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Capacidade */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Capacidade (kg)"
                keyboardType="numeric"
                value={capacidade}
                onChangeText={setCapacidade}
              />
              <Icon name="speedometer-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Comprimento da Plataforma */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Comprimento da Plataforma (m)"
                keyboardType="numeric"
                value={comprimento}
                onChangeText={setComprimento}
              />
              <Icon name="swap-horizontal-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
            </View>

            {/* Botões */}
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
