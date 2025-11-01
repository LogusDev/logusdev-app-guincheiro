import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function DetalheChamado({ route }) {
  const { chamado } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitando Guincho:</Text>
      <View style={styles.clienteRow}>
        <Image
          source={chamado.foto ? { uri: chamado.foto } : require('../../assets/images/profileIcon.png')}
          style={styles.avatar}
        />
        <Text style={styles.nome}>{chamado.nome}</Text>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.row}>
          <Ionicons name="map" size={22} color="#FF9800" />
          <Text style={styles.localTitle}>Etec Embu</Text>
          <Text style={styles.localDesc}>R. Marcelino Pinto Teixeira, 529 - Parque Industri...</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location" size={22} color="#FF9800" />
          <Text style={styles.localTitle}>Padaria <Text style={{fontWeight:'bold'}}>Valo Velho</Text></Text>
          <Text style={styles.localDesc}>R. José Manoel Nicoli, 433 - São Paulo - SP...</Text>
        </View>
      </View>
      <View style={styles.carRow}>
        <Ionicons name="car" size={22} color="#FF3D3D" />
        <Text style={styles.carInfo}>Sandero RS Renault 2015 / ***6C47</Text>
      </View>
      <View style={styles.valorRow}>
        <Text style={styles.valorLabel}>Valor: <Text style={styles.valor}>R$204,00</Text></Text>
        <Ionicons name="card-outline" size={22} color="#1F284E" />
        <Text style={styles.pagamento}>CARTÃO</Text>
      </View>
      <TouchableOpacity style={styles.confirmarBtn}>
        <Text style={styles.confirmarText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}