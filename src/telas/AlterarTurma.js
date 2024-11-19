import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function AlterarTurma(){
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

    const [alunosSelecionados, setAlunosSelecionados] = useState([]);
    const [txtNovaTurma, setTxtNovaTurma] = useState('');

    const selecionarAluno = (aluno) => {
        setAlunosSelecionados(prev => {
            if (prev.includes(aluno.nome)) {
                return prev.filter(nome => nome !== aluno.nome); // Remove o aluno se já estiver selecionado
            } else {
                return [...prev, aluno.nome]; // Adiciona o aluno ao array
            }
        });
        console.log(alunosSelecionados);
    };

    
    const abrirModalAlterarTurma = () => {
        if (alunosSelecionados.length === 0 || !turmaSelecionada) {
            Alert.alert('','Selecione um ou mais alunos para alterar a turma.');
            return;
        }
        setModalVisible(true);
    }

    const obterTurmaPorNumero = async (numeroTurma) => {
        const turmasQuery = query(collection(db, 'turmas'), where('numeroTurma', '==', numeroTurma));
        const querySnapshot = await getDocs(turmasQuery);
    
        if (!querySnapshot.empty) {
            const turmaDoc = querySnapshot.docs[0]; // Pega o primeiro resultado
            return turmaDoc; // Retorna o documento da turma
        } 
    };

    const AlterarTurmaDoAluno = async () => {
        if (!txtNovaTurma.trim()) {
            Alert.alert('',alunosSelecionados.length <= 1 ? 'Informe a nova turma do aluno!' : 'Informe a nova turma dos alunos!');
            return;
        }

        const novaTurmaDoc = await obterTurmaPorNumero(txtNovaTurma);

            if (!novaTurmaDoc){
                Alert.alert('','Turma não localizada!');
                return;
            }
    
        try {
            // Filtra os alunos, removendo o aluno selecionado
            const novaListaAlunos = alunosDaTurma.filter(aluno => !alunosSelecionados.includes(aluno.nome));
        
            const turmaAtualRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaAtualRef, { alunos: novaListaAlunos });

            // 2. Buscar a nova turma pelo número
            

            const novaTurmaRef = novaTurmaDoc.ref; // Pega a referência do documento da nova turma
            const novaTurmaAlunos = novaTurmaDoc.data().alunos || [];
           
            const alunosParaMover = alunosDaTurma.filter(aluno => alunosSelecionados.includes(aluno.nome));
            const novaListaAlunosNovaTurma = [...novaTurmaAlunos, ...alunosParaMover];

            await updateDoc(novaTurmaRef, { alunos: novaListaAlunosNovaTurma });
    
            // 5. Atualizar a lista local de turmas
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                } else if (turma.id === novaTurmaDoc.id){
                    return { ...turma, alunos: [...turma.alunos, ...alunosParaMover] };
                }
                return turma;
            }));
    
            // 6. Atualizar estados locais
            setAlunosDaTurma(novaListaAlunos);
            setAlunosSelecionados([]);
            setTxtNovaTurma('');
    
            Alert.alert('', alunosSelecionados.length <= 1 ? 'Aluno transferido com sucesso!' : 'Alunos transferidos com sucesso!');
            closeModal();
        } catch (error) {
            console.log(error);
            Alert.alert('','Erro ao remover o aluno.');
        }
    }
    
      const closeModal = () => {
        setModalVisible(false);
        setAlunosSelecionados([])
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
            }}>Transferência de turma dos alunos</Text>
            
            <Text style={{
                marginTop:'10%',
                alignSelf:'center',
                fontWeight:'bold',
                fontSize:16
            }}>
                Informe o turno do aluno:
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
                Informe qual aluno da turma {numeroTurmaEscolhida} deseja alterar:
            </Text>
            
            {alunosDaTurma.length > 0 ? (
                alunosDaTurma.map((aluno, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => selecionarAluno(aluno)}
                        style={{
                            backgroundColor: alunosSelecionados.includes(aluno.nome)? '#0af8fc' : 'white',
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
                    {alunosSelecionados.length != 0 && (
                <View style={{
                    padding:10,
                    backgroundColor:'white',
                    borderRadius:9,
                    elevation:3
                }}>
                    
                    <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:15,
                    }}>
                        {alunosSelecionados.length <=1 ? 'Informe a nova turma do aluno:' : 'Informe a nova turma dos alunos:'}
                    </Text>
                    <TextInput 
                    placeholder="Ex. 3000"
                    style={{
                        marginTop:10,
                        borderWidth:1,
                        padding:5,
                        height:26,
                        borderColor:'#ccc',
                        elevation:2,
                        backgroundColor:'white',
                        borderRadius:7,
                    }}
                    value={txtNovaTurma}
                    onChangeText={setTxtNovaTurma}
                    />
                   
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        marginTop:10
                    }}>
            <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                marginTop:10,
                alignSelf:'center',
                }}
                onPress={AlterarTurmaDoAluno}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    {alunosSelecionados.length <=1 ? 'Atualizar a turma do aluno' : 'Atualizar a turma dos alunos'}
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
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:10,
                alignSelf:'center'
                }}
                onPress={abrirModalAlterarTurma}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    {alunosSelecionados.length <=1 ? 'Transferir aluno de turma' : 'Transferir alunos de turma'}
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