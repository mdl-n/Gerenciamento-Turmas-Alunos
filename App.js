import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AppNavigation from './src/telas/AppNavigation';

export default function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('Sem conexão', 'Você está offline. Verifique sua conexão com a internet.');
      }
    });

    // Limpar o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return <AppNavigation />;
}