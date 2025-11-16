import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import { getCurrentPositionAsync, LocationAccuracy, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import PhotoCard from '../../components/PhotoCard';
import LoadingScreen from '../../components/LoadingScreen';
import { Image } from 'expo-image';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Video } from 'expo-av';
import SearchingVideo from '../../assets/images/searching.gif';
import { getCallsWaiting } from '../../services/calls';
import { lightMapStyle } from '../../utils/mapStyle';

export default function Home({navigation}){

    const [location, setLocation] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [offline, setOffline] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [isOnline, setIsOnline] = useState(false);
    const [chamados, setChamados] = useState([]);
    
    const onLoadingComplete = () => {
        const MINIMUM_LOADING_TIME = 5000; 

        const elapsedTime = Date.now() - startTime.current;
        const remainingTime = MINIMUM_LOADING_TIME - elapsedTime;

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500, 
                useNativeDriver: true,
            }).start(() => {
                setIsLoading(false); 
            });
        }, remainingTime > 0 ? remainingTime : 0);
    };

    const startTime = useRef(null);

    const pollingIntervalRef = useRef(null);

    const fetchCalls = async () => {
        try {
            const { latitude, longitude } = location;

            const data = await getCallsWaiting(latitude, longitude);

            if (Array.isArray(data)) {
                setChamados(data);
            } else if (data && Array.isArray(data.calls)) {
                setChamados(data.calls);
            } else {
                setChamados([]);
            }
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
            setChamados([]);
        }
    };


    console.log(location?.latitude, location?.longitude);

    const handleStatus = async () => {
        if (!isOnline) {
            setIsOnline(true);
        } else {
            setIsOnline(false);
            setChamados([]);
        }
    }

    useEffect(() => {
        if (isOnline) {
            fetchCalls();
            pollingIntervalRef.current = setInterval(fetchCalls, 8000);
            console.log('Iniciando polling de chamados...');
        } else {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [isOnline]);

    useEffect(() => {
        startTime.current = Date.now();

        async function requestLocationPermission() {
            const { granted } = await requestForegroundPermissionsAsync();

            if (granted) {
                const currentPosition = await getCurrentPositionAsync();
                setLocation(currentPosition.coords);
                onLoadingComplete(); 
            } else {
                setPermissionDenied(true);
                onLoadingComplete(); 
            }
        }

        requestLocationPermission();

        let watcher;
        const startWatching = async () => {
            watcher = await watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 10,
            }, (response) => {
                setLocation(response.coords);
            });
        };

        startWatching();

        return () => {
            if (watcher) {
                watcher.remove();
            }
        };
    }, []); 

    if (isLoading) {
        return (
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <LoadingScreen />
            </Animated.View>
        );
    }

    return(
        <View style={styles.container}>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle={"dark-content"}  />
            {permissionDenied ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Permissão de localização negada. Habilite-a nas configurações do dispositivo para usar o mapa.
                    </Text>
                </View>
            ) : (
                <>
                    <MapView
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        mapType="standard"                         showsBuildings={true}
                        style={styles.map}
                        showsMyLocationButton={true}
                        provider="google"
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                        />
                    </MapView>
                    <View style={styles.photoCard}>
                        <PhotoCard/>
                        {isOnline && (
                            <TouchableOpacity
                                style={[styles.statusButton, isOnline ? styles.statusOnline : styles.statusOffline]}
                                onPress={handleStatus}
                            >
                                <Ionicons name="power-outline" size={30} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* Esconde o botão grande quando online */}
                    {!isOnline && (
                        <View style={styles.containerCard}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#A5A5A5' }]}
                                onPress={handleStatus}
                            >
                                <Text style={styles.buttonText}>Ficar Online</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {isOnline && (
                        <ScrollView style={styles.clientesContainer}>
                            <Text style={styles.clientesTitle}>Clientes disponíveis</Text>
                            {chamados.length > 0 ? (
                                chamados.map((c) => (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={styles.card}
                                        onPress={() => navigation.navigate('DetalheChamado', { chamado: c })}
                                    >
                                        <Image
                                            source={c.cliente_foto_url ? { uri: c.cliente_foto_url } : require('../../assets/images/profileIcon.png')}
                                            style={styles.avatar}
                                        />
                                        <View style={styles.info}>
                                            <Text style={styles.nome}>{c.cliente_nome}</Text>
                                            <Text style={styles.carro}>{c.veiculo_info}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
                                                <Text style={styles.tempo}>{c.tempo_espera_formatado}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.distanciaBox}>
                                            <Text style={styles.distanciaText}>{c.distancia_km} km</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.buscaContainer}>
                                    <Image
                                        source={require('../../assets/images/searching.gif')}
                                        style={{ width: 200, height: 200, marginBottom: 12 }}
                                        contentFit="contain"
                                    />
                                </View>
                            )}
                        </ScrollView>
                    )}
                </>
            )}
        </View>
    )
}