
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Digite seu e-mail e sua senha.');
      return;
    }

    try {
      setCarregando(true);

      await signInWithEmailAndPassword(auth, email.trim(), senha);

      navigation.replace('Home');
    } catch (error) {
      console.log('Erro no login:', error.code, error.message);

      const mensagens = {
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/invalid-email': 'Digite um e-mail válido.',
        'auth/user-disabled': 'Esta conta está desativada.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/network-request-failed': 'Verifique sua conexão com a internet.',
      };

      Alert.alert(
        'Não foi possível entrar',
        mensagens[error.code] || 'Confira seus dados e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.logo}>🍔</Text>
      <Text style={estilos.titulo}>Meu Delivery</Text>
      <Text style={estilos.subtitulo}>Entre para fazer seu pedido</Text>

      <Text style={estilos.rotulo}>E-mail</Text>
      <TextInput
        style={estilos.input}
        placeholder="seuemail@exemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={estilos.rotulo}>Senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={estilos.botao}
        onPress={fazerLogin}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={estilos.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF8F0',
  },
  logo: { fontSize: 58, textAlign: 'center' },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8B2E16',
    marginTop: 8,
  },
  subtitulo: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 28,
  },
  rotulo: { fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3d8cf',
    borderRadius: 10,
    padding: 14,
  },
  botao: {
    backgroundColor: '#D94F30',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: {
    textAlign: 'center',
    color: '#A33A22',
    marginTop: 22,
  },
});
