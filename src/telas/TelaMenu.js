import { useNavigation } from "@react-navigation/native";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function TelaMenu(){
    const Navigation=useNavigation();
    return(
        <View style={{
            flex:1,justifyContent:'center', padding:15
        }}>
            <StatusBar backgroundColor={'blue'}/>
            <Image style={{
               width:100,
               height:100,
               alignSelf:"center",
               resizeMode:'contain'
            }} source={require('../img/logoArraial.png')} />
            
            <Text style={{
                marginTop:'3%',
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center'
            }}>Menu de Opções</Text>

            <View style={{
                flexDirection:'row',
                justifyContent:'center',
                marginTop:'15%'
            }}>
                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    maxWidth:'50%',
                    height:100,
                    justifyContent:'center'
                }}
                onPress={()=>Navigation.navigate('VisualizarTurmas')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16,
                        textAlign:'center'
                    }}>
                        Visualizar turmas liberadas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    maxWidth:'50%',
                    marginLeft:'5%',
                    height:100,
                    justifyContent:'center'
                }}
                onPress={()=>Navigation.navigate('TelaGerenciamento')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16,
                        textAlign:'center'
                    }}>
                        Gerenciamento de turmas/alunos
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"40%",
                marginTop:'20%',
                alignSelf:'center'
                }}
                onPress={()=>Navigation.navigate('TelaLogin')}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Voltar
                </Text>
            </TouchableOpacity>
        </View>
    )
}