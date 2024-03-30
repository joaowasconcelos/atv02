import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default function TodosFilme() {
    const db = new DatabaseConnection.getConnection();
    const [todos, setTodos] = useState([]);
    const [descricao, setDescricao] = useState("");
    const [genero, setGenero] = useState("");
    const [classf, setClassf] = useState("");
    const [id, setId] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        atualizaFilme();
    }, []);

    const atualizaFilme = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM filmes1",
                [],
                (_, { rows }) => setTodos(rows._array)
            );
        });
    };

    const handleEditPress = (nomeFilm, id, genero, clas) => {
        setDescricao(nomeFilm);
        setId(id);
        setGenero(genero);
        setClassf(clas);
        setModal(true);
    };

    const editarFilme = () => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE filmes1 SET nome_filme=?, genero=?, classificacao=? WHERE id=?",
                [descricao, genero, classf, id],
                (_, { rowsAffected }) => {
                    if (rowsAffected === 1) {
                        atualizaFilme();
                        Alert.alert("Sucesso", "Registro alterado com sucesso");
                    } else if (rowsAffected === 0) {
                        Alert.alert("Erro", "O registro não foi localizado");
                    }
                },
                (_, error) => {
                    console.error("Erro ao editar o filme", error);
                    Alert.alert("Erro", "Ocorreu um erro ao editar o filme");
                }
            );
        });
        setModal(false);
    };

    const excluirFilme = id => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM filmes1 WHERE id = ?',
                    [id],
                    (_, { rowsAffected }) => {
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
        <View style={styles.container}>
            <ScrollView>
                {todos.map(filmes => (
                    <View key={filmes.id} style={styles.itemContainer}>
                        <Text style={styles.text}>ID: {filmes.id}</Text>
                        <Text style={styles.text}>DESCRIÇÃO: {filmes.nome_filme}</Text>
                        <Text style={styles.text}>GENERO: {filmes.genero}</Text>
                        <Text style={styles.text}>CLASSIFICAÇÃO: {filmes.classificacao}</Text>
                        <Text style={styles.text}>DATA: {filmes.data}</Text>

                        <View style={{flexDirection:"row",gap:10}}>

                            <TouchableOpacity onPress={() => handleEditPress(filmes.nome_filme, filmes.id, filmes.genero, filmes.classificacao)}>
                                <FontAwesome6 name='pen-to-square' color={'green'} size={24} />
                            </TouchableOpacity>

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
                                            onPress: () => { },
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
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editando Filme</Text>
                        <TextInput
                            style={styles.input}
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Nome do Filme"
                        />
                        <TextInput
                            style={styles.input}
                            value={genero}
                            onChangeText={setGenero}
                            placeholder="Nome do Gênero"
                        />
                        <TextInput
                            style={styles.input}
                            value={classf}
                            onChangeText={setClassf}
                            placeholder="Classificação"
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Salvar" onPress={editarFilme} />
                            <Button title="Cancelar" onPress={() => setModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: 250,
        height: 180,
    },
    text: {
        marginBottom: 5,
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
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
