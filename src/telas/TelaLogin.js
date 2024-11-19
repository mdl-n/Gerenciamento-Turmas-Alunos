import { useNavigation } from "@react-navigation/native";
import { Alert, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../cfg/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function TelaLogin(){
    const Navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const logar = async () => {

        if(!email.trim() || !senha.trim()){
          Alert.alert('', 'Não deixe campos vazios!')
          return;
        }
  
        try {
          await signInWithEmailAndPassword(auth, email,senha);
          Alert.alert('', 'Logado com sucesso!',[
            {
              text:'Ok',
              onPress: () => Navigation.navigate('TelaMenu')
            }
          ])
          
        } catch (error) {
          console.log(error.code)
  
          if(error.code == 'auth/invalid-email'){
            Alert.alert('', 'Insira um E-Mail válido!')
          }
          if(error.code == 'auth/invalid-credential'){
            Alert.alert('', 'E-Mail ou senha inválidos!')
          }
        }
      }
  

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
                marginTop:'1%',
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center'
            }}>E. M. Francisco Luiz Sobrinho</Text>
            <Text style={{
                marginTop:'8%',
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center'
            }}>Faça seu login</Text>

            <Text style={{
                marginTop:'10%',
                color:'gray',
                fontWeight:'bold'
            }}>
                E-Mail
            </Text>
            
            <TextInput
            placeholder="Informe o seu E-Mail"
            style={{
                marginTop:'1%',
                borderWidth:1,
                padding:4,
                height:33,
                borderColor:'#ccc',
                elevation:2,
                backgroundColor:'white',
                borderRadius:7,
            }}
            value={email}
            onChangeText={setEmail}
            />

            <Text style={{
                marginTop:'5%',
                color:'gray',
                fontWeight:'bold'
            }}>
                Senha
            </Text>
            
            <TextInput
            placeholder="Informe a sua senha"
            style={{
                marginTop:'1%',
                borderWidth:1,
                padding:4,
                height:33,
                borderColor:'#ccc',
                elevation:2,
                backgroundColor:'white',
                borderRadius:7
            }}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize='none'
            importantForAutofill='no'
            />

                <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'15%',
                alignSelf:'center',
                }}
                onPress={logar}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Entrar
                </Text>
            </TouchableOpacity>

                <Text style={{
                    textDecorationLine:'underline',
                    marginTop:'5%',
                    alignSelf:'center',
                    fontSize:15
                }}
                onPress={()=>Navigation.navigate('RecuperarSenha')}
                >
                    Esqueceu sua senha?
                </Text>

                <View style={{flexDirection:'row', marginTop:'5%', justifyContent:'center'}}>
                    <Text style={{
                        fontSize:16
                    }}>Ainda não tem conta?</Text>
                    <Text style={{
                        fontSize:16,
                        fontWeight:'bold',
                        color:'blue',
                    }}
                    onPress={()=>Navigation.navigate('TelaCadastro')}
                    > Crie a sua agora!</Text>
                </View>
        </View>
    )
}