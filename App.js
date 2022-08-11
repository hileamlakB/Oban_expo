import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EvaluationPage } from './pages/EvaluationPage'
import { dataStore, persistore } from './utiles/store/store'
import { PersistGate } from 'redux-persist/integration/react'

const ObanStackTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
}

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider store={dataStore}>
      <PersistGate loading={null} persistor={persistore}>
        <NavigationContainer theme={ObanStackTheme}>
          <SafeAreaProvider
            style={{ justifyContent: 'center', display: 'flex' }}
          >
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="TestPage" component={EvaluationPage} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}
