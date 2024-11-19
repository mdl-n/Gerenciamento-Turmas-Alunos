import { useNavigation } from "@react-navigation/native";
import { Alert, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../cfg/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function TelaCadastro(){
    const Navigation = useNavigation();

    const [senha, setSenha] = useState('');
    const [senha1, setSenha1] = useState('');
    const [email, setEmail] = useState('');

    const criacaoConta = async () => {

        if (senha.length === 0 || email.length === 0 || senha1.length === 0){
            Alert.alert('', 'Não deixe campos vazios!')
            return;
        }
        if (senha !== senha1){
            Alert.alert('', 'As senhas precisam ser iguais!')
            return;
        }
    
        try {
            await createUserWithEmailAndPassword(auth, email, senha);
            Alert.alert('', 'Conta criada com sucesso.',
              [
              {
                Text: 'Ok',
                onPress: ()=> Navigation.navigate('TelaLogin')
              }
            ]
            )
        } catch (error) {
            console.log(error.code)
            if(error.code == 'auth/invalid-email'){
                Alert.alert('', 'O E-Mail tem que ser válido!')
                return;
            }
            if (error.code == 'auth/weak-password'){
                Alert.alert('', 'A senha é muito curta!')
                return;
            }
            if (error.code == 'auth/email-already-in-use'){
                Alert.alert('', 'Este E-Mail já é cadastrado!')
                return;
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
                marginTop:'2%',
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center'
            }}>Crie a sua conta</Text>

            <Text style={{
                marginTop:'15%',
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
            />

            <Text style={{
                marginTop:'5%',
                color:'gray',
                fontWeight:'bold'
            }}>
                Confirmar senha
            </Text>
            
            <TextInput
            placeholder="Confirme a senha anterior"
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
            value={senha1}
            onChangeText={setSenha1}
            secureTextEntry={true}
            />

                <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'15%',
                alignSelf:'center'
                }}
                onPress={()=>criacaoConta()}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Criar conta
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'5%',
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