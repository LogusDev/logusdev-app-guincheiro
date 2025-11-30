import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReceiptButton from "../../components/ReceiptButton/ReceiptButton";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import { Asset } from "expo-asset";

export default function ReceiptScreen({ route }) {
  const { receiptData } = route.params || {};

  const [hideButton, setHideButton] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [serrilhadoUri, setSerrilhadoUri] = useState(null);
  const [logoUri, setLogoUri] = useState(null);
  const [mapUri, setMapUri] = useState(null);
  const [driverPlaceholderUri, setDriverPlaceholderUri] = useState(null);

  const offscreenRef = useRef();
  const { width, height } = Dimensions.get("screen");

  // Formata horários e datas
  const startTime = receiptData?.requisitado_em
    ? new Date(receiptData.requisitado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const endTime = receiptData?.completado_em
    ? new Date(receiptData.completado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const date = receiptData?.requisitado_em
    ? new Date(receiptData.requisitado_em).toLocaleDateString("pt-BR")
    : "--/--/----";

  // Assets
  useEffect(() => {
    async function loadAssets() {
      const serrilhadoAsset = require("../../assets/images/serrilhado.png");
      const logoAsset = require("../../assets/images/logoguinchAqui.png");
      const mapAsset = require("../../assets/images/mapImage.png");
      const driverAsset = require("../../assets/images/userImage.png");

      const loaded = await Asset.loadAsync([serrilhadoAsset, logoAsset, mapAsset, driverAsset]);

      setSerrilhadoUri(loaded[0].localUri || loaded[0].uri);
      setLogoUri(loaded[1].localUri || loaded[1].uri);
      setMapUri(loaded[2].localUri || loaded[2].uri);
      setDriverPlaceholderUri(loaded[3].localUri || loaded[3].uri);
      setAssetsLoaded(true);
    }

    loadAssets();
  }, []);

  const renderPaymentMethod = (method) => {
    if (!method) return { iconName: "card-outline", label: "CARTÃO" };

    const lower = method.toLowerCase();
    let iconName = "card-outline";
    let label = "";

    switch (lower) {
      case "dinheiro":
        iconName = "cash-outline";
        label = "DINHEIRO";
        break;
      case "pix":
        iconName = "logo-bitcoin";
        label = "PIX";
        break;
      case "cartão":
      case "cartao":
        iconName = "card-outline";
        label = "CARTÃO";
        break;
      default:
        iconName = "card-outline";
        label = method.toUpperCase();
    }

    return { iconName, label };
  };

  const handleGeneratePDF = async () => {
    try {
      setHideButton(true);
      const base64 = await captureRef(offscreenRef, { format: "png", quality: 1, result: "base64" });
      const htmlContent = `
        <html>
          <head>
            <style>
              @page { margin: 10px; size: A4 portrait; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; background: #fff; }
              img { width: 90%; max-height: 120%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${base64}" />
          </body>
        </html>
      `;
      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfPath = FileSystem.documentDirectory + "recibo.pdf";
      await FileSystem.moveAsync({ from: pdfUri, to: pdfPath });
      await Sharing.shareAsync(pdfPath);
    } catch (error) {
      console.log("Erro ao gerar PDF:", error);
    } finally {
      setHideButton(false);
    }
  };

  const handleShareScreenshot = async () => {
    try {
      setHideButton(true);
      const uri = await captureRef(offscreenRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Erro ao compartilhar recibo:", error);
    } finally {
      setHideButton(false);
    }
  };

  const paymentInfo = renderPaymentMethod(receiptData?.metodo_pagamento);

  return (
    <ScrollView style={{ backgroundColor: "#F5F5F5" }}>
      {/* Botões de PDF e Share */}
      <View style={styles.receiptHeader}>
        {serrilhadoUri && <Image source={{ uri: serrilhadoUri }} style={styles.serrilhado} />}
        {!hideButton && <ReceiptButton onPDFPress={handleGeneratePDF} onSharePress={handleShareScreenshot} />}
      </View>

      {/* Logo */}
      <View style={styles.header}>{logoUri && <Image source={{ uri: logoUri }} style={styles.logo} />}</View>

      {/* Guincheiro */}
      <View style={styles.profileBox}>
        <Image
          source={
            receiptData?.guincheiro?.foto_url
              ? { uri: receiptData.guincheiro.foto_url }
              : driverPlaceholderUri
              ? { uri: driverPlaceholderUri }
              : null
          }
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{receiptData?.cliente?.nome || "Cliente"}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>
            {startTime} <Ionicons name="timer-outline" size={14} color="#1F284E" /> {endTime}
          </Text>
        </View>
      </View>

      {/* Mapa */}
      {mapUri && <Image source={{ uri: mapUri }} style={styles.map} />}

      {/* Veículo */}
      <View style={styles.vehicleBox}>
        <Text style={styles.vehicleName}>{(receiptData.veiculo?.modelo).split(" ").slice(0, 2).join(" ")}</Text>
        <Text style={styles.vehicleDetails}>{receiptData.veiculo?.marca}</Text>
        <Text style={styles.vehicleDetails}>
          {receiptData.veiculo?.ano_fabricacao}
        </Text>

        <View style={styles.paymentBox}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={paymentInfo.iconName} size={40} top={"-40%"} left={"80%"} color="#1F284E" />
              <Text style={[styles.paymentMethod, { marginLeft: 10 }]}>{paymentInfo.label}</Text>
            </View>
            <Text style={styles.price}>
              R$: <Text style={styles.priceValue}>{receiptData.preco}</Text>
            </Text>
          </View>
                </View>
        </View>

      {/* Endereços */}
      <View style={styles.addressContainer}>
        <View style={styles.addressBox}>
          <View style={styles.startAddressBox}>
            <Text style={styles.cityText}>{receiptData.endereco_inicial}</Text>
          </View>
          <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />
          <View style={styles.endAddressBox}>
            <Text style={styles.cityText}>{receiptData.endereco_final}</Text>
          </View>
        </View>
      </View>

      {/* Offscreen para gerar PDF */}
      <View
        ref={offscreenRef}
        collapsable={false}
        style={{ position: "absolute", top: -10000, left: -10000, width: width, backgroundColor: "#F5F5F5", paddingBottom: 20 }}
      >
        {/* Cabeçalho com serrilhado */}
        {serrilhadoUri && <Image source={{ uri: serrilhadoUri }} style={styles.serrilhado} />}
        {logoUri && (
          <View style={[styles.header, { marginBottom: 15 }]}>
            <Image source={{ uri: logoUri }} style={styles.logo} />
          </View>
        )}

        {/* Guincheiro / Cliente */}
        <View style={styles.profileBox}>
          <Image
            source={
              receiptData?.guincheiro?.foto_url
                ? { uri: receiptData.guincheiro.foto_url }
                : driverPlaceholderUri
                ? { uri: driverPlaceholderUri }
                : null
            }
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{receiptData?.cliente?.nome || "Cliente"}</Text>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.time}>
              {startTime} <Ionicons name="timer-outline" size={14} color="#1F284E" /> {endTime}
            </Text>
          </View>
        </View>

        {/* Mapa */}
        {mapUri && <Image source={{ uri: mapUri }} style={styles.map} />}

       {/* Veículo e pagamento */}
        <View style={[styles.vehicleBox, { paddingVertical: 10 }]}>
          <Text style={styles.vehicleName}>
            {(receiptData.veiculo?.modelo || "").split(" ").slice(0, 2).join(" ")}
          </Text>
          <Text style={styles.vehicleDetails}>{receiptData.veiculo?.marca}</Text>
          <Text style={styles.vehicleDetails}>{receiptData.veiculo?.ano_fabricacao}</Text>

          {/* Caixa de pagamento e preço */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            {/* Método de pagamento */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={paymentInfo.iconName} size={40} color="#1F284E" />
              <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: "600", color: "#1F284E" }}>
                {paymentInfo.label}
              </Text>
            </View>

            {/* Preço */}
            <Text style={{ fontSize: 21, fontWeight: "bold", color: "#1F284E" }}>
              R$: <Text style={{ color: "green" }}>{receiptData.preco}</Text>
            </Text>
          </View>
        </View>

        {/* Endereços */}
        <View style={styles.addressContainer}>
          <View style={styles.addressBox}>
            <View style={styles.startAddressBox}>
              <Text style={styles.cityText}>{receiptData.endereco_inicial}</Text>
            </View>
            <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />
            <View style={styles.endAddressBox}>
              <Text style={styles.cityText}>{receiptData.endereco_final}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    top: "20%",
    margin: "auto",
    width: 250,
    height: 50,
    resizeMode: "contain",
  },

  profileBox: {
    top: "-1%",
    left: "2%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },

  avatar: {
    top: 20,
    width: 65,
    height: 65,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#1F284E",
    marginRight: 12,
  },

  profileInfo: {
    flex: 1,
  },

  userName: {
    top: "50%",
    maxWidth: "60%",
    fontSize: 23,
    fontWeight: "700",
    color: "#1F284E",
  },

  date: {
    top: "20%",
    left: "64%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    textDecorationLine: "underline",
  },

  time: {
    top: "35%",
    left: "58%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    marginTop: 4,
  },

  map: {
    top: "-2%",
    width: "85%",
    height: 380,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000ff",
    marginVertical: 15,
    alignSelf: "center",
  },

  vehicleBox: {
    top: "-3%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  vehicleName: {
    left: "6%",
    fontSize: 16,
    fontWeight: "700",
    color: "#1F284E",
  },

  vehicleDetails: {
    left: "6%",
    fontSize: 13,
    fontWeight: "700",
    color: "#1F284E",
  },

  paymentBox: {
    top: "-56%",
    left: "21%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },

  paymentMethod: {
    top: "-45%",
    left: "75%",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#1F284E",
  },

  price: {
    left: "-7%",
    top: "60%",
    fontSize: 21,
    fontWeight: "bold",
    color: "#1F284E",
  },

  priceValue: {
    color: "green",
  },

  addressContainer: {
    marginTop: -70,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1F284E",
    borderRadius: 5,
    padding: 12,
  },

  addressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  startAddressBox: {
    width: "40%",
  },

  endAddressBox: {
    width: "40%",
    alignItems: "flex-end",
  },

  cityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F284E",
  },

  serrilhado: {
    left: "-7.5%",
    marginTop: -110,
    width: "220%",
    height: 180,
    alignSelf: "center",
    color: "#ffffffff",
    resizeMode: "cover",
  },

  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
