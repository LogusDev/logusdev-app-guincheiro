import React from 'react';
import { View, Text, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';

export default function ArrivalConfirmation({
    visible,
    onConfirm,
    clienteInfo,
    endereco,
    isEnderecoInicial,
    vehicle,
    clienteConfirmou,
    guincheiroConfirmou,
}) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {}}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        {/* Título */}
                        <Text style={styles.title}>
                            {isEnderecoInicial 
                                ? 'Chegou ao endereço inicial?' 
                                : 'Chegou ao endereço final?'}
                        </Text>

                        {/* Informações do Cliente */}
                        <View style={styles.clienteSection}>
                            <Image
                                style={styles.clienteImage}
                                source={
                                    clienteInfo?.foto_url 
                                        ? { uri: clienteInfo.foto_url } 
                                        : require('../../assets/images/profileIcon.png')
                                }
                            />
                            <Text style={styles.clienteName}>
                                {clienteInfo?.nome || 'Cliente'}
                            </Text>
                        </View>

                        {/* Endereço */}
                        <View style={styles.enderecoSection}>
                            <Ionicons 
                                name="location" 
                                size={24} 
                                color="#FFA500" 
                                style={styles.icon}
                            />
                            <View style={styles.enderecoTextContainer}>
                                <Text style={styles.enderecoNome}>
                                    {endereco?.titulo || (endereco?.endereco?.includes('-') 
                                        ? endereco.endereco.split('-')[0].trim() 
                                        : endereco?.endereco?.split(',')[0] || 'Endereço')}
                                </Text>
                                <Text style={styles.enderecoCompleto} numberOfLines={2}>
                                    {endereco?.endereco?.includes('-')
                                        ? endereco.endereco.split('-').slice(1).join('-').trim()
                                        : endereco?.endereco || 'Endereço não disponível'}
                                </Text>
                            </View>
                        </View>

                        {/* Informações do Veículo */}
                        {vehicle && (
                            <View style={styles.vehicleSection}>
                                <Ionicons 
                                    name="car" 
                                    size={24} 
                                    color="#E74C3C" 
                                    style={styles.icon}
                                />
                                <View style={styles.vehicleTextContainer}>
                                    <Text style={styles.vehicleModel}>
                                        {vehicle.modelo || vehicle.model || 'Veículo'}
                                    </Text>
                                    <Text style={styles.vehicleDetails}>
                                        {vehicle.marca || vehicle.brand || ''} {vehicle.ano || vehicle.year || ''} / {vehicle.placa || vehicle.licensePlate || '***-****'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Status das Confirmações */}
                        <View style={styles.confirmationsStatus}>
                            <View style={styles.confirmationItem}>
                                <Ionicons 
                                    name={clienteConfirmou ? "checkmark-circle" : "ellipse-outline"} 
                                    size={20} 
                                    color={clienteConfirmou ? "#4CAF50" : "#999"} 
                                />
                                <Text style={styles.confirmationText}>
                                    Cliente {clienteConfirmou ? 'confirmou' : 'aguardando'}
                                </Text>
                            </View>
                            <View style={styles.confirmationItem}>
                                <Ionicons 
                                    name={guincheiroConfirmou ? "checkmark-circle" : "ellipse-outline"} 
                                    size={20} 
                                    color={guincheiroConfirmou ? "#4CAF50" : "#999"} 
                                />
                                <Text style={styles.confirmationText}>
                                    Você {guincheiroConfirmou ? 'confirmou' : 'aguardando'}
                                </Text>
                            </View>
                        </View>

                        {/* Botão Confirmar */}
                        <Button
                            text={guincheiroConfirmou ? "Aguardando cliente..." : "Confirmar"}
                            onPress={guincheiroConfirmou ? () => {} : onConfirm}
                            style={[styles.confirmButton, guincheiroConfirmou && styles.confirmButtonDisabled]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '80%',
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F284E',
        marginBottom: 20,
        textAlign: 'center',
    },
    clienteSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    clienteImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
        borderColor: '#A5A5A5',
        borderWidth: 2,
    },
    clienteName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F284E',
    },
    enderecoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    vehicleSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    icon: {
        marginRight: 12,
        marginTop: 2,
    },
    enderecoTextContainer: {
        flex: 1,
    },
    enderecoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F284E',
        marginBottom: 4,
    },
    enderecoCompleto: {
        fontSize: 14,
        color: '#666',
    },
    vehicleTextContainer: {
        flex: 1,
    },
    vehicleModel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F284E',
        marginBottom: 4,
    },
    vehicleDetails: {
        fontSize: 14,
        color: '#666',
    },
    confirmationsStatus: {
        marginBottom: 20,
        paddingVertical: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    confirmationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    confirmationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#1F284E',
    },
    confirmButtonDisabled: {
        opacity: 0.6,
    },
});

