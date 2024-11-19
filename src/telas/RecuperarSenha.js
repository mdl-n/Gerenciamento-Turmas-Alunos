import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../cfg/firebaseConfig";
import { useState } from "react";

export default function RecuperarSenha(){
    const Navigation = useNavigation();

    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('E-mail enviado', 'Verifique seu e-mail para redefinir sua senha.');
            setEmail('');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o e-mail de redefinição de senha.');
        }
    };

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
            }}>Recuperação de Conta</Text>

            <Text style={{
                marginTop:'15%',
                color:'blue',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o seu E-Mail para recuperação:
            </Text>
            <TextInput
            placeholder="Informe o E-Mail"
            style={{
                marginTop:'2%',
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

                <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:9,
                width:"100%",
                marginTop:'15%',
                alignSelf:'center'
                }}
                onPress={handlePasswordReset}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Enviar E-Mail de recuperação
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:9,
                width:"35%",
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