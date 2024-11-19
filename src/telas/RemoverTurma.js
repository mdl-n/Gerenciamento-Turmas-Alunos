import { useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import moment from "moment-timezone";

export default function RemoverTurma(){
    const Navigation = useNavigation();

    const [apertadoBtn1Turno, setApertadoBtn1Turno] = useState(false);
    const [apertadoBtn2Turno, setApertadoBtn2Turno] = useState(false);
    const [apertadoBtn3Turno, setApertadoBtn3Turno] = useState(false);

    const [turnoEscolhido, setTurnoEscolhido] = useState('');
    const [numeroTurmaEscolhida, setNumeroTurmaEscolhida] = useState('');
    const [turmas, setTurmas] = useState([]);

    function apertouBtn1Turno(){
        setApertadoBtn1Turno(!apertadoBtn1Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn1Turno ? 'Manhã' : '');
        console.log(turnoEscolhido)
    }

    function apertouBtn2Turno(){
        setApertadoBtn2Turno(!apertadoBtn2Turno);
        setApertadoBtn1Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn2Turno ? 'Tarde' : '');
        console.log(turnoEscolhido)
    }

    function apertouBtn3Turno(){
        setApertadoBtn3Turno(!apertadoBtn3Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn1Turno(false);
        setTurnoEscolhido(!apertadoBtn3Turno ? 'Noite' : '');
        console.log(turnoEscolhido)
    }

    const exibirTurmas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'turmas'));
            
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setTurmas(data)
        } catch(error){
            console.log(error)
        }
    }
    
    useEffect(()=>{
        exibirTurmas()
    },[])

    const [turmasSelecionadas, setTurmasSelecionadas] = useState([])
    const selecionarTurma = (turma) => {
        if (turmasSelecionadas?.includes(turma)) {
          setTurmasSelecionadas(turmasSelecionadas.filter(item => item !== turma));
        } else {
          setTurmasSelecionadas([...turmasSelecionadas, turma]);
        }
      };

    const removerTurma = async()=>{
        if(turmasSelecionadas.length === 0){
            Alert.alert('','Nenhuma turma selecionada!')
            return;
        }
        Alert.alert('', turmasSelecionadas.length>1 ? 'Ok. removendo as turmas selecionadas...' : 'Ok. removendo a turma selecionada...') 
        try {
            // Deleta todas as turmas selecionadas
            for (const turma of turmasSelecionadas) {
                await deleteDoc(doc(db, 'turmas', turma.id)); // Deleta com base no ID da turma
            }
            
            Alert.alert('', turmasSelecionadas.length>1 ? 'Turma removida com sucesso!' : 'Turmas removidas com sucesso!');
            setTurmasSelecionadas([]); // Limpa a seleção após deletar
            exibirTurmas(); // Atualiza a lista de turmas após a exclusão
        } catch (error) {
            console.error("Erro ao deletar turmas:", error);
            Alert.alert('', 'Erro ao deletar as turmas. Tente novamente.');
        }
    };

    return(
        <ScrollView contentContainerStyle={{
            flexGrow:1,
            justifyContent:'center',
            padding:20
        }}>
        <View style={{
           justifyContent:'center',
           alignItems:'center'
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
            }}>Remoção de Turmas</Text>
            
            <Text style={{
                marginTop:'10%',
                alignSelf:'center',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o turno da turma:
            </Text>
            <View style={{
                 marginTop:'2%',
                 backgroundColor:'white',
                 elevation:4,
                 padding:5,
                 borderRadius:7,
            }}>
            <View style={{
                flexDirection:'row',
                justifyContent:'center',
                marginTop:'2%'
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
                    backgroundColor: apertadoBtn3Turno ? '#0af8fc' : 'blue',
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

                {apertadoBtn1Turno && (
                    <View style={{padding:3}}>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Clique nas turmas que deseja remover:</Text>
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%'
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Manhã')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={()=>selecionarTurma(turma)}
                        style={{
                            backgroundColor: turmasSelecionadas.some(t=> t.numeroTurma === turma.numeroTurma) ? 'red' : 'blue',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }    
                    </View>
                    </View>
                )
                }
                {apertadoBtn2Turno && (
                    <View>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Clique nas turmas que deseja remover:</Text>
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%'
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Tarde')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={()=>selecionarTurma(turma)}
                        style={{
                            backgroundColor: turmasSelecionadas.some(t=> t.numeroTurma === turma.numeroTurma) ? 'red' : 'blue',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }    
                    </View>
                    </View>
                )
                }
                {apertadoBtn3Turno && (
                    <View>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Clique nas turmas que deseja remover:</Text>
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%'
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Noite')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={()=>selecionarTurma(turma)}
                        style={{
                            backgroundColor: turmasSelecionadas.some(t=> t.numeroTurma === turma.numeroTurma) ? 'red' : 'blue',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }    
                    </View>
                    </View>
                )
                }


            </View>

            <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:30,
                alignSelf:'center'
                }}
                onPress={removerTurma}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    {turmasSelecionadas.length <= 1 ? 'Remover turma':'Remover turmas'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:10,
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
        </ScrollView>
    )
}