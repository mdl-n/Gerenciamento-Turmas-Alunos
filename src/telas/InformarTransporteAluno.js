import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function InformarTransporteAluno(){
    const Navigation = useNavigation();

    const [apertadoBtn1Turno, setApertadoBtn1Turno] = useState(false);
    const [apertadoBtn2Turno, setApertadoBtn2Turno] = useState(false);
    const [apertadoBtn3Turno, setApertadoBtn3Turno] = useState(false);

    const [turnoEscolhido, setTurnoEscolhido] = useState('');
    const [numeroTurmaEscolhida, setNumeroTurmaEscolhida] = useState('');
    const [turmas, setTurmas] = useState([]);

    const [txtTipoTransporte, setTxtTipoTransporte] = useState('');

    function apertouBtn1Turno(){
        setApertadoBtn1Turno(!apertadoBtn1Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn1Turno ? 'Manhã' : '');
        setTurmaSelecionada(null);
        console.log(turnoEscolhido)
    }

    function apertouBtn2Turno(){
        setApertadoBtn2Turno(!apertadoBtn2Turno);
        setApertadoBtn1Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn2Turno ? 'Tarde' : '');
        setTurmaSelecionada(null);
        console.log(turnoEscolhido)
    }

    function apertouBtn3Turno(){
        setApertadoBtn3Turno(!apertadoBtn3Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn1Turno(false);
        setTurnoEscolhido(!apertadoBtn3Turno ? 'Noite' : '');
        setTurmaSelecionada(null);
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

    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [alunosDaTurma, setAlunosDaTurma] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState('');

    const funcBotaoApertado = (turma) => {
        if (turmaSelecionada === turma.id) {
            setTurmaSelecionada(null);
            setNumeroTurmaEscolhida(''); 
            setAlunosDaTurma([]);
        } else {
            setTurmaSelecionada(turma.id);
            setNumeroTurmaEscolhida(turma.numeroTurma);
            setAlunosDaTurma(turma.alunos || []);
        }

    }
    const [modalVisible, setModalVisible] = useState(false);

    const selecionarAluno = (aluno) => {
        if(aluno.nome === alunoSelecionado){
            setAlunoSelecionado('')
        } else{
            setAlunoSelecionado(aluno.nome);
            openModal(aluno);
        }
       
        console.log(alunoSelecionado);
    };

    const opcaoNenhuma = () =>{
        if(txtTipoTransporte === 'Nenhuma'){
            setTxtTipoTransporte('');
        } else {
            setTxtTipoTransporte('Nenhuma')
        }
    }
    const opcaoFigueira = () =>{
        if(txtTipoTransporte === 'Figueira'){
            setTxtTipoTransporte('');
        } else {
            setTxtTipoTransporte('Figueira')
        }
    }
    const opcaoAeroporto = () =>{
        if(txtTipoTransporte === 'Aeroporto'){
            setTxtTipoTransporte('');
        } else {
            setTxtTipoTransporte('Aeroporto')
        }
    }

    const informarTransporte = async () => {
        if (!alunoSelecionado || !turmaSelecionada || txtTipoTransporte.trim() === '') {
            Alert.alert('','Escolha uma das opções!');
            return;
        }
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado) {
                    return { ...aluno, tipoTransporte: txtTipoTransporte, nomeResponsavelDiario: null }; // Atualiza o responsável do aluno selecionado
                }
                return aluno; // Mantém os outros alunos inalterados
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            
            closeModal();
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Rota de transporte registrada com sucesso!');
            setTxtTipoTransporte('');
        } catch (error) {
            console.log(error);
            Alert.alert('','Erro ao atualizar o responsável.');
        }
    };

    const openModal = () => {
        setModalVisible(true);
      };
    
      const closeModal = () => {
        setModalVisible(false);
        setAlunoSelecionado('')
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
                marginTop:5,
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center'
            }}>Informar o Transporte dos alunos</Text>
            
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
                    marginBottom:20
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
                
    {turmaSelecionada && (
        <View style={{ marginTop: '3%' }}>
            <Text style={{ fontWeight: 'bold' }}>
                Alunos da Turma {numeroTurmaEscolhida}:
            </Text>
            
            {alunosDaTurma.length > 0 ? (
                alunosDaTurma.map((aluno, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => selecionarAluno(aluno)}
                        style={{
                            backgroundColor: alunoSelecionado === aluno.nome ? '#0af8fc' : 'white',
                            marginLeft: '1%',
                            marginTop: '1%',
                            padding: 5,
                            borderRadius: 7,
                            borderWidth: 1,
                            borderColor: '#ccc'
                        }}
                    >
                        <Text style={{
                            fontSize: 12,
                            color: 'black',
                            fontWeight: 'bold'
                        }}>
                            {aluno.nome}
                        </Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text>Nenhum aluno encontrado.</Text>
            )}
    
        </View>
    )}
            </View>

            <Modal 
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'rgba(0, 0, 0, 0.23)'  // Fundo escuro atrás do modal
                }}>
                    {alunoSelecionado && (
                <View style={{
                    padding:10,
                    backgroundColor:'white',
                    borderRadius:9,
                    elevation:3
                }}>
                        <View style={{flexDirection:'row', marginBottom:10}}>
                            <Text>Aluno selecionado: </Text>
                            <Text style={{fontWeight:'bold', textDecorationLine:'underline'}}>{alunoSelecionado}</Text>
                        </View>
                    
                    <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:15,
                    }}>
                        Escolha a rota de transporte do aluno:
                    </Text>
                    
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        marginTop:15,
                        marginBottom:10
                    }}>
                    <TouchableOpacity style={{
                          backgroundColor: txtTipoTransporte === 'Nenhuma' ? '#0af8fc' : 'white',
                          borderRadius:7,
                          borderWidth:1,
                          borderColor:'#ccc',
                          padding:4
                    }}
                    onPress={()=>opcaoNenhuma()}
                    >
                        <Text style={{
                            fontWeight:'bold',
                        }}>
                            NENHUMA
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                          backgroundColor: txtTipoTransporte === 'Figueira' ? '#0af8fc' : 'white',
                          borderRadius:7,
                          borderWidth:1,
                          borderColor:'#ccc',
                          padding:4,
                          marginLeft:10
                    }}
                    onPress={()=>opcaoFigueira()}
                    >
                        <Text  style={{
                            fontWeight:'bold'
                        }}>
                            FIGUEIRA
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{
                          backgroundColor: txtTipoTransporte === 'Aeroporto' ? '#0af8fc' : 'white',
                          borderRadius:7,
                          borderWidth:1,
                          borderColor:'#ccc',
                          padding:4,
                          marginLeft:10
                    }}
                    onPress={()=>opcaoAeroporto()}
                    >
                        <Text  style={{
                            fontWeight:'bold'
                        }}>
                            AEROPORTO
                        </Text>
                    </TouchableOpacity>

                    </View>
                   
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'center'
                    }}>
            <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                marginTop:10,
                alignSelf:'center',
                }}
                onPress={informarTransporte}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Informar transporte
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                marginTop:10,
                alignSelf:'center',
                marginLeft:10
                }}
                onPress={()=>closeModal()}
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
                </View>
            )}
                </View>

            </Modal>
            
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