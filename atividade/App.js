
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import Home from './telas/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Entrar' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ title: 'Criar conta' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Meu Delivery' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
