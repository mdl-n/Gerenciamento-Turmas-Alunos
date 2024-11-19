import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, BackHandler} from "react-native";
import { db } from "../cfg/firebaseConfig";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export default function SaidaalunosCResp(){
    const Navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const handleBackButton = () => {
        if (modalVisible) {
            // Se o modal estiver aberto, previna o fechamento
            return true; 
        }
        return false; // Permite que o back button funcione normalmente
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButton
        );

        return () => backHandler.remove(); // Limpa o listener ao desmontar
    }, [modalVisible]);

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
    const [alunoSelecionado, setAlunoSelecionado] = useState([]);

    const [txtNomeResponsavel, setTxtNomeResponsavel] = useState('');
    const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
    const [telefoneResponsavel2, setTelefoneResponsavel2] = useState('');

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

    const selecionarAluno = (aluno) => {
        if(aluno.nome === alunoSelecionado.nome){
            setAlunoSelecionado([])
        } else{
            setAlunoSelecionado(aluno);
            console.log('alunoselecionado: ',alunoSelecionado);
            openModal(aluno);
        }
       
    };

    const [opcaoNao1, setOpcaoNao1] = useState('');
    const [opcaoSim, setOpcaoSim] = useState('');
    const [opcaoSim2, setOpcaoSim2] = useState('');
    const [opcaoNao2, setOpcaoNao2] = useState('');

    const [txtAtualizarRespDiario, setTxtAtualizarRespDiario] = useState ('');
    const [txtNomeRespDiario, setTxtNomeRespDiario] = useState('');

   function funcOpcaoNao1(){
    if(opcaoNao1 === 'Não1'){
        setOpcaoNao1('');
        setOpcaoSim('');
    } else {
        setOpcaoNao1('Não1');
        setOpcaoSim('');
        setOpcaoNao2('');
    }
    }
    function funcOpcaoNao2(){
        if(opcaoNao2 === 'Não'){
            setOpcaoNao2('');
            setOpcaoSim2('');
            setOpcaoSim('')
        } else {
            setOpcaoNao2('Não');
            setOpcaoSim2('');
            setOpcaoSim('')
        }
        }

    function funcOpcaoSim(){
        if(opcaoSim === 'Sim'){
            setOpcaoSim('');
            setOpcaoNao1('');
            setOpcaoNao2('')
        } else {
            setOpcaoSim('Sim');
            setOpcaoNao1('');
            setOpcaoSim2('')
            setOpcaoNao2('')
        }
        
    }

    function funcOpcaoSim2(){
        if(opcaoSim2 === 'Sim'){
            setOpcaoSim2('');
            setOpcaoNao2('');
        } else {
            setOpcaoSim2('Sim');
            setOpcaoNao2('');
        }
        
    }


    const InformarRespDiarioPrincipal = async () => {
        
        if (opcaoSim.length === 0) {
            Alert.alert('Escolha uma opção!');
            return;
        }
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
                    return { ...aluno, nomeResponsavelDiario: aluno.nomeResponsavel, ultimoRespDiario: aluno.nomeResponsavel }; 
                }
                return aluno;
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            closeModal();
            closeModal2();
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável registrado com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
        } catch (error) {
            console.log(error);
            Alert.alert('','Erro ao atualizar o responsável.');
        }
    };

    const atualizarRespDiario = async () => {
        if (txtAtualizarRespDiario.length === 0) {
            Alert.alert('Preencha o nome do responsável!');
            return;
        }
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
    
                    return { 
                        ...aluno, 
                        nomeResponsavelDiario: txtAtualizarRespDiario, 
                        ultimoRespDiario: txtAtualizarRespDiario
                    };
                }
                return aluno;  // Retorne o aluno original
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            setTxtAtualizarRespDiario('');
            closeModal();
            closeModal2();
    
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável registrado com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Erro ao atualizar o responsável.');
        }
    };

    const InformarRespDiarioEqualsRespPrincipal = async () => {
        if (txtNomeRespDiario.length === 0) {
            Alert.alert('','Preencha o nome do responsável!');
            return;
        }
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
    
                    return { 
                        ...aluno, 
                        nomeResponsavelDiario: txtNomeRespDiario, 
                        ultimoRespDiario: txtNomeRespDiario
                    };
                }
                return aluno;  // Retorne o aluno original
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            setTxtNomeRespDiario('');
            closeModal();
            closeModal2();
    
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável registrado com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Erro ao atualizar o responsável.');
        }
    };

    const InformarRespDiarioUltimoRespGuardado = async () => {
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
                    console.log('ultimoRespDiario: ', alunoSelecionado.ultimoRespDiario)
                    return { 
                        ...aluno,
                        ultimoRespDiario: alunoSelecionado.ultimoRespDiario,
                        nomeResponsavelDiario: alunoSelecionado.ultimoRespDiario
                    };
                }
                return aluno;  // Retorne o aluno original
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            closeModal();
            closeModal2();
    
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável registrado com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
        } catch (error) {
            console.log(error);
            Alert.alert('', 'Erro ao atualizar o responsável.');
        }
    };

    const ALunoSemRespInformarResponsavel = async () => {
        if (txtNomeResponsavel.length === 0) {
            Alert.alert('Não deixe os campos vazios!');
            return;
        }
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
                    return { ...aluno, nomeResponsavel: txtNomeResponsavel, 
                        nomeResponsavelDiario: txtNomeResponsavel, 
                        telefoneResponsavel: telefoneResponsavel, 
                        telefoneResponsavel2: telefoneResponsavel2,
                        ultimoRespDiario: txtNomeResponsavel
                    }; // Atualiza o responsável do aluno selecionado
                }
                return aluno; // Mantém os outros alunos inalterados
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            closeModal();
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável registrado com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
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
        setAlunoSelecionado([])
        setOpcaoNao1('')
            setOpcaoSim('')
            setOpcaoEscolhida('')
      };

      const closeModalSemLimpar = () => {
        setModalVisible(false);
        setOpcaoNao1('')
            setOpcaoSim('')
      };

      const openModal2 = () => {
        setModal2Visible(true)
      }

      const closeModal2 = () => {
        setModal2Visible(false);
        setAlunoSelecionado([])
      }

      const [opcaoEscolhida, setOpcaoEscolhida] = useState('');

      const opcaoAlterar = () => {
        if(opcaoEscolhida === 'Alterar'){
            setOpcaoEscolhida('');
        } else{
            setOpcaoEscolhida('Alterar')
        }
      }
      const opcaoRemover = () => {
        if(opcaoEscolhida === 'Remover'){
            setOpcaoEscolhida('');
        } else{
            setOpcaoEscolhida('Remover')
        }
      }

      const acaoDaOpcao =()=>{
        if(opcaoEscolhida === ''){
            Alert.alert('','Escolha uma opção!');
            return;
        }
        if(opcaoEscolhida === 'Alterar'){
            closeModalSemLimpar();
            setTimeout(() => {
                openModal2();
            }, 100);
        } else {
            removerRespDiario();
        }
        setTimeout(() => {
            setOpcaoEscolhida('')
        }, 50);
       console.log(opcaoEscolhida) 
      }

      const removerRespDiario = async () => {
    
        try {
            // Mapeia os alunos e atualiza o campo nomeResponsavel apenas para o aluno selecionado
            const novaListaAlunos = alunosDaTurma.map(aluno => {
                if (aluno.nome === alunoSelecionado.nome) {
                    return { ...aluno, nomeResponsavelDiario: null, nomeResponsavelDiarioCopia: null }; 
                }
                return aluno;
            });
    
            // Atualiza o Firestore com a nova lista de alunos
            const turmaDocRef = doc(db, 'turmas', turmaSelecionada);
            await updateDoc(turmaDocRef, { alunos: novaListaAlunos });
    
            // Atualiza a lista local de alunos
            setAlunosDaTurma(novaListaAlunos);
            setAlunoSelecionado(''); // Limpa a seleção do aluno
            setTxtNomeResponsavel('');  // Limpa o campo de nome do responsável
            closeModal();
            // Atualiza a lista de turmas localmente
            setTurmas(prevTurmas => prevTurmas.map(turma => {
                if (turma.id === turmaSelecionada) {
                    return { ...turma, alunos: novaListaAlunos };
                }
                return turma;
            }));
    
            Alert.alert('', 'Responsável removido com sucesso!');
            setOpcaoNao1('')
            setOpcaoNao2('');
            setOpcaoSim('')
            setOpcaoSim2('');
            setOpcaoEscolhida('');
        } catch (error) {
            console.log(error);
            Alert.alert('','Erro ao atualizar o responsável.');
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
                marginTop:5,
                color:'gray',
                fontSize:18,
                fontWeight:'bold',
                alignSelf:'center',
                textAlign:'center'
            }}>Informar saida de alunos com responsáveis</Text>
            
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
                Alunos da Turma {numeroTurmaEscolhida}:
            </Text>
            
            {alunosDaTurma.length > 0 ? (
                alunosDaTurma.map((aluno, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => selecionarAluno(aluno)}
                        style={{
                            backgroundColor: alunoSelecionado.nome === aluno.nome ? '#0af8fc' : 'white',
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
                    {!alunoSelecionado.nomeResponsavelDiario && (
                        <View>
                            {alunoSelecionado.nome && (
                <View style={{
                    padding:10,
                    backgroundColor:'white',
                    borderRadius:9,
                    elevation:3
                }}>
                        <View style={{flexDirection:'row', marginBottom:10, justifyContent:'center'}}>
                            <Text style={{fontSize:16}}>Aluno selecionado: </Text>
                            <Text style={{fontWeight:'bold', textDecorationLine:'underline', fontSize:16}}>{alunoSelecionado.nome}</Text>
                        </View>
                    
                    {alunoSelecionado.nomeResponsavel &&(
                        <View>
                                <Text style={{
                                color:'black',
                                fontWeight:'bold',
                                fontSize:14,
                                }}>
                                Responsável registrado:
                                </Text>
                                <Text style={{alignSelf:"center", textDecorationLine:'underline', marginTop:5, fontWeight:"bold"}}>
                                    {alunoSelecionado.nomeResponsavel}
                                </Text>
                                <Text style={{
                                    marginTop:5
                                }}>O aluno irá embora com o responsável acima?</Text>

                                    <View style={{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                                    <TouchableOpacity style={{
                                        backgroundColor: opcaoSim ? 'green' : 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4
                                    }}
                                    onPress={()=>funcOpcaoSim()}
                                    >
                                        <Text style={{
                                            color: opcaoSim ? 'white' : 'black',
                                            fontWeight:'bold'
                                        }}>
                                            SIM
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: opcaoNao1 ? 'green' : 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4,
                                        marginLeft:15
                                    }}
                                    onPress={()=>funcOpcaoNao1()}
                                    >
                                        <Text style={{
                                            color: opcaoNao1 ? 'white' : 'black',
                                            fontWeight:'bold'
                                        }}>
                                            NÃO
                                        </Text>
                                    </TouchableOpacity>
                                    </View>
                                          
                                    {opcaoNao1.length>0 && alunoSelecionado.ultimoRespDiario === alunoSelecionado.nomeResponsavel &&(
                            <View style={{
                                marginBottom:-25
                            }}>
                                <Text>Informe o nome do responsável que irá buscar o aluno:</Text>
                            <TextInput
                            placeholder="Informe o nome do responsável"
                            style={{
                                backgroundColor:'white',
                                padding:2,
                                borderRadius:7,
                                elevation:4,
                                marginTop:5,
                                borderWidth:0.2,
                                borderColor:'#ccc'
                            }}
                            value={txtNomeRespDiario}
                            onChangeText={setTxtNomeRespDiario}
                            />
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'center',
                                marginTop:15
                            }}>
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center',
                            }}
                            onPress={InformarRespDiarioEqualsRespPrincipal}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft: opcaoNao1 ? 15 : 0 || opcaoSim ? 15 : 0 || !alunoSelecionado.nomeResponsavel ? 15 : 0,
                                }}
                                onPress={()=>closeModal()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Voltar
                                </Text>
                                </TouchableOpacity>
                            </View>
                            
                            </View>
                        )}
                                           {opcaoNao1.length>0 && alunoSelecionado.ultimoRespDiario && alunoSelecionado.ultimoRespDiario != alunoSelecionado.nomeResponsavel && (
                                            <View style={{marginTop:10}}>
                                                <Text>Da ultima vez, quem buscou este aluno foi:</Text>
                                                <Text style={{
                                                    fontWeight:'bold',
                                                    textDecorationLine:'underline',
                                                    alignSelf:'center'
                                                }}>{alunoSelecionado.ultimoRespDiario}</Text>
                                                <Text style={{
                                                    marginTop:10
                                                }}>Será essa mesma pessoa que irá buscar o aluno?</Text>
                                                <View style={{
                                                    flexDirection:'row',
                                                    justifyContent:"center",
                                                    marginTop:5
                                                }}>
                                                    <TouchableOpacity style={{
                                                        backgroundColor:  opcaoSim2 ? 'green' : 'white',
                                                        borderRadius:7,
                                                        borderWidth:1,
                                                        borderColor:'#ccc',
                                                        padding:4,
                                                    }}
                                                    onPress={()=>funcOpcaoSim2()}
                                                    >
                                                        <Text style={{
                                                            fontWeight:'bold',
                                                            color: opcaoSim2 ? 'white' : 'black'
                                                        }}>SIM</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{
                                                        backgroundColor:  opcaoNao2 ? 'green' : 'white',
                                                        borderRadius:7,
                                                        borderWidth:1,
                                                        borderColor:'#ccc',
                                                        padding:4,
                                                        marginLeft:15
                                                    }}
                                                    onPress={()=>funcOpcaoNao2()}
                                                    >
                                                        <Text style={{
                                                            fontWeight:'bold',
                                                            color: opcaoNao2 ? 'white' : 'black'
                                                        }}>NÃO</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                
                                            </View>
                                            )}
                                            
                                            {opcaoNao2.length>0 && opcaoNao1.length>0 && alunoSelecionado.nomeResponsavel != alunoSelecionado.ultimoRespDiario &&(
                                                <View style={{
                                                    marginTop:10
                                                }}>
                                                    <Text style={{
                                                fontWeight:'bold',
                                                alignSelf:'center'
                                            }}>Informe o responsável que irá buscar o aluno:</Text>
                                            <TextInput 
                                                placeholder="Digite o nome do responsável"
                                                style={{
                                                    backgroundColor:'white',
                                                    padding:4,
                                                    borderRadius:7,
                                                    elevation:4,
                                                    marginTop:'2%'
                                                }}
                                                value={txtAtualizarRespDiario}
                                                onChangeText={setTxtAtualizarRespDiario}
                                                />
                                                </View>
                                            )}
                                            <View style={{
                                                flexDirection:'row',
                                                justifyContent:'center',
                                                marginTop:15,
                                                marginBottom:-10
                                            }}>
                             {opcaoSim2.length>0 && opcaoNao1.length>0 &&(
                                                            <TouchableOpacity style={{
                                                        backgroundColor:'blue',
                                                        padding:5,
                                                        borderRadius:8,
                                                        alignSelf:'center'
                                                        }}
                                                        onPress={InformarRespDiarioUltimoRespGuardado}
                                                        >
                                                        <Text style={{
                                                            color:'white',
                                                            fontWeight:'bold',
                                                            alignSelf:'center',
                                                            fontSize:14
                                                        }}>
                                                            Informar responsável
                                                        </Text>
                                                        </TouchableOpacity> 
                                                        )}

                            {opcaoNao2.length>0 && opcaoNao1.length>0 &&(
                                                            <TouchableOpacity style={{
                                                        backgroundColor:'blue',
                                                        padding:5,
                                                        borderRadius:8,
                                                        alignSelf:'center'
                                                        }}
                                                        onPress={atualizarRespDiario}
                                                        >
                                                        <Text style={{
                                                            color:'white',
                                                            fontWeight:'bold',
                                                            alignSelf:'center',
                                                            fontSize:14
                                                        }}>
                                                            Informar responsável
                                                        </Text>
                                                        </TouchableOpacity> 
                                                        )}

                            {opcaoNao1 && alunoSelecionado.ultimoRespDiario && alunoSelecionado.ultimoRespDiario != alunoSelecionado.nomeResponsavel &&(
                            <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft: opcaoNao1 && opcaoNao2 ? 15:0 || opcaoNao1 && opcaoSim2 ? 15 : 0 || opcaoSim ? 15 : 0 || !alunoSelecionado.nomeResponsavel ? 15 : 0,
                                }}
                                onPress={()=>closeModal()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Voltar
                                </Text>
                                </TouchableOpacity>
                        )}   
                        </View>
                        </View>
                    )}
                    
                    {!alunoSelecionado.nomeResponsavel &&(
                        <View>
                            <Text style={{textDecorationLine:'underline', alignSelf:'center'}}>Nenhum responsável registrado.</Text>
                             <Text style={{marginTop:10}}>Informe um responsável para o aluno abaixo:</Text>
                             <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:14,
                        marginTop:12
                    }}>
                        Nome do responsável:
                    </Text>
                            <TextInput 
                    placeholder="Digite o nome do responsável"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                        marginTop:'2%'
                    }}
                    value={txtNomeResponsavel}
                    onChangeText={setTxtNomeResponsavel}
                    />
                    <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:14,
                        marginTop:12
                    }}>
                        Telefone para contato:
                    </Text>
                    <TextInput 
                    placeholder="Informe o telefone"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                    }}
                    value={telefoneResponsavel}
                    onChangeText={setTelefoneResponsavel}
                    />
                    <Text style={{
                                color:'black',
                                fontWeight:'bold',
                                fontSize:14,
                                marginTop:12
                            }}>
                        Algum outro telefone para contato?
                    </Text>
                    <TextInput 
                    placeholder="Informe o telefone"
                    style={{
                        backgroundColor:'white',
                        padding:4,
                        borderRadius:7,
                        elevation:4,
                    }}
                    value={telefoneResponsavel2}
                    onChangeText={setTelefoneResponsavel2}
                    />
                        </View>
                    )}

                    <View>
                        <View style={{flexDirection:"row", justifyContent:"center", marginTop:15}}>
                        
                        {opcaoSim.length>0 && !opcaoNao1.length>0 && (
                            <TouchableOpacity style={{
                                backgroundColor:'blue',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center'
                                }}
                                onPress={InformarRespDiarioPrincipal}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Informar responsável
                                </Text>
                                </TouchableOpacity>
                        )}
                        
                        {opcaoNao1.length>0 && opcaoSim.length>0 &&(
                            <TouchableOpacity style={{
                                backgroundColor:'blue',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginTop:10
                                }}
                                onPress={InformarRespDiarioUltimoRespGuardado}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Informar responsável
                                </Text>
                                </TouchableOpacity> 
                        )}
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'center'
                        }}>
                             {opcaoNao1.length>0 && !alunoSelecionado.ultimoRespDiario &&(
                                <View>
                                    <Text>
                                        Informe o responsável que irá buscar o aluno:
                                    </Text>
                                    <TextInput placeholder="Informe o nome do responsável"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                        width:300
                    }}
                    value={txtAtualizarRespDiario}
                    onChangeText={setTxtAtualizarRespDiario}
                    />          
                                <View style={{
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    marginTop:15
                                }}>
                                    <TouchableOpacity style={{
                                        backgroundColor:'blue',
                                        padding:5,
                                        borderRadius:8,
                                        alignSelf:'center'
                                        }}
                                        onPress={atualizarRespDiario}
                                        >
                                        <Text style={{
                                            color:'white',
                                            fontWeight:'bold',
                                            alignSelf:'center',
                                            fontSize:14
                                        }}>
                                            Informar responsável
                                        </Text>
                                        </TouchableOpacity> 

                                        <TouchableOpacity style={{
                                    backgroundColor:'gray',
                                    padding:5,
                                    borderRadius:8,
                                    alignSelf:'center',
                                    marginLeft: 15
                                    }}
                                    onPress={()=>closeModal()}
                                    >
                                    <Text style={{
                                        color:'white',
                                        fontWeight:'bold',
                                        alignSelf:'center',
                                        fontSize:14
                                    }}>
                                        Voltar
                                    </Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                             )}
                        
                        

                            {!alunoSelecionado.nomeResponsavel &&(
                            
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center',
                            }}
                            onPress={ALunoSemRespInformarResponsavel}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>

                            )}

                            {!opcaoNao1 && !alunoSelecionado.nomeResponsavel && (
                                <TouchableOpacity style={{
                                    backgroundColor:'gray',
                                    padding:5,
                                    borderRadius:8,
                                    alignSelf:'center',
                                    marginLeft: 15
                                    }}
                                    onPress={()=>closeModal()}
                                    >
                                    <Text style={{
                                        color:'white',
                                        fontWeight:'bold',
                                        alignSelf:'center',
                                        fontSize:14
                                    }}>
                                        Voltar
                                    </Text>
                                    </TouchableOpacity>
                            )}

                            {!opcaoNao1 && alunoSelecionado.nomeResponsavel && (
                                <TouchableOpacity style={{
                                    backgroundColor:'gray',
                                    padding:5,
                                    borderRadius:8,
                                    alignSelf:'center',
                                    marginLeft: opcaoSim? 15:0
                                    }}
                                    onPress={()=>closeModal()}
                                    >
                                    <Text style={{
                                        color:'white',
                                        fontWeight:'bold',
                                        alignSelf:'center',
                                        fontSize:14
                                    }}>
                                        Voltar
                                    </Text>
                                    </TouchableOpacity>
                            )}
                            
                                </View>
                        
                    
                        </View>
                    </View>
                </View>
            )}
                        </View>
                    )}

                    {alunoSelecionado.nomeResponsavelDiario && (
                        <View style={{
                            padding:10,
                            backgroundColor:'white',
                            borderRadius:9,
                            elevation:3
                        }}>
                            <View style={{flexDirection:'row', marginBottom:10, justifyContent:'center'}}>
                            <Text style={{fontSize:16}}>Aluno selecionado: </Text>
                            <Text style={{fontWeight:'bold', textDecorationLine:'underline', fontSize:16}}>{alunoSelecionado.nome}</Text>
                        </View>
                            <Text style={{
                                fontSize:14
                            }}>Responsável já registrado para buscar o aluno:</Text>
                            <Text style={{
                                textDecorationLine:'underline',
                                alignSelf:'center',
                                fontSize:14,
                                marginTop:5,
                                fontWeight:'bold'
                            }}>{alunoSelecionado.nomeResponsavelDiario}</Text>
                            <Text style={{
                                marginTop:7
                            }}>
                                Escolha a opção desejada:
                            </Text>

                            <View style={{
                                flexDirection:'row',
                                justifyContent:'center',
                                marginTop:10
                            }}>

                            <TouchableOpacity style={{
                                        backgroundColor: opcaoEscolhida === 'Alterar' ? '#0af8fc' : 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4,
                                        marginLeft:10
                                    }}
                                    onPress={()=>opcaoAlterar()}
                                    >
                                <Text style={{
                                    fontWeight:'bold'
                                }}>
                                    Alterar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                        backgroundColor: opcaoEscolhida === 'Remover' ? '#0af8fc': 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4,
                                        marginLeft:10
                                    }}
                                    onPress={()=>opcaoRemover()}
                                    >
                                <Text style={{
                                    fontWeight:'bold'
                                }}>
                                    Remover
                                </Text>
                            </TouchableOpacity>
                            </View>

                                    <View style={{
                                        flexDirection:'row', justifyContent:'center',
                                        marginTop:10
                                    }}>
                                    <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center'
                            }}
                            onPress={()=>acaoDaOpcao()}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Confirmar opção
                            </Text>
                            </TouchableOpacity>

                                <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft:10
                                }}
                                onPress={()=>closeModal()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                            </View>
                            
                        </View>
                    )}
                    
                </View>
                    
            </Modal>

            <Modal 
                transparent={true}
                animationType="fade"
                visible={modal2Visible}
                onRequestClose={closeModal2}
            >
                <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'rgba(0, 0, 0, 0.23)'  // Fundo escuro atrás do modal
                }}>
                        <View>
                            {alunoSelecionado.nome && (
                <View style={{
                    padding:10,
                    backgroundColor:'white',
                    borderRadius:9,
                    elevation:3
                }}>
        
                        <View style={{flexDirection:'row', marginBottom:10, justifyContent:'center'}}>
                            <Text style={{fontSize:16}}>Aluno selecionado: </Text>
                            <Text style={{fontWeight:'bold', textDecorationLine:'underline', fontSize:16}}>{alunoSelecionado.nome}</Text>
                        </View>

                    {alunoSelecionado.nomeResponsavel === alunoSelecionado.nomeResponsavelDiario &&(
                        <View>
                            <Text>
                                Informe o nome do responsável que irá buscar o aluno:
                            </Text>
                            <TextInput 
                    placeholder="Digite o nome do responsável"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                        marginTop:10
                    }}
                    value={txtAtualizarRespDiario}
                    onChangeText={setTxtAtualizarRespDiario}
                    />

                        <View style={{
                            marginTop:20,
                            flexDirection:'row',
                            justifyContent:'center',
                            marginBottom:-10
                        }}>
                            
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center'
                            }}
                            onPress={atualizarRespDiario}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>

                        <TouchableOpacity style={{
                    backgroundColor:'gray',
                    padding:5,
                    borderRadius:8,
                    alignSelf:'center',
                    marginLeft: 15
                    }}
                    onPress={()=>closeModal2()}
                    >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        alignSelf:'center',
                        fontSize:14
                    }}>
                        Voltar
                    </Text>
                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {alunoSelecionado.nomeResponsavel != alunoSelecionado.nomeResponsavelDiario &&(
                        <View>
                                <Text style={{
                                color:'black',
                                fontWeight:'bold',
                                fontSize:14,
                                }}>
                                Responsável registrado:
                                </Text>
                                <Text style={{alignSelf:"center", textDecorationLine:'underline', marginTop:5, fontWeight:"bold"}}>
                                    {alunoSelecionado.nomeResponsavel}
                                </Text>
                                <Text style={{
                                    marginTop:5
                                }}>O aluno irá embora com o responsável acima?</Text>

                                    <View style={{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                                    <TouchableOpacity style={{
                                        backgroundColor: opcaoSim ? 'green' : 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4
                                    }}
                                    onPress={()=>funcOpcaoSim()}
                                    >
                                        <Text style={{
                                            color: opcaoSim ? 'white' : 'black',
                                            fontWeight:'bold'
                                        }}>
                                            SIM
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: opcaoNao1 ? 'green' : 'white',
                                        borderRadius:7,
                                        borderWidth:1,
                                        borderColor:'#ccc',
                                        padding:4,
                                        marginLeft:15
                                    }}
                                    onPress={()=>funcOpcaoNao1()}
                                    >
                                        <Text style={{
                                            color: opcaoNao1 ? 'white' : 'black',
                                            fontWeight:'bold'
                                        }}>
                                            NÃO
                                        </Text>
                                    </TouchableOpacity>
                                    </View>

                                    {opcaoNao1.length>0 && alunoSelecionado.ultimoRespDiario && alunoSelecionado.ultimoRespDiario != alunoSelecionado.nomeResponsavel &&(
                                        <View style={{marginTop:10}}>
                                        <Text>Da ultima vez, quem buscou este aluno foi:</Text>
                                        <Text style={{
                                            fontWeight:'bold',
                                            textDecorationLine:'underline',
                                            alignSelf:'center'
                                        }}>{alunoSelecionado.ultimoRespDiario}</Text>
                                        <Text style={{
                                            marginTop:10
                                        }}>Será essa mesma pessoa que irá buscar o aluno?</Text>
                                        <View style={{
                                            flexDirection:'row',
                                            justifyContent:"center",
                                            marginTop:5
                                        }}>
                                            <TouchableOpacity style={{
                                                backgroundColor:  opcaoSim2 ? 'green' : 'white',
                                                borderRadius:7,
                                                borderWidth:1,
                                                borderColor:'#ccc',
                                                padding:4,
                                            }}
                                            onPress={()=>funcOpcaoSim2()}
                                            >
                                                <Text style={{
                                                    fontWeight:'bold',
                                                    color: opcaoSim2 ? 'white' : 'black'
                                                }}>SIM</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{
                                                backgroundColor:  opcaoNao2 ? 'green' : 'white',
                                                borderRadius:7,
                                                borderWidth:1,
                                                borderColor:'#ccc',
                                                padding:4,
                                                marginLeft:15
                                            }}
                                            onPress={()=>funcOpcaoNao2()}
                                            >
                                                <Text style={{
                                                    fontWeight:'bold',
                                                    color: opcaoNao2 ? 'white' : 'black'
                                                }}>NÃO</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </View>
                                    )}

                                    {!opcaoNao1.length>0 && !opcaoSim.length>0 &&(
                                        <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginTop:15,
                                marginBottom:-10
                                }}
                                onPress={()=>closeModal2()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                                    )}
                                    
                        </View>
                    )}
                    
                    {!alunoSelecionado.nomeResponsavel &&(
                        <View>
                            <Text style={{textDecorationLine:'underline', alignSelf:'center'}}>Nenhum responsável registrado.</Text>
                             <Text style={{marginTop:10}}>Informe um responsável para o aluno abaixo:</Text>
                             <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:14,
                        marginTop:12
                    }}>
                        Nome do responsável:
                    </Text>
                            <TextInput 
                    placeholder="Digite o nome do responsável"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                        marginTop:'2%'
                    }}
                    value={txtNomeResponsavel}
                    onChangeText={setTxtNomeResponsavel}
                    />
                    <Text style={{
                        color:'black',
                        fontWeight:'bold',
                        fontSize:14,
                        marginTop:12
                    }}>
                        Telefone para contato:
                    </Text>
                    <TextInput 
                    placeholder="Informe o telefone"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                    }}
                    value={telefoneResponsavel}
                    onChangeText={setTelefoneResponsavel}
                    />
                    <Text style={{
                                color:'black',
                                fontWeight:'bold',
                                fontSize:14,
                                marginTop:12
                            }}>
                        Algum outro telefone para contato?
                    </Text>
                    <TextInput 
                    placeholder="Informe o telefone"
                    style={{
                        backgroundColor:'white',
                        padding:4,
                        borderRadius:7,
                        elevation:4,
                    }}
                    value={telefoneResponsavel2}
                    onChangeText={setTelefoneResponsavel2}
                    />
                        </View>
                    )}

                    <View>
                        <View style={{flexDirection:"row", justifyContent:"center", marginTop:15}}>
                        
                        {opcaoNao2.length > 0 &&(

                            <View>
                                <Text>
                                Informe o responsável que irá buscar o aluno:
                            </Text>
                            <TextInput 
                    placeholder="Digite o nome do responsável"
                    style={{
                        backgroundColor:'white',
                        padding:2,
                        borderRadius:7,
                        elevation:4,
                        marginTop:10
                    }}
                    value={txtAtualizarRespDiario}
                    onChangeText={setTxtAtualizarRespDiario}
                    />
                            
                            {opcaoNao2.length>0 &&(
                                <View style={{
                                    justifyContent:'center',
                                    flexDirection:'row',
                                    marginTop:15
                                }}>
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center'
                            }}
                            onPress={atualizarRespDiario}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>

                             <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft:15
                                }}
                                onPress={()=>closeModal2()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14,
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                            </View>
                        )}
                            </View>
                        )}

                        {opcaoSim2.length > 0 &&(
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'center'
                            }}>
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center'
                            }}
                            onPress={InformarRespDiarioUltimoRespGuardado}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft:15
                                }}
                                onPress={()=>closeModal2()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14,
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>

                            </View>
                        )}

                        {opcaoSim.length > 0 &&(
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'center'
                            }}>
                            <TouchableOpacity style={{
                            backgroundColor:'blue',
                            padding:5,
                            borderRadius:8,
                            alignSelf:'center'
                            }}
                            onPress={InformarRespDiarioPrincipal}
                            >
                            <Text style={{
                                color:'white',
                                fontWeight:'bold',
                                alignSelf:'center',
                                fontSize:14
                            }}>
                                Informar responsável
                            </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                marginLeft:15
                                }}
                                onPress={()=>closeModal2()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14,
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                            </View>
                        )}

                        {opcaoNao1.length>0 && !opcaoNao2.length>0 && !opcaoSim2.length>0 && (
                            <TouchableOpacity style={{
                                backgroundColor:'gray',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center',
                                }}
                                onPress={()=>closeModal2()}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14,
                                }}>
                                    Voltar
                                </Text>
                            </TouchableOpacity>
                        )}

                        {!alunoSelecionado.nomeResponsavel &&(
                            <TouchableOpacity style={{
                                backgroundColor:'blue',
                                padding:5,
                                borderRadius:8,
                                alignSelf:'center'
                                }}
                                onPress={ALunoSemRespInformarResponsavel}
                                >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    alignSelf:'center',
                                    fontSize:14
                                }}>
                                    Informar responsável
                                </Text>
                                </TouchableOpacity>
                        )}
                               
                        </View>
                        
                    </View>
                </View>
            )}
            
                        </View>
            
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