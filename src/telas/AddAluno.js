import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function AddAluno(){
    const Navigation = useNavigation();

    const [apertadoBtn1Turno, setApertadoBtn1Turno] = useState(false);
    const [apertadoBtn2Turno, setApertadoBtn2Turno] = useState(false);
    const [apertadoBtn3Turno, setApertadoBtn3Turno] = useState(false);

    const [turnoEscolhido, setTurnoEscolhido] = useState('');
    const [numeroTurmaEscolhida, setNumeroTurmaEscolhida] = useState('');
    const [turmas, setTurmas] = useState([]);

    const [txtNomeAluno, setTxtNomeAluno] = useState('');

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

    const gerarIdUnico = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const adicionarAluno = async () => {
        try {
            if (!txtNomeAluno.trim() || !numeroTurmaEscolhida) {
                Alert.alert('', 'Não deixe campos inválidos!');
                return;
            }
    
            // Busca a turma no Firestore pelo número da turma
            const querySnapshot = await getDocs(
                query(
                    collection(db, 'turmas'),
                    where('numeroTurma', '==', numeroTurmaEscolhida)
                )
            );

            const turmaDoc = querySnapshot.docs[0];
    
            const turmaData = turmaDoc.data();
            const alunosAtual = turmaData.alunos || [];

            const alunoExistente = alunosAtual.some(aluno => aluno.nome === txtNomeAluno);

            if (alunoExistente) {
                Alert.alert('', 'Aluno já registrado na turma!');
                return;
            }
           
            const alunoNovo = {
                id: gerarIdUnico(),
                nome: txtNomeAluno,
                alunoLiberado: false,
                nomeResponsavel: null,
                nomeResponsavelDiario: null,
                ultimoRespDiario: null
            };
    
            const atualizadoAlunos = [...alunosAtual, alunoNovo];
    

            await updateDoc(turmaDoc.ref, {
                alunos: atualizadoAlunos
            });
    
            Alert.alert('', 'Aluno adicionado com sucesso!');
            setTxtNomeAluno(null);
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Erro ao adicionar aluno!');
        }
    };

    const [turmaSelecionada, setTurmaSelecionada] = useState(null);

    const funcBotaoApertado = (turma) => {
        if (turmaSelecionada === turma.id) {
            setTurmaSelecionada(null);
            setNumeroTurmaEscolhida(''); 
        } else {
            setTurmaSelecionada(turma.id);
            setNumeroTurmaEscolhida(turma.numeroTurma);
        }
        console.log(numeroTurmaEscolhida);
        console.log(txtNomeAluno);
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
            }}>Adicionar alunos</Text>
            
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
                    justifyContent:'center'
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
                {apertadoBtn1Turno && (
                    <View>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Informe a turma do aluno:</Text>
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
                        onPress={()=>funcBotaoApertado(turma)}
                        style={{
                            backgroundColor: turmaSelecionada === turma.id ? '#0af8fc' : 'blue',
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
                        }}>Informe a turma do aluno:</Text>
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
                        onPress={()=>funcBotaoApertado(turma)}
                        style={{
                            backgroundColor: turmaSelecionada === turma.id ? '#0af8fc' : 'blue',
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
                        }}>Informe a turma do aluno:</Text>
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
                        onPress={()=>funcBotaoApertado(turma)}
                        style={{
                            backgroundColor: turmaSelecionada === turma.id ? '#0af8fc' : 'blue',
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

            <Text style={{
                marginTop:'10%',
                alignSelf:'flex-start',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o nome do aluno:
            </Text>
            <TextInput 
            placeholder="Ex. João"
            style={{
                backgroundColor:'white',
                padding:4,
                borderRadius:7,
                elevation:4,
                marginTop:'2%',
                width:'100%'
            }}
            value={txtNomeAluno}
            onChangeText={setTxtNomeAluno}
            />
            <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'12%',
                alignSelf:'center'
                }}
                onPress={adicionarAluno}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Adicionar aluno
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
        </ScrollView>
    )
}