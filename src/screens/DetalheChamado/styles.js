import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F284E',
    marginBottom: 16,
    textAlign: 'center',
  },
  clienteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#1F284E',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F284E',
  },
  infoBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  localTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F284E',
    marginLeft: 8,
    marginRight: 4,
  },
  localDesc: {
    fontSize: 13,
    color: '#6C6C6C',
    marginLeft: 4,
    flex: 1,
  },
  carRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  carInfo: {
    fontSize: 15,
    color: '#1F284E',
    marginLeft: 8,
    fontWeight: '500',
  },
  valorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 18,
  },
  valorLabel: {
    fontSize: 16,
    color: '#1F284E',
    fontWeight: 'bold',
    marginRight: 8,
  },
  valor: {
    color: '#20B26A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pagamento: {
    fontSize: 15,
    color: '#1F284E',
    marginLeft: 8,
    fontWeight: '500',
  },
  confirmarBtn: {
    backgroundColor: '#1F284E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  confirmarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default styles;