import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const navigation = useNavigation

export default function TodosFilme() {
    const db = new DatabaseConnection.getConnection
    const [todos, setTodos] = useState([])
    const [descricao, setDescicao] = useState();
    const [genero, setGenero] = useState();
    const [data, setData] = useState();
    const [classf, setClassf] = useState()
    const [id, setId] = useState();
    const [modal, setModal] = useState(false)


    useEffect(() => {
        atualizaFilme()
    }, [])

    const atualizaFilme = () => {
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM filmes1",
                [], (_, { rows }) =>
                setTodos(rows._array)

            )
        })
    }

    const handleEditPress = (nomeFilm, id, genero, clas) => {
        setDescicao(nomeFilm);
        setId(id);
        setGenero(genero);
        setClassf(clas);
        setModal(true);
    };

    const editarFilme = () => {
        db.transaction(tx => {
            tx.executeSql("UPDATE filmes1 set nome_filme=?, genero=?, classificacao=? where id=?",
                [descricao, genero, classf, id],
                (_, { rowsAffected }) => {
                    if (rowsAffected === 1) {
                        atualizaFilme()
                        Alert.alert("Sucesso", "Registro alterado com sucesso")
                    } else if (rowsAffected === 0)
                        Alert.alert("Erro", "O registro não foi localizado")
                },
                (_, error) => {
                    console.error("erro ao adicionar um filme", error),
                        Alert.alert("Erro", "ocorreu um erro ao adicionar um filme")
                }
            )
        })
    }

    const excluirFilme = id => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM filmes1 WHERE id = ?',
                    [id], (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaFilme();
                            Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum registro foi excluído, vertifique e tente novamente!');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao excluir o filme:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao excluir o filme.');
                    }
                );
            }
        );
    };

    return (
        <View>
            <ScrollView>
                <View>
                    {todos.map(filmes => (
                        <View key={filmes.id}>
                            <Text>ID: {filmes.id}</Text>
                            <Text>DESCRIÇÃO: {filmes.nome_filme}</Text>
                            <Text>GENERO: {filmes.genero}</Text>
                            <Text>CLASSIFICAÇÃO: {filmes.classificacao}</Text>
                            <Text>DATA: {filmes.data}</Text>
                            <TouchableOpacity onPress={() => handleEditPress(filmes.nome_filme, filmes.id, filmes.genero, filmes.classificacao)}>
                                <FontAwesome6 name='pen-to-square' color={'green'} size={24} />
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Atenção!",
                                        'Deseja excluir o registro selecionado?',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => excluirFilme(filmes.id)
                                            },
                                            {
                                                text: 'Cancelar',
                                                onPress: () => { return },
                                                style: 'cancel',
                                            }
                                        ],
                                    )
                                }}>
                                    <FontAwesome6 name='trash-can' color={'red'} size={24} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}


                </View>
            </ScrollView>





            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal);
                }}
            // A propriedade onRequestClose do componente Modal do React Native é usada para especificar uma função que será chamada quando o usuário tentar fechar o modal, geralmente através do botão "Voltar" no Android ou ao tocar fora do modal.
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Editando Filme</Text>
                        <TextInput
                            style={styles.input}
                            value={descricao}
                            onChangeText={setDescicao}
                            placeholder="Nome do Filme"
                        />
                        <TextInput
                            value={genero}
                            onChangeText={setGenero}
                            placeholder="Nome do Genero"
                        >
                        </TextInput>

                        <TextInput
                            value={classf}
                            onChangeText={setClassf}
                            placeholder="Nome do Classificação"
                        >
                        </TextInput>



                        <View style={styles.saveButton}>
                            <Button title="Salvar" onPress={() => {
                                editarFilme()
                                setModal(false);

                            }} />
                            <Button title="Cancelar" onPress={() => setModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    containerScroll: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filmeItem: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        elevation: 5, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#333',
        color: '#fff',
        fontSize: 16,
    },

});