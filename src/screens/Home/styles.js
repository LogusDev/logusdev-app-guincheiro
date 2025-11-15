import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: 320,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    photoCard: {
        position: 'absolute',
        top: 40,
        right: 16,
        zIndex: 2,
        alignItems: 'center',
    },
    statusButton: {
        width: 50,
        height: 50,
        marginTop: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        borderRadius: 40,
    },
    statusOnline: {
        backgroundColor: '#FF9800',
    },
    statusOffline: {
        backgroundColor: '#BDBDBD',
    },
    containerCard: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '80%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        elevation: 2,
        backgroundColor:'#A5A5A5',
        
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    clientesContainer: {
        flex: 1,
        width: '100%',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    clientesTitle: {
        fontWeight: 500,
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
        fontFamily:'Poppins-SemiBold'
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 6,
        marginHorizontal: 8,
        padding: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    info: {
        flex: 1,
    },
    nome: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    carro: {
        color: '#666',
        fontSize: 14,
        marginBottom: 2,
    },
    tempo: {
        fontSize: 13,
        color: '#FF9800',
        marginBottom: 2,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    distanciaBox: {
        borderWidth: 1,
        borderColor: '#FF9800',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginLeft: 8,
        minWidth: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    distanciaText: {
        color: '#FF9800',
        fontWeight: 'bold',
        fontSize: 15,
    },
    buscaContainer: {
        alignItems: 'center',
        marginTop: 32,
    },
    buscaIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    buscaText: {
        color: '#888',
        fontSize: 16,
    },
});