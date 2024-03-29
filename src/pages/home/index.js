import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const db = new DatabaseConnection.getConnection

export default function Home() {
    const [registro, setRegistro] = useState([])

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

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS filmes1 (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_filme TEXT , genero TEXT, classificacao TEXT, data TEXT )",
                [],
                () => console.log("tabela filmes criada com sucesso"),
                (er, error) => console.log(er, error),
            )
        })
    }, []);

    const deleteDatabase = () => {
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
                                console.log(`Tabela ${table.name} excluida com sucesso`);
                                setRegistro([])
                            },
                            (_, error) => {
                                console.error(`Erro ao excluir a tabela ${table.nome}:`, error);
                                Alert.alert("Erro", `Ocorreu um erro ao excluir a tabela ${table.nome}`)
                            }
                        )
                    })
                }
            )
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={{gap:30, alignItems:"center"}}>
                <TouchableOpacity Text="Cadastro" onPress={navegaCadastro} style={styles.button}><Text style={{ color: "white" }}>Cadastro</Text></TouchableOpacity>
                <TouchableOpacity Text="PesquisaFilme" onPress={navegaPesquisaFilme} style={styles.button}><Text style={{ color: "white" }}>Pesquisa Filme</Text></TouchableOpacity>
                <TouchableOpacity Text="TodosFimes" onPress={navegaTodosFilme} style={styles.button}><Text style={{ color: "white" }}>Todos Filmes</Text></TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        "Atenção",
                        "Deseja excluir o banco de dados do sistema? Esta ação não pode ser revertida ",
                        [
                            {
                                text: "OK",
                                onPress: () => deleteDatabase()
                            },
                            {
                                text: "Cancelar",
                                onPress: () => { return }
                            }
                        ]
                    )
                }
                }><FontAwesome6 name="trash" color="black" size={20}>
                    </FontAwesome6></TouchableOpacity>
            </View>


        </SafeAreaView>



    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
     

    },
    button: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: "center",
        width: "70%",
        height: "25%",
        backgroundColor: "blue",
        borderRadius: 10,
       

    },


});