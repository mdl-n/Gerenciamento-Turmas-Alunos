import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function AddTurma(){
    const Navigation = useNavigation();

    const [apertadoBtn1Turno, setApertadoBtn1Turno] = useState(false);
    const [apertadoBtn2Turno, setApertadoBtn2Turno] = useState(false);
    const [apertadoBtn3Turno, setApertadoBtn3Turno] = useState(false);

    const [turnoTurma, setTurnoTurma] = useState('');
    const [numeroTurma, setNumeroTurma] = useState('');
    const [turmaLiberada] = useState(false);

    function apertouBtn1Turno(){
        setApertadoBtn1Turno(!apertadoBtn1Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoTurma(!apertadoBtn1Turno ? 'Manhã' : '');
        
    }

    function apertouBtn2Turno(){
        setApertadoBtn2Turno(!apertadoBtn2Turno);
        setApertadoBtn1Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoTurma(!apertadoBtn2Turno ? 'Tarde' : '');
        
    }

    function apertouBtn3Turno(){
        setApertadoBtn3Turno(!apertadoBtn3Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn1Turno(false);
        setTurnoTurma(!apertadoBtn3Turno ? 'Noite' : '');
        
    }

    const adicionarTurma = async () => {

        if(!turnoTurma.trim() || !numeroTurma.trim()){
            Alert.alert('', 'Não deixe campos vazios!')
            return;
        }

        try {
            const querySnapshot = await getDocs(collection(db, 'turmas'));
            
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
          const turmaExistente = data.find(item => item.numeroTurma === numeroTurma);

          if (turmaExistente){
            Alert.alert('','Turma já cadastrada!')
            return;
        }

        } catch (error) {
            console.log(error)
        }

        try {
            await addDoc(collection(db, 'turmas'),{
                turnoTurma,
                numeroTurma,
                turmaLiberada,
                alunos:[]
            });
        
            Alert.alert('','Turma adicionada com sucesso!')
            setNumeroTurma('');
        } catch (error) {
            console.log(error)
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
            }}>Adicionar Turmas</Text>
            
            <Text style={{
                marginTop:'10%',
                alignSelf:'center',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o turno da turma:
            </Text>
            <View style={{
                flexDirection:'row',
                justifyContent:'center',
                marginTop:'2%',
                backgroundColor:'white',
                elevation:4,
                padding:5,
                borderRadius:7,

            }}>
                <TouchableOpacity style={{
                    backgroundColor: apertadoBtn1Turno ? '#0af8fc' : 'blue',
                    borderRadius:6,
                    padding:8,
                    width:'30%',
                    alignItems:'center'
                }}
                onPress={()=>apertouBtn1Turno()}
                >
                    <Text style={{
                        fontWeight:'bold',
                        fontSize:15,
                        color:'white'
                    }}>
                        Manhã
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor: apertadoBtn2Turno ? '#0af8fc' : 'blue',
                    borderRadius:6,
                    padding:8,
                    marginLeft:'3%',
                    width:'30%',
                    alignItems:'center'
                }}
                onPress={()=>apertouBtn2Turno()}
                >
                    <Text style={{
                        fontWeight:'bold',
                        fontSize:15,
                        color:'white'
                    }}>
                        Tarde
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor:apertadoBtn3Turno ? '#0af8fc' : 'blue',
                    borderRadius:6,
                    padding:8,
                    marginLeft:'3%',
                    width:'30%',
                    alignItems:'center'
                }}
                onPress={()=>apertouBtn3Turno()}
                >
                    <Text style={{
                        fontWeight:'bold',
                        fontSize:15,
                        color:'white'
                    }}>
                        Noite
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{
                marginTop:'10%',
                alignSelf:'center',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o numero da turma:
            </Text>
            <TextInput 
            placeholder="Ex. 3000"
            style={{
                backgroundColor:'white',
                padding:4,
                borderRadius:7,
                elevation:4,
                marginTop:'2%'
            }}
            value={numeroTurma}
            onChangeText={setNumeroTurma}
            />
            <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'12%',
                alignSelf:'center'
                }}
                onPress={()=>adicionarTurma()}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Adicionar turma
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'4%',
                alignSelf:'center'
                }}
                onPress={()=>Navigation.navigate('TelaGerenciamento')}
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