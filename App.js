import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./src/pages/home/index";
import Cadastro from "./src/pages/cadastro";
import PesquisaFilme from "./src/pages/pesquisaFilme";
import TodosFilme from './src/pages/todosFilme/todosFilme';


const Stack = createNativeStackNavigator()

export default function stackRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="home"
          component={Home}
          options={{ 
            headerShown:false
          }}
        />

        <Stack.Screen
          name="cadastro"
          component={Cadastro}
          options={{ 
            title: "CADASTRO"
          }}
        />

        <Stack.Screen
          name="pesquisaFilme"
          component={PesquisaFilme}
          options={{ 
          title: "PESQUISA FILME"
        }}
        />
        <Stack.Screen
          name="todosFilme"
          component={TodosFilme}
          options={{ 
            title: "TODOS OS FILMES"
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>

  );
}