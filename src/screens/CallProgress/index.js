import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { DriverContext } from '../../contexts/DriverContext';
import IconOrigem from '../../components/IconOrigem';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { getCallDetails } from '../../services/calls';
import { io } from 'socket.io-client';
import api from '../../services/api';

const GOOGLE_MAPS_APIKEY = "AIzaSyBS5TYszHyw5VyTUU9gUCWYdNqOQ5pt7ik";

export default function CallProgress({ route, navigation }) {
    const { chamado } = route.params;
    const { driver } = useContext(DriverContext);
    const mapRef = useRef(null);

    const [detalhe, setDetalhe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [chegada, setChegada] = useState(false);
    const [etapaViagem, setEtapaViagem] = useState('guincheiro_a_caminho');
    const [posicaoGuincheiro, setPosicaoGuincheiro] = useState(null);
    const socketRef = useRef(null);

    console.log(chamado)

    // CONFIGURAÇÃO DO SOCKET.IO
    useEffect(() => {
        // Conecta ao servidor Socket.IO
        const socket = io(api.defaults.baseURL, {
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        // Entra na sala do chamado
        socket.on('connect', () => {
            console.log('Socket conectado:', socket.id);
            socket.emit('join-call-room', chamado.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });

        return () => {
            socket.disconnect();
        };
    }, [chamado.id]);

    // Envia localização via Socket.IO sempre que a posição mudar
    useEffect(() => {
        if (socketRef.current && socketRef.current.connected && posicaoGuincheiro) {
            socketRef.current.emit('guincheiro-location', {
                callId: chamado.id,
                latitude: posicaoGuincheiro.latitude,
                longitude: posicaoGuincheiro.longitude
            });
        }
    }, [posicaoGuincheiro, chamado.id]);

    // BUSCA OS DETALHES DO CHAMADO
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getCallDetails(chamado.id);
                setDetalhe(data);
            } catch (error) {
                console.error("Erro ao carregar detalhes do chamado:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [chamado.id]);

    // LOCALIZAÇÃO DO GUINCHEIRO E ENVIO VIA SOCKET.IO
    useEffect(() => {
        let watcher = null;

        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permissão de localização negada");
                return;
            }

            const current = await Location.getCurrentPositionAsync({});
            setPosicaoGuincheiro(current.coords);

            watcher = await Location.watchPositionAsync(
                {
                    accuracy: LocationAccuracy.Highest,
                    timeInterval: 2000,
                    distanceInterval: 5,
                },
                (location) => {
                    setPosicaoGuincheiro(location.coords);
                }
            );
        };

        requestLocationPermission();

        return () => watcher && watcher.remove();
    }, [chamado.id]);

    useEffect(() => {
        if (distance === null) return;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < 0.1) {
            console.log("Chegou na origem, mudando para a etapa 2.");
            setEtapaViagem('levando_ao_destino');
            setDistance(null);
        } else if (etapaViagem === 'levando_ao_destino' && distance < 0.1) {
            console.log("Chegou ao destino final!");
            setChegada(true);
        }
    }, [distance, etapaViagem]);

    const onMapReady = () => {
        if (mapRef.current && detalhe && posicaoGuincheiro) {
            const origem = {
                latitude: Number(detalhe.coordenadas_inicio.latitude),
                longitude: Number(detalhe.coordenadas_inicio.longitude),
            };
            const destino = {
                latitude: Number(detalhe.coordenadas_destino.latitude),
                longitude: Number(detalhe.coordenadas_destino.longitude),
            };

            mapRef.current.fitToCoordinates(
                [posicaoGuincheiro, origem, destino],
                {
                    edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                    animated: true
                }
            );
        }
    };

    console.log(chamado.cliente_foto_url)

    const handleCall = () => {
        // Implementar chamada telefônica
        const telefone = detalhe?.cliente?.telefone || detalhe?.cliente_telefone || chamado.cliente_telefone;
        console.log('Ligando para:', telefone);
    };

    const handleChat = () => {
        // Navegar para tela de chat
        console.log('Abrir chat com cliente');
        // navigation.navigate('Chat', { chamado, detalhe });
    };

    if (loading || !detalhe || !posicaoGuincheiro) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    const origem = {
        latitude: Number(detalhe.coordenadas_inicio.latitude),
        longitude: Number(detalhe.coordenadas_inicio.longitude),
    };
    const destino = {
        latitude: Number(detalhe.coordenadas_destino.latitude),
        longitude: Number(detalhe.coordenadas_destino.longitude),
    };

    let rotaOrigem, rotaDestino;
    if (etapaViagem === 'guincheiro_a_caminho') {
        rotaOrigem = { latitude: posicaoGuincheiro.latitude, longitude: posicaoGuincheiro.longitude };
        rotaDestino = origem;
    } else {
        rotaOrigem = { latitude: posicaoGuincheiro.latitude, longitude: posicaoGuincheiro.longitude };
        rotaDestino = destino;
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <MapView
                provider="google"
                ref={mapRef}
                style={styles.map}
                onMapReady={onMapReady}
                showsBuildings={true}
                initialRegion={{
                    latitude: origem.latitude,
                    longitude: origem.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: posicaoGuincheiro.latitude, longitude: posicaoGuincheiro.longitude }}
                    title="Guincheiro"
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Ionicons name="car-sport" size={35} color="#3498DB" />
                </Marker>

                {etapaViagem === 'guincheiro_a_caminho' ? (
                    <Marker
                        coordinate={origem}
                        title="Cliente"
                        description={detalhe.endereco_inicio}
                    >
                        <IconOrigem width={35} height={35} />
                    </Marker>
                ) : (
                    <Marker
                        coordinate={destino}
                        title="Destino final"
                        description={detalhe.endereco_destino}
                    >
                        <Ionicons name="flag" size={30} color="#3498db" />
                    </Marker>
                )}

                {posicaoGuincheiro && (
                    <MapViewDirections
                        key={etapaViagem}
                        origin={rotaOrigem}
                        destination={rotaDestino}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        precision='high'
                        strokeColor="#EF8108"
                        mode='driving'
                        onReady={result => {
                            setDistance(result.distance);
                            setDuration(result.duration);
                            if (mapRef.current) {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                                    animated: true
                                });
                            }
                        }}
                    />
                )}
            </MapView>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Situação do chamado:</Text>

                {/* CLIENTE */}
                <View style={styles.guincheiroContainer}>
                    <Image
                        style={styles.guincheiroImage}
                        source={
                            detalhe?.cliente?.foto_url || detalhe?.cliente_foto_url || chamado.cliente_foto_url
                                ? { uri: detalhe?.cliente?.foto_url || detalhe?.cliente_foto_url || chamado.cliente_foto_url }
                                : require("../../assets/images/profileIcon.png")
                        }
                    />
                    <View style={styles.guincheiroInfo}>
                        <View style={styles.nameRatingRow}>
                            <Text style={styles.guincheiroName}>
                                {detalhe?.cliente?.nome || detalhe?.cliente_nome || chamado.cliente_nome || 'Cliente'}
                            </Text>
                        </View>

                        {/* INFORMAÇÕES DO VEÍCULO DENTRO DO MESMO CONTAINER */}
                        <View style={styles.vehicleInfoInline}>
                            <View style={styles.vehicleTextContainer}>
                                <Text style={styles.vehicleModel}>
                                    {detalhe.carro?.modelo || 'Modelo não informado'} - {detalhe.carro?.cor || 'Cor não informada'}
                                </Text>
                                <Text style={styles.vehicleDetails}>
                                    {detalhe.carro?.marca || 'Marca não informada'} {detalhe.carro?.ano || ''} - {detalhe.carro?.dimensoes || 'Dimensões não informadas'}
                                </Text>
                                <Text style={styles.licensePlate}>
                                    Placa: {detalhe.carro?.placa || 'Não informada'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.separatorLine} />

                {/* TEMPO ESTIMADO */}
                {!chegada ? (
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {etapaViagem === 'guincheiro_a_caminho' ? (
                                <>
                                    Você está a{' '}
                                    <Text style={styles.timeHighlight}>{duration ? Math.ceil(duration) : 'calculando'}</Text> minutos do cliente
                                </>
                            ) : (
                                <>
                                    Você está a{' '}
                                    <Text style={styles.timeHighlight}>{duration ? Math.ceil(duration) : 'calculando'}</Text> minutos do destino
                                </>
                            )}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            <Text style={styles.timeHighlight}>Você chegou ao destino!</Text>
                        </Text>
                    </View>
                )}

                {/* BOTÕES DE COMUNICAÇÃO */}
                <View style={styles.communicationContainer}>
                    <TouchableOpacity
                        style={[styles.communicationButton, styles.phoneButton]}
                        onPress={handleCall}
                    >
                        <Ionicons name="call" size={24} color="#4a4a4a" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.communicationButton, styles.chatButton]}
                        onPress={handleChat}
                    >
                        <Ionicons name="chatbubble-ellipses" size={24} color="#4a4a4a" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

