import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import TelaLogin from "./TelaLogin";
import RecuperarSenha from "./RecuperarSenha";
import TelaMenu from "./TelaMenu";
import TelaCadastro from "./TelaCadastro";
import TelaGerenciamento from "./TelaGerenciamento";
import AddTurma from "./AddTurma";
import RemoverTurma from "./RemoverTurma";
import LiberarTurma from "./LiberarTurma";
import AddAluno from "./AddAluno";
import RemoverAluno from "./RemoverAluno";
import InformarResponsavel from "./InformarResponsavel";
import VisualizarTurmas from "./VisualizarTurmas";
import SaidaalunosCResp from "./SaidaalunosCResp";
import InformarTransporteAluno from "./InformarTransporteAluno";
import AlterarTurma from "./AlterarTurma";
import TelaLoading from "./TelaLoading";




export default function AppNavigation(){
    const Stack = createNativeStackNavigator();
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="TelaLoading" component={TelaLoading}/>
            <Stack.Screen name="TelaLogin" component={TelaLogin}/>
            <Stack.Screen name="AlterarTurma" component={AlterarTurma}/>
            <Stack.Screen name="InformarTransporteAluno" component={InformarTransporteAluno}/>
            <Stack.Screen name="SaidaalunosCResp" component={SaidaalunosCResp}/>
            <Stack.Screen name="VisualizarTurmas" component={VisualizarTurmas}/>
            <Stack.Screen name="InformarResponsavel" component={InformarResponsavel}/>
            <Stack.Screen name="RemoverAluno" component={RemoverAluno}/>
            <Stack.Screen name="AddAluno" component={AddAluno}/>
            <Stack.Screen name="LiberarTurma" component={LiberarTurma}/>
            <Stack.Screen name="RemoverTurma" component={RemoverTurma}/>
            <Stack.Screen name="AddTurma" component={AddTurma}/>
            <Stack.Screen name="RecuperarSenha" component={RecuperarSenha}/>
            <Stack.Screen name="TelaMenu" component={TelaMenu}/>
            <Stack.Screen name="TelaCadastro" component={TelaCadastro}/>
            <Stack.Screen name="TelaGerenciamento" component={TelaGerenciamento}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}