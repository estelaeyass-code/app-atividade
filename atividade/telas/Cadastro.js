
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não são iguais.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);

      const resultado = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      await setDoc(doc(db, 'usuarios', resultado.user.uid), {
        nome: nome.trim(),
        email: email.trim(),
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Conta criada! Você já pode entrar.');
      navigation.replace('Home');
    } catch (error) {
      console.log('Erro no cadastro:', error.code, error.message);

      const mensagens = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'Digite um e-mail válido.',
        'auth/weak-password': 'Escolha uma senha mais forte.',
        'auth/network-request-failed': 'Verifique sua conexão com a internet.',
        'permission-denied': 'Verifique as regras do Firestore no Firebase.',
      };

      Alert.alert(
        'Erro no cadastro',
        mensagens[error.code] || 'Não foi possível criar a conta.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.logo}>🍔</Text>
      <Text style={estilos.titulo}>Crie sua conta</Text>
      <Text style={estilos.subtitulo}>Peça suas comidas favoritas!</Text>

      <Text style={estilos.rotulo}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />

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
        placeholder="Mínimo de 6 caracteres"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={estilos.rotulo}>Confirmar senha</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite a senha novamente"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={estilos.botao}
        onPress={cadastrar}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Criar conta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={estilos.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF8F0',
  },
  logo: { fontSize: 54, textAlign: 'center' },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8B2E16',
  },
  subtitulo: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    marginTop: 8,
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
    marginTop: 20,
    marginBottom: 24,
  },
});
