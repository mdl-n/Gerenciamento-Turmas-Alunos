import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { db } from "../cfg/firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function TelaGerenciamento(){
    const Navigation = useNavigation();

    const [turmas, setTurmas] = useState([]);

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
            exibirTurmas();
        }, [])
    );
    const limparTurmasLiberadas = async () => {
        Alert.alert('', 'Ok. limpando as turmas liberadas...');
        
        try {
            for (let turma of turmas) {
                const turmaRef = doc(db, 'turmas', turma.id);

                await updateDoc(turmaRef, {
                    turmaLiberada: false,
                    horaLiberacao: null
                });
    
                if (turma.alunos && Array.isArray(turma.alunos) && turma.alunos.length > 0) {
                    const alunosAtualizados = turma.alunos.map(aluno => {

                        return {
                            ...aluno,
                            alunoLiberado: false,
                            nomeResponsavelDiario: null
                        };
                    });
    
                    // Atualiza o subdocumento com os alunos atualizados
                    await updateDoc(turmaRef, { alunos: alunosAtualizados });
                }
            }
    
        } catch (error) {
            console.error("Erro ao atualizar turma no Firestore:", error);
            Alert.alert('Erro', 'Ocorreu um erro ao limpar as turmas.');
        }
        Alert.alert('', 'Turmas liberadas limpadas com sucesso!');
    };

    function confirmarOpcao(){
        Alert.alert('','Deseja realmente limpar todas as turmas liberadas?',[
                {
                    text:'Cancelar',
                    style:'cancel',
                },
                {
                    text:'Confirmar',
                    onPress: ()=> limparTurmasLiberadas(),
                }
            ],
            {cancelable:true}
        );
    }

    return (
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
            }}>Opções de Gerenciamento</Text>
            
            <Text style={{
                marginTop:'10%',
                fontWeight:'bold',
                fontSize:16,
                alignSelf:'center'
            }}>Gerenciamento de Turmas</Text>
            <View style={{
                elevation:4,
                backgroundColor:'white',
                borderRadius:7,
               justifyContent:'center',
               padding:7,
               marginTop:'1%',
               width:'100%'
            }}>
                
                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center' 
                }}
                onPress={()=>Navigation.navigate('LiberarTurma')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Liberar turma
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>confirmarOpcao()}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Limpar turmas liberadas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('AddTurma')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Adicionar turma
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('RemoverTurma')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Remover turma
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{
                marginTop: 20,
                fontWeight:'bold',
                fontSize:16,
                alignSelf:'center'
            }}>Gerenciamento de Alunos</Text>
            <View style={{
                elevation:4,
                backgroundColor:'white',
                borderRadius:7,
               justifyContent:'center',
               padding:7,
               marginTop:'1%'
            }}>
                
                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',  
                }}
                onPress={()=>Navigation.navigate('InformarResponsavel')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Informar o responsável do aluno
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('InformarResponsavel')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}
                    onPress={()=>Navigation.navigate('InformarTransporteAluno')}
                    >
                        Informar a rota de ônibus do aluno
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                backgroundColor:'blue',
                padding:5,
                borderRadius:8,
                width:"100%",
                marginTop:'2%',
                alignSelf:'center'
                }}
                onPress={()=>Navigation.navigate('SaidaalunosCResp')}
                >
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    alignSelf:'center',
                    fontSize:16
                }}>
                    Informar alunos que irão com responsáveis
                </Text>
            </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('AddAluno')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Adicionar aluno
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('RemoverAluno')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Remover aluno
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor:'blue',
                    borderRadius:7,
                    padding:5,
                    alignItems:'center',
                    marginTop:'2%'
                }}
                onPress={()=>Navigation.navigate('AlterarTurma')}
                >
                    <Text style={{
                        color:'white',
                        fontWeight:'bold',
                        fontSize:16
                    }}>
                        Transferir aluno de turma
                    </Text>
                </TouchableOpacity>

            </View>
            <TouchableOpacity style={{
                backgroundColor:'gray',
                padding:5,
                borderRadius:9,
                width:"35%",
                marginTop:'7%',
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