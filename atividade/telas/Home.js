
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const produtos = [
  { id: '1', nome: 'Hambúrguer clássico', emoji: '🍔', preco: 22.90 },
  { id: '2', nome: 'Pizza de queijo', emoji: '🍕', preco: 35.00 },
  { id: '3', nome: 'Batata frita', emoji: '🍟', preco: 12.00 },
  { id: '4', nome: 'Refrigerante', emoji: '🥤', preco: 7.00 },
];

export default function Home({ navigation }) {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  function adicionar(produto) {
    setCarrinho(atual => {
      const existente = atual.find(item => item.id === produto.id);

      if (existente) {
        return atual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...atual, { ...produto, quantidade: 1 }];
    });
  }

  function remover(id) {
    setCarrinho(atual =>
      atual
        .map(item =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  }

  const quantidade = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  function dinheiro(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  async function sair() {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.titulo}>🍔 Meu Delivery</Text>
          <Text style={estilos.subtitulo}>Escolha seu pedido!</Text>
        </View>

        <TouchableOpacity
          style={estilos.botaoCarrinho}
          onPress={() => setMostrarCarrinho(!mostrarCarrinho)}
        >
          <Text style={estilos.textoCarrinho}>
            🛒 {quantidade}
          </Text>
        </TouchableOpacity>
      </View>

      {mostrarCarrinho ? (
        <ScrollView>
          <Text style={estilos.tituloSecao}>Meu carrinho</Text>

          {carrinho.length === 0 ? (
            <Text style={estilos.vazio}>Seu carrinho está vazio.</Text>
          ) : (
            carrinho.map(item => (
              <View key={item.id} style={estilos.itemCarrinho}>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.nomeProduto}>
                    {item.emoji} {item.nome}
                  </Text>
                  <Text>
                    {item.quantidade} x {dinheiro(item.preco)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={estilos.botaoMenos}
                  onPress={() => remover(item.id)}
                >
                  <Text style={estilos.textoMenos}>−</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.botaoMais}
                  onPress={() => adicionar(item)}
                >
                  <Text style={estilos.textoMais}>+</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <Text style={estilos.total}>Total: {dinheiro(total)}</Text>

          <TouchableOpacity
            style={estilos.botao}
            onPress={() => setMostrarCarrinho(false)}
          >
            <Text style={estilos.textoBotao}>Continuar comprando</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView>
          <Text style={estilos.tituloSecao}>Nosso cardápio</Text>

          {produtos.map(produto => (
            <View key={produto.id} style={estilos.produto}>
              <Text style={estilos.emoji}>{produto.emoji}</Text>

              <View style={{ flex: 1 }}>
                <Text style={estilos.nomeProduto}>{produto.nome}</Text>
                <Text style={estilos.preco}>{dinheiro(produto.preco)}</Text>
              </View>

              <TouchableOpacity
                style={estilos.botaoMais}
                onPress={() => adicionar(produto)}
              >
                <Text style={estilos.textoMais}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={estilos.botaoSair} onPress={sair}>
        <Text style={estilos.textoSair}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0', padding: 16 },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titulo: { fontSize: 23, fontWeight: 'bold', color: '#8B2E16' },
  subtitulo: { color: '#666', marginTop: 4 },
  botaoCarrinho: {
    backgroundColor: '#D94F30',
    borderRadius: 12,
    padding: 12,
  },
  textoCarrinho: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  tituloSecao: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#8B2E16',
  },
  produto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  emoji: { fontSize: 34 },
  nomeProduto: { fontSize: 16, fontWeight: 'bold', color: '#38251F' },
  preco: { marginTop: 5, color: '#D94F30', fontWeight: 'bold' },
  botaoMais: {
    backgroundColor: '#D94F30',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoMais: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  itemCarrinho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  botaoMenos: {
    backgroundColor: '#eee',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoMenos: { fontSize: 22 },
  vazio: { color: '#666', marginVertical: 20 },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 15,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#D94F30',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoSair: { padding: 14, alignItems: 'center', marginTop: 8 },
  textoSair: { color: '#8B2E16', fontWeight: '600' },
});
