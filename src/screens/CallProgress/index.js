import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
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
import Button from '../../components/Button';
import ArrivalConfirmation from '../../components/ArrivalConfirmation';

const GOOGLE_MAPS_APIKEY = "AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M";

// --- Função Haversine (cálculo manual) ---
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
};

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
    
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isEnderecoInicial, setIsEnderecoInicial] = useState(true);
    const [clienteConfirmou, setClienteConfirmou] = useState(false);
    const [guincheiroConfirmou, setGuincheiroConfirmou] = useState(false);
    const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false);
    const isEnderecoInicialRef = useRef(true);


    useEffect(() => {
        const socket = io(api.defaults.baseURL, {
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;
        socket.on('connect', () => {
            console.log('Socket conectado:', socket.id);
            socket.emit('join-call-room', chamado.id);
        });
        
        socket.on('cliente-confirmou-chegada', (data) => {
            console.log('Cliente confirmou chegada:', data);
            setClienteConfirmou(prev => {
                if ((data.tipo === 'inicial' && isEnderecoInicialRef.current) || 
                    (data.tipo === 'final' && !isEnderecoInicialRef.current)) {
                    return true;
                }
                return prev;
            });
        });

        socket.on('ambos-confirmaram', (data) => {
            console.log('Ambos confirmaram, prosseguindo:', data);
            setShowConfirmationModal(false);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            setAguardandoConfirmacao(false);
            
            if (data.tipo === 'inicial') {
                setEtapaViagem('levando_ao_destino');
                setDistance(null);
            } else if (data.tipo === 'final') {
                setChegada(true);
                setDistance(null); 
            }
        });
        
        socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });
        return () => {
            socket.disconnect();
        };
    }, [chamado.id]);

    useEffect(() => {
        if (socketRef.current && socketRef.current.connected && posicaoGuincheiro) {
            socketRef.current.emit('guincheiro-location', {
                callId: chamado.id,
                latitude: posicaoGuincheiro.latitude,
                longitude: posicaoGuincheiro.longitude
            });
        }
    }, [posicaoGuincheiro, chamado.id]);

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
        if (!posicaoGuincheiro || !detalhe || chegada) return;

        let distanciaCalculada = null;

        if (etapaViagem === 'guincheiro_a_caminho') {
            const origem = {
                latitude: Number(detalhe.coordenadas_inicio.latitude),
                longitude: Number(detalhe.coordenadas_inicio.longitude),
            };
            distanciaCalculada = calcularDistancia(
                posicaoGuincheiro.latitude,
                posicaoGuincheiro.longitude,
                origem.latitude,
                origem.longitude
            );
        } else if (etapaViagem === 'levando_ao_destino') {
            const destino = {
                latitude: Number(detalhe.coordenadas_destino.latitude),
                longitude: Number(detalhe.coordenadas_destino.longitude),
            };
            distanciaCalculada = calcularDistancia(
                posicaoGuincheiro.latitude,
                posicaoGuincheiro.longitude,
                destino.latitude,
                destino.longitude
            );
        }

        if (distanciaCalculada !== null) {
            setDistance(prevDistance => {
                if (prevDistance === null || Math.abs(prevDistance - distanciaCalculada) > 0.05) {
                    return distanciaCalculada;
                }
                return prevDistance;
            });
        }
    }, [posicaoGuincheiro, etapaViagem, detalhe, chegada]);


    useEffect(() => {
        if (distance === null || !detalhe || aguardandoConfirmacao || chegada) return;

        console.log(`[CallProgress Guincheiro] Distância: ${distance.toFixed(3)} km, Etapa: ${etapaViagem}`);

        const threshold = 0.1;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < threshold && !showConfirmationModal) {
            console.log("✅ [Guincheiro] Próximo ao endereço inicial, mostrando modal de confirmação.");
            setIsEnderecoInicial(true);
            isEnderecoInicialRef.current = true;
            setShowConfirmationModal(true);
            setAguardandoConfirmacao(true);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            return;
        }
        
        if (etapaViagem === 'levando_ao_destino' && distance < threshold && !showConfirmationModal) {
            console.log("✅ [Guincheiro] Próximo ao endereço final, mostrando modal de confirmação.");
            setIsEnderecoInicial(false);
            isEnderecoInicialRef.current = false;
            setShowConfirmationModal(true);
            setAguardandoConfirmacao(true);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            return;
        }

    }, [distance, etapaViagem, detalhe, showConfirmationModal, aguardandoConfirmacao, chegada]);

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

    const handleChat = () => {
        console.log('Abrir chat com cliente');
        // navigation.navigate('Chat', { chamado, detalhe });
    };

    const handleConfirmArrival = () => {
        if (!socketRef.current) return;
        
        setGuincheiroConfirmou(true);
        
        const tipo = isEnderecoInicial ? 'inicial' : 'final';
        socketRef.current.emit('guincheiro-confirmou-chegada', {
            callId: chamado.id,
            tipo,
            userId: driver?.id
        });
        
        console.log(`[Guincheiro] Confirmação de chegada enviada: ${tipo}`);
    };

    const handleFinalizarChamado = async () => {
        try {
            console.log("Navegando de volta para a Home...");
            // O status já foi atualizado automaticamente pelo servidor quando ambos confirmaram
            // Reseta a pilha de navegação para a tela 'Home'
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error("Erro ao navegar:", error);
            Alert.alert('Erro', 'Não foi possível navegar. Tente novamente.');
        }
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

                {/* --- CORREÇÃO: Marcadores sempre visíveis --- */}
                {/* Marcador do Cliente (Origem) */}
                <Marker
                    coordinate={origem}
                    title="Cliente"
                    description={detalhe.endereco_inicio}
                >
                    <IconOrigem width={35} height={35} />
                </Marker>

                {/* Marcador do Destino Final */}
                <Marker
                    coordinate={destino}
                    title="Destino final"
                    description={detalhe.endereco_destino}
                >
                    <Ionicons name="flag" size={30} color="#3498db" />
                </Marker>

                {posicaoGuincheiro && (
                    <MapViewDirections
                        // --- CORREÇÃO: Key melhorada e strokeColor condicional ---
                        key={`${etapaViagem}-${posicaoGuincheiro.latitude.toFixed(4)}`}
                        origin={rotaOrigem}
                        destination={rotaDestino}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        precision='high'
                        strokeColor={etapaViagem === 'guincheiro_a_caminho' ? "#EF8108" : "#3498DB"}
                        mode='driving'
                        onReady={result => {
                            console.log(`[CallProgress Guincheiro] Rota API - Dist: ${result.distance} km, Dur: ${result.duration} min`);
                            // Define a distância e duração primariamente pela API
                            if (result.distance && result.distance > 0) {
                                setDistance(result.distance);
                                setDuration(result.duration);
                            }
                            if (mapRef.current) {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                                    animated: true
                                });
                            }
                        }}
                        onError={(errorMessage) => {
                            console.warn('[CallProgress Guincheiro] Erro API Directions (fallback p/ manual):', errorMessage);
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

                {/* --- MUDANÇA: LÓGICA CONDICIONAL PARA BOTÕES --- */}
                {!chegada ? (
                    // Se NÃO chegou, mostra botões de comunicação
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
                ) : (
                    // Se JÁ chegou, mostra o botão de finalizar
                    <View style={{alignItems:'center'}}>
                        {/* <TouchableOpacity
                            style={{ // Estilo inline para o botão de finalizar
                                backgroundColor: '#28a745', // Verde "sucesso"
                                flex: 1,
                                padding: 15,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 10,
                                marginVertical: 10,
                            }}
                            onPress={handleFinalizarChamado}
                        >
                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>
                                Finalizar Chamado
                            </Text>
                        </TouchableOpacity> */}
                        <Button text="Finalizar" onPress={handleFinalizarChamado} />
                    </View>
                )}
                {/* --- FIM DA MUDANÇA --- */}

            </View>

            {/* Modal de Confirmação de Chegada */}
            <ArrivalConfirmation
                visible={showConfirmationModal}
                onConfirm={handleConfirmArrival}
                clienteInfo={detalhe?.cliente || detalhe}
                endereco={{
                    endereco: isEnderecoInicial 
                        ? detalhe?.endereco_inicio 
                        : detalhe?.endereco_destino,
                    titulo: isEnderecoInicial 
                        ? 'Endereço inicial' 
                        : 'Endereço final'
                }}
                isEnderecoInicial={isEnderecoInicial}
                vehicle={detalhe?.carro}
                clienteConfirmou={clienteConfirmou}
                guincheiroConfirmou={guincheiroConfirmou}
            />
        </View>
    );
}