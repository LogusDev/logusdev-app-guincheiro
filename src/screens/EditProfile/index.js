import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import styles from './styles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { DriverContext } from '../../contexts/DriverContext';
import { updateDriver } from '../../services/services';
import { mask } from 'react-native-mask-text';
import unmaskFunc from '../../utils/mask';

export default function EditProfile() {
    const { driver } = useContext(DriverContext);
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (driver) {
            setEmail(driver.email);
            setTelefone(mask(driver.telefone, '(99) 99999-9999'));
        }
    }, [driver]);

    function maskPhone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');

        if (cleaned.length > 10) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    const handleCelChange = (text) => {
        const masked = mask(text, '(99) 99999-9999');
        setTelefone(masked);
    };

    const handleUpdate = async () => {
        const unmaskedPhone = unmaskFunc(telefone);
        const id = driver.id;

        if (!telefone || !email) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro', 'E-mail inválido');
            return;
        }

        try {
            const driverData = {
                telefone: unmaskedPhone,
                email
            };

            await updateDriver(id, driverData);
            Alert.alert('Sucesso', 'Credenciais atualizadas com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar', error);
            Alert.alert('Erro', error.message || 'Erro ao atualizar');
        }
    };

    if (!driver) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />

                    <View style={styles.viewTitle}>
                        <Text style={styles.title}>Editar Perfil</Text>
                    </View>

                    <Image
                        source={{ uri: driver.foto_url }}
                        style={styles.avatar}
                    />

                    {/* Nome */}
                    <TextInput
                        size={25}
                        style={styles.textInput}
                        value={driver.nome}
                        name="person-circle-outline"
                        readOnly
                    />

                    {/* Email */}
                    <TextInput
                        size={25}
                        style={styles.textInputMail}
                        value={email}
                        placeholder="E-mail"
                        name="mail-outline"
                        onChangeText={setEmail}
                    />

                    {/* Telefone */}
                    <TextInput
                        size={25}
                        style={styles.textInputPhone}
                        value={telefone}
                        placeholder={maskPhone(driver.telefone)}
                        name="call-outline"
                        keyboardType="numeric"
                        onChangeText={handleCelChange}
                    />

                    <Button
                        text="Confirmar"
                        onPress={handleUpdate}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
