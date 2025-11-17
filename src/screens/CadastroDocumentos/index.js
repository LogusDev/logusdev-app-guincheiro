// import React, { useState, useContext } from 'react';
// import { View, Alert, ActivityIndicator, StatusBar, Image, Text } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Toast from 'react-native-toast-message';

// import styles from './styles.js';
// import Button from '../../components/Button/index.js';
// import PhotoPicker from '../../components/PhotoPicker/index.js';
// import Logo from '../../components/Logo/index.js';

// import { uploadFotoPorEmail } from '../../services/upload.js';
// import { registerUser, createVehicle } from '../../services/services.js';

// export default function CadastroDocumentos({ route, navigation }) {
  
//   const {
//     email,
//     password,
//     name,
//     cpf: unmaskedCpf,
//     phone: unmaskedPhone,
//     cnh_num,
//     anoSelecionado,
//     modeloSelecionado,
//     marcaSelecionada,
//     capacidadeValue,
//     comprimentoPlataforma
//   } = route.params;

//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const successAlert = () => {
//     Toast.show({
//       type: 'success',
//       text1: 'Usuário cadastrado com sucesso',
//       position: 'top',
//       visibilityTime: 1500,
//     });
//   };

//   const errorAlert = () => {
//     Toast.show({
//       type: 'error',
//       text1: 'Erro ao cadastrar',
//       text2: 'Verifique os dados e tente novamente',
//       position: 'bottom',
//       visibilityTime: 1500,
//       bottomOffset: 300
//     });
//   };

//   // Seleção da imagem
//   const handleSelectImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos para continuar');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets?.[0]) {
//       setSelectedImage(result.assets[0]);
//     }
//   };

//   // Upload da foto
//   const handleUpload = async (imagem) => {
//     return await uploadFotoPorEmail(email, imagem);
//   };

//   // Finalizar cadastro
//   const handleSignIn = async () => {
//     if (!selectedImage) {
//       Alert.alert('Selecione uma imagem antes de cadastrar!');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Upload da foto
//       const uploadResult = await handleUpload(selectedImage);

//       if (!uploadResult || !uploadResult.success || !uploadResult.data?.fotoUrl) {
//         Alert.alert('Erro no Upload', 'Falha ao enviar a foto. Tente novamente.');
//         setIsLoading(false);
//         return;
//       }

//       // Cadastro do usuário
//       const userPayload = {
//         nome: name,
//         cpf: unmaskedCpf,
//         telefone: unmaskedPhone,
//         email,
//         senha: password,
//         cnh_num: cnh_num,
//         foto_url: uploadResult.data.fotoUrl
//       };

//       const userRes = await registerUser(userPayload);
//       const id = userRes.id;

//       // Tratar ano (caso venha com textinho a mais)
//       const ano = anoSelecionado.slice(0, 4);

//       // Cadastro do guincho
//       const vehiclePayload = {
//         placa: "ABC1234", 
//         marca: marcaSelecionada,
//         modelo: modeloSelecionado,
//         ano_fabricacao: ano,
//         capacidade: capacidadeValue,
//         comprimento: comprimentoPlataforma,
//         cliente_id: id
//       };

//       await createVehicle(vehiclePayload);

//       successAlert();

//       navigation.navigate('Login', {
//         fotoUrl: uploadResult.data.fotoUrl
//       });

//     } catch (error) {
//       console.error('Erro ao cadastrar:', error);
//       errorAlert();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={'light-content'} />
      
//       <Logo />
//       <Image source={require('../../assets/images/register.png')} />

//       <Text style={styles.texto}>Verificação de documentos</Text>
//       <Text style={styles.texto2}>
//         Envie a foto solicitada abaixo para validar sua conta como Guincheiro.
//       </Text>

//       <PhotoPicker onPress={handleSelectImage} name={'albums-outline'} />

//       {selectedImage && (
//         <Image
//           source={{ uri: selectedImage.uri }}
//           style={{
//             width: 120,
//             height: 120,
//             alignSelf: 'center',
//             marginVertical: 10,
//             borderRadius: 10
//           }}
//         />
//       )}

//       <Button
//         text={isLoading ? <ActivityIndicator size="small" color="#fff" /> : "Cadastrar"}
//         onPress={handleSignIn}
//       />
//     </View>
//   );
// }
