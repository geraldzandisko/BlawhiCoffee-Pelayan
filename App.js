import 'react-native-gesture-handler';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  Dimensions,
  LogBox,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import {Home, Pesanan} from './src/views';

LogBox.ignoreLogs([
  'Warning: Can',
  'Please report: Exce',
  'VirtualizedLists should never be nested inside',
]);

const screenHeight = Dimensions.get('window').height;
const Stack = createStackNavigator();

function AppRun() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{
            title: 'Aplikasi Pelayan',
            headerStyle: {
							height: 60,
						},
						headerTitleStyle: {
							fontSize: 22,
							alignSelf: 'center'
						},
          }}
        />
        <Stack.Screen
          name="PesananScreen"
          component={Pesanan}
          options={{
            title: 'Pilih Menu Pesanan',
            headerStyle: {
							height: 60,
						},
						headerTitleStyle: {
							fontSize: 22,
							alignSelf: 'center'
						},
          }}
        />
        <Stack.Screen
          name="TambahanScreen"
          component={Pesanan}
          options={{
            title: 'Pilih Menu Pesanan Tambahan',
            headerStyle: {
							height: 60,
						},
						headerTitleStyle: {
							fontSize: 22,
							alignSelf: 'center'
						},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        nestedScrollEnabled={true}>
        <View style={{height: screenHeight + 1000}}>
          <AppRun />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
