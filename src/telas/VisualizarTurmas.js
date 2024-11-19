import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Linking, Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import moment from "moment-timezone";


export default function VisualizarTurmas(){
    const Navigation = useNavigation();

    const [apertadoBtn1Turno, setApertadoBtn1Turno] = useState(false);
    const [apertadoBtn2Turno, setApertadoBtn2Turno] = useState(false);
    const [apertadoBtn3Turno, setApertadoBtn3Turno] = useState(false);

    const [turnoEscolhido, setTurnoEscolhido] = useState('');
    const [numeroTurmaEscolhida, setNumeroTurmaEscolhida] = useState('');
    const [turmas, setTurmas] = useState([]);

    function apertouBtn1Turno(){
        if(apertadoBtn2Turno || apertadoBtn3Turno){
            setAlunosDaTurma([]);
            setDadosTurmaEscolhida([]);
        } 
        setApertadoBtn1Turno(!apertadoBtn1Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn1Turno ? 'Manhã' : '');

        if (apertadoBtn1Turno === true){
            setAlunosDaTurma([])
            setDadosTurmaEscolhida([]);
        }
    }

    function apertouBtn2Turno(){
        if(apertadoBtn1Turno || apertadoBtn3Turno){
            setAlunosDaTurma([]);
            setDadosTurmaEscolhida([]);
        }
        setApertadoBtn2Turno(!apertadoBtn2Turno);
        setApertadoBtn1Turno(false);
        setApertadoBtn3Turno(false);
        setTurnoEscolhido(!apertadoBtn2Turno ? 'Tarde' : '');

        if (apertadoBtn2Turno === true){
            setAlunosDaTurma([])
            setDadosTurmaEscolhida([]);
        }
    }

    function apertouBtn3Turno(){
        if(apertadoBtn1Turno || apertadoBtn2Turno){
            setAlunosDaTurma([]);
            setDadosTurmaEscolhida([]);
        }
        setApertadoBtn3Turno(!apertadoBtn3Turno);
        setApertadoBtn2Turno(false);
        setApertadoBtn1Turno(false);
        setTurnoEscolhido(!apertadoBtn3Turno ? 'Noite' : '');

        if (apertadoBtn3Turno === true){
            setAlunosDaTurma([])
            setDadosTurmaEscolhida([]);
        }
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
    useFocusEffect(
        React.useCallback(() => {
            setApertadoBtn1Turno(false);
            setApertadoBtn2Turno(false);
            setApertadoBtn3Turno(false);
            setTurnoEscolhido('');
            setAlunoAlertModal('')
            setAlunosDaTurma([]);
            setTurnoEscolhido('');
            exibirTurmas();
        }, [])
    );

    const [alunosDaTurma, setAlunosDaTurma] = useState([]);

    const visualizarAlunosDaTurma = async (turma) => {
        if(turma.alunos.length === 0){
            Alert.alert('','Nenhum aluno registrado na turma selecionada!')
            return;
        }
    
        if (turma.numeroTurma != numeroTurmaEscolhida) { // Verifica se a turma foi apertada (estadoBtn = true)
            
            try {
                // Faz a consulta no Firestore usando o numeroTurma
                const querySnapshot = await getDocs(
                    query(collection(db, 'turmas'), where('numeroTurma', '==', turma.numeroTurma))
                );
    
                if (!querySnapshot.empty) {
                    const turmaDoc = querySnapshot.docs[0]; // Pega o primeiro documento encontrado
                    const turmaData = turmaDoc.data();
                    const alunos = turmaData.alunos || [];
                    setAlunosDaTurma(alunos); // Armazena os alunos no estado
                    setDadosTurmaEscolhida(turma)
                } else {
                    Alert.alert('', 'Turma não encontrada!');
                }
                setNumeroTurmaEscolhida(turma.numeroTurma)
            } catch (error) {
                console.log(error);
                Alert.alert('', 'Erro ao buscar alunos da turma!');
            }
            
        } else {
            setAlunosDaTurma([]); // Oculta os alunos quando a turma é "desapertada"
            setNumeroTurmaEscolhida('');
        }
    };

    const [alunoAlertModal, setAlunoAlertModal] = useState('');
    const [dadosDoAluno, setDadosDoAluno] = useState([]);
    const [dadosTurmaEscolhida, setDadosTurmaEscolhida] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (aluno) => {
        setAlunoAlertModal(aluno.nome);
   setDadosDoAluno(aluno);
   setModalVisible(true);
      };
    
      const closeModal = () => {
        setModalVisible(false);
      };
    
      const ligarTel = (dadosDoAluno) => {
        Linking.openURL(`tel:${dadosDoAluno.telefoneResponsavel}`);
      };
      const ligarTel2 = (dadosDoAluno) => {
        Linking.openURL(`tel:${dadosDoAluno.telefoneResponsavel2}`);
      };

    return(
        <ScrollView contentContainerStyle={{
            flexGrow:1,
            justifyContent:'center',
            padding:20
        }}>
        <View style={{
           justifyContent:'center',
           alignItems:'center',
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
            }}>Visualizar turmas liberadas</Text>
            
            <View style={{
                flexDirection:'row',
                justifyContent:'center',
                marginTop:20,
                alignItems:'center',
            }}>
                <TouchableOpacity style={{
                    backgroundColor:'green',
                    height:15,
                    width:15,
                    borderRadius:5
                }}>
                    <Text>

                    </Text>
                </TouchableOpacity>
                <Text style={{
                    marginLeft:5
                }}>Turma Liberada</Text>

                <TouchableOpacity style={{
                    backgroundColor:'red',
                    height:15,
                    width:15,
                    borderRadius:5,
                    marginLeft:15
                }}>
                    <Text>

                    </Text>
                </TouchableOpacity>
                <Text style={{
                    marginLeft:5
                }}>Turma não Liberada</Text>

            </View>
            <Text style={{
                marginTop:30,
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
                        }}>Turmas do 1° turno:</Text>
                        {turmas.filter(turma=> turma.turnoTurma === 'Manhã').length === 0 ? 
                        (<Text>Nenhuma turma registrada.</Text>) : (
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%',
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Manhã')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={() =>visualizarAlunosDaTurma(turma)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold'
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }  
                    </View>
                        )}
                    </View>
                )}
                
                {apertadoBtn2Turno && (
                    <View style={{padding:3}}>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Turmas do 2° turno:</Text>
                        {turmas.filter(turma=> turma.turnoTurma === 'Tarde').length === 0 ? 
                        (<Text>Nenhuma turma registrada.</Text>) : (
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%',
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Tarde')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={() =>visualizarAlunosDaTurma(turma)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold'
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }  
                    </View>
                        )}
                    </View>
                )}
                {apertadoBtn3Turno && (
                    <View style={{padding:3}}>
                        <Text style={{
                            fontWeight:'bold',
                            marginTop:'3%'
                        }}>Turmas do 3° turno:</Text>
                        {turmas.filter(turma=> turma.turnoTurma === 'Noite').length === 0 ? 
                        (<Text>Nenhuma turma registrada.</Text>) : (
                    <View style={{
                        flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'center',
                        marginTop:'2%',
                    }}>
                    {turmas.filter(turma => turma.turnoTurma === 'Noite')
                    .sort((a,b) => parseInt(a.numeroTurma,10) - parseInt(b.numeroTurma,10))
                    .map(turma => (
                        <TouchableOpacity key={turma.id}
                        onPress={() =>visualizarAlunosDaTurma(turma)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
                            marginLeft:'1%',
                            marginTop:'1%',
                            padding:5,
                            borderRadius:7
                        }}>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold'
                                
                            }}>
                                {turma.numeroTurma}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }  
                    </View>
                        )}
                    </View>
                )}
            </View>

            {alunosDaTurma.length > 0 && (
                <View style={{
                    marginTop:13,
                    flex:1,
                    width:'100%'
                }}>

                        <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            alignSelf:"center"
                        }}>{dadosTurmaEscolhida.horaLiberacao ? 'Turma liberada as: '+dadosTurmaEscolhida.horaLiberacao : null}
                        </Text>

                        <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            marginTop:8
                        }}>Alunos da turma {numeroTurmaEscolhida}:</Text>
                            {alunosDaTurma.map((aluno, index ) =>(
                                <Text key={index}
                                style={{
                                    backgroundColor: 'white',
                                    marginLeft:'1%',
                                    marginTop:'1%',
                                    padding:5,
                                    borderRadius:7,
                                    borderWidth:1,
                                    borderColor:'#ccc',
                                }}
                                onPress={()=>openModal(aluno)}
                                >{aluno.nome}</Text>
                            ))}
                </View>
            )}
           <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={{ 
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        alignItems: 'center', 
        elevation: 5, 
      }}>
        <View style={{flexDirection:"row"}}>
            <Text>Informações do aluno: </Text>
        <Text style={{fontWeight:'bold'}}>{alunoAlertModal}</Text>
        </View>
                <Text style={{
                    marginTop:"5%",
                    alignSelf:'center'
                }}>O aluno irá embora sozinho?
                </Text>
                {dadosDoAluno.nomeResponsavelDiario &&(
                     <TouchableOpacity style={{
                        backgroundColor: 'red',
                        padding:5,
                        height:30,
                        borderRadius:7,
                        alignSelf:'center',
                        marginTop:'2%'
                    }}>
                        <Text style={{
                            color:'white',
                            alignSelf:'center',
                            fontWeight:'bold'
                        }}>
                        NÃO
                        </Text>
                    </TouchableOpacity>
                )}
               {!dadosDoAluno.nomeResponsavelDiario && !dadosDoAluno.tipoTransporte &&(
                
                    <Text style={{
                        textDecorationLine:'underline',
                        fontWeight:'bold'
                    }}>
                        Ainda não informado
                    </Text>
                
               )}
               {dadosDoAluno.tipoTransporte && !dadosDoAluno.nomeResponsavelDiario &&(
                 <TouchableOpacity style={{
                    backgroundColor: 'green',
                    padding:5,
                    height:30,
                    borderRadius:7,
                    alignSelf:'center',
                    marginTop:'2%'
                }}>
                    <Text style={{
                        color:'white',
                        alignSelf:'center',
                        fontWeight:'bold'
                    }}>
                    SIM
                    </Text>
                </TouchableOpacity>
               )}

                {!dadosDoAluno.nomeResponsavelDiario &&(
                    <View>
                        <Text style={{
                    marginTop:10
                }}>Qual é a rota de ônibus do aluno?</Text>
                <TouchableOpacity>
                    <Text style={{
                        textDecorationLine:'underline',
                        alignSelf:'center',
                        fontWeight:'bold'
                    }}>
                        {dadosDoAluno.tipoTransporte ? dadosDoAluno.tipoTransporte : 'Ainda não informado'}
                    </Text>
                </TouchableOpacity>
                    </View>
                )}
                
                
                        <View>
                        {dadosDoAluno.nomeResponsavelDiario && (
                                <View>
                                    <Text style={{
                                    marginTop:10
                                }}>responsável que irá buscar o aluno:</Text>
                                <Text style={{
                                    textDecorationLine:'underline',
                                    fontWeight:'bold',
                                    alignSelf:'center'
                                }}>{dadosDoAluno.nomeResponsavelDiario}
                                </Text>
                                </View>
                            )}
                            <Text style={{
                                marginTop:10
                            }}>Nome do responsável:</Text>
                            <Text style={{
                                textDecorationLine:'underline',
                                fontWeight:'bold',
                                alignSelf:'center'
                            }}>{dadosDoAluno.nomeResponsavel ? dadosDoAluno.nomeResponsavel : 'Ainda não informado'}</Text>

                            {dadosDoAluno.telefoneResponsavel&&(
                                <View>
                                    <Text style={{
                                marginTop:10
                            }}>Telefone de contato:</Text>
                            <Text style={{
                                textDecorationLine:'underline',
                                fontWeight:'bold',
                                alignSelf:'center'
                            }}
                            onPress={()=>ligarTel(dadosDoAluno)}
                            >{dadosDoAluno.telefoneResponsavel}</Text>
                                </View>
                            )}

                            {dadosDoAluno.telefoneResponsavel2 &&(
                                <View>
                                    <Text style={{
                                        marginTop:10
                                    }}>Telefone de contato 2:</Text>
                                    <Text style={{
                                        textDecorationLine:'underline',
                                        fontWeight:'bold',
                                        alignSelf:'center'
                                    }}
                                    onPress={()=>ligarTel2(dadosDoAluno)}
                                    >{dadosDoAluno.telefoneResponsavel2}</Text>
                                </View>
                                
                            )}

                        </View>
                    
                    <TouchableOpacity style={{
                        backgroundColor:'#ccc',
                        borderRadius:7,
                        elevation:2,
                        padding:3,
                        marginTop:20
                    }}
                    onPress={()=>closeModal()}
                    >
                        <Text style={{
                            fontWeight:'bold',
                            color:'black',
                        }}>Voltar</Text>
                    </TouchableOpacity>
      </View>
    </View>
  </Modal>
</View>
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"40%",
                marginTop:50,
                alignSelf:'center'
                }}
                onPress={()=>Navigation.navigate('TelaMenu')}
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