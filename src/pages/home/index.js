import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default function Home() {
    const db = new DatabaseConnection.getConnection
    const [registro, setRegistro] = useState([]);
    const [modal, setModal] = useState(false)
    const [inputSenha, setInputSenha] = useState();
    const [modalVisible, setModalVisible] = useState(false);

    const handleButtonClick = () => {
        setModalVisible(true);
        setInputSenha("")
    };

    const navigation = useNavigation()

    function navegaCadastro() {
        navigation.navigate('cadastro')
    }

    function navegaPesquisaFilme() {
        navigation.navigate('pesquisaFilme')
    }

    function navegaTodosFilme() {
        navigation.navigate('todosFilme')
    }

    function senha() {
        const senhaCorreta = "1234";
        if (inputSenha == null || inputSenha == "") {
            Alert.alert("Erro", "Insira uma senha")
        }
        else if (inputSenha !== senhaCorreta) {
            Alert.alert("Erro", "Senha inválida");
            setInputSenha("")
        } else {
            deleteDatabase();
        }
    }


    function deleteDatabase() {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                [],
                (_, { rows }) => {
                    rows._array.forEach(table => {
                        tx.executeSql(
                            `DROP TABLE IF EXISTS ${table.name}`,
                            [],
                            () => {
                                console.log(`Tabela ${table.name} excluída com sucesso`);
                                setRegistro([]);
                                Alert.alert("Sucesso", "Banco de dados excluído com sucesso");
                                setInputSenha("")
                            },
                            (_, error) => {
                                console.error(`Erro ao excluir a tabela ${table.nome}:`, error);
                                Alert.alert("Erro", `Ocorreu um erro ao excluir a tabela ${table.nome}`);
                            }
                        );
                    });
                }
            );
        });
    }


    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS filmes1 (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_filme TEXT , genero TEXT, classificacao TEXT, data TEXT )",
                [],
                () => console.log("tabela filmes criada com sucesso"),
                (er, error) => console.log(er, error),
            )
        })
    }, []);




    return (
       
            <SafeAreaView style={styles.container}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity Text="Cadastro" onPress={navegaCadastro} style={[styles.button, { backgroundColor: "green" }]}><FontAwesome6 name="circle-plus" color="black" size={90}></FontAwesome6><Text style={styles.buttonText}>Cadastro</Text></TouchableOpacity>
                    <TouchableOpacity Text="PesquisaFilme" onPress={navegaPesquisaFilme} style={[styles.button, { backgroundColor: "orange" }]}><FontAwesome6 name="magnifying-glass" color="black" size={90}></FontAwesome6><Text style={styles.buttonText}>Pesquisa Filme</Text></TouchableOpacity>
                    <TouchableOpacity Text="TodosFimes" onPress={navegaTodosFilme} style={[styles.button, { backgroundColor: "blue" }]}><FontAwesome6 name="clapperboard" color="black" size={90}></FontAwesome6><Text style={styles.buttonText}>Todos Filmes</Text></TouchableOpacity>
                </View>

                <View style={styles.deleteButtonContainer}>
                    <TouchableOpacity onPress={handleButtonClick}>
                        <FontAwesome6 name="trash" color="black" size={20}></FontAwesome6>
                    </TouchableOpacity>
                </View>



                <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{ color: "white" }}>DIGITE A SENHA:</Text>
                            <TextInput
                                style={styles.input}
                                value={inputSenha}
                                onChangeText={setInputSenha}
                                keyboardType="numeric"
                            />

                            <View style={styles.saveButton}>
                                <Button title="DELETAR" onPress={senha} />
                                <Button title="Cancelar" onPress={() => setModalVisible(false)} />

                            </View>
                        </View>
                    </View>
                </Modal>
                </KeyboardAvoidingView>


            </SafeAreaView>
        



    )
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height:"100%"
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      
    },
    buttonContainer: {
        flexDirection: 'column',
        marginBottom: 20,
        gap: 30,
        marginTop:50
    },
    button: {
        width: '50%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,

    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center',
    },
    deleteButtonContainer: {
        width: "100%",
        paddingLeft: 20,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    modalContent: {
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
        width: '80%',

    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    saveButton:{
        gap:10, 
        
    }


});