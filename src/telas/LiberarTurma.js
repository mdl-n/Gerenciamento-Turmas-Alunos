import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import moment from "moment-timezone";

export default function LiberarTurma(){
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

    const liberacaoDeTurma = async(id) => {
        
        try {

            const turmaRef = doc(db, 'turmas', id);
            const turmaSnapshot = await getDoc(turmaRef);
            const turma = {id: turmaSnapshot.id, ...turmaSnapshot.data()};

           const novaLiberacao = !turma.turmaLiberada;

            await updateDoc(turmaRef, {
                turmaLiberada: novaLiberacao,
                horaLiberacao: novaLiberacao ? moment().tz('America/Sao_Paulo').format('HH:mm:ss') : null 
            });

            setTurmas(prevTurmas => 
                prevTurmas.map(
                t => t.id === id ? {
                    ...t, turmaLiberada: novaLiberacao }: t)
            );

            if (turma.alunos && Array.isArray(turma.alunos) && turma.alunos.length > 0) {
                const alunosAtualizados = turma.alunos.map(aluno => ({
                    ...aluno,
                    alunoLiberado: novaLiberacao // Adiciona ou atualiza o status de liberação
                }));
    
                // Se os alunos estão em um subdocumento, você pode atualizar assim
                await updateDoc(turmaRef, { alunos: alunosAtualizados });
            }

        } catch (error) {
            console.error("Erro ao atualizar turma no Firestore:", error);
        }
    };

    const informarSaidaDeAlunoComResponsavel = async() => {
        
        try {

            const turmaRef = doc(db, 'turmas', id);
            const turmaSnapshot = await getDoc(turmaRef);
            const turma = {id: turmaSnapshot.id, ...turmaSnapshot.data()};

           const novaLiberacao = !turma.alunos.id.alunoLiberado;

            if (turma.alunos && Array.isArray(turma.alunos) && turma.alunos.length > 0) {
                const alunosAtualizados = turma.alunos.map(aluno => ({
                    ...aluno,
                    alunoLiberado: novaLiberacao // Adiciona ou atualiza o status de liberação
                }));
    
                // Se os alunos estão em um subdocumento, você pode atualizar assim
                await updateDoc(turmaRef, { alunos: alunosAtualizados });
            }

        } catch (error) {
            console.error("Erro ao atualizar turma no Firestore:", error);
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
            }}>Liberação de Turmas</Text>

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
                marginTop:25,
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
                        }}>Clique na turma para liberar:</Text>
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
                        onPress={()=>liberacaoDeTurma(turma.id)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
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
                        }}>Clique na turma para liberar:</Text>
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
                        onPress={()=>liberacaoDeTurma(turma.id)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
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
                        }}>Clique na turma para liberar:</Text>
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
                        onPress={()=>liberacaoDeTurma(turma.id)}
                        style={{
                            backgroundColor: turma.turmaLiberada? 'green' : 'red',
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
                backgroundColor:'gray',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:30,
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