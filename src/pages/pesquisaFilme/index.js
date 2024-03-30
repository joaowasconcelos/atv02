import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { DatabaseConnection } from '../../database/database';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    const db = new DatabaseConnection.getConnection();
    const [input, setInput] = useState('');
    const [resultado, setResultado] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const handleButtonClick = () => {
        setModalVisible(true);
    };

    // const limpaTela = () => {
    //     setResultado([]);
    //     setInput("");
    // };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const procurarFilme = () => {
        if (!input.trim()) {
            Alert.alert('Erro', 'Por favor, insira um termo para pesquisar o filme.');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM filmes1 WHERE nome_filme LIKE ? OR id LIKE ?',
                [`%${input}%`, `%${input}%`],
                (_, { rows }) => {
                    if (rows.length === 0) {
                        Alert.alert('Erro', 'Filme não encontrado');
                    } else {
                        setResultado(rows._array);
                    }
                }
            );
        });
    };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>PESQUISAR UM FILME</Text>
                        <TouchableOpacity onPress={handleButtonClick}>
                            <FontAwesome6 name='circle-info' size={25} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            placeholder="Digite o nome do filme ou o ID"
                        />
                        <Button title="Procurar" onPress={procurarFilme} />
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={styles.columnHeader}>ID</Text>
                        <Text style={styles.columnHeader}>DESCRIÇÃO</Text>
                        <Text style={styles.columnHeader}>GÊNERO</Text>
                        <Text style={styles.columnHeader}>CLASSIFICAÇÃO</Text>
                        <Text style={styles.columnHeader}>DATA</Text>
                    </View>

                    {resultado.map(filme => (
                        <View key={filme.id} style={styles.tableRow}>
                            <Text style={styles.rowItem}>{filme.id}</Text>
                            <Text style={styles.rowItem}>{filme.nome_filme}</Text>
                            <Text style={styles.rowItem}>{filme.genero}</Text>
                            <Text style={styles.rowItem}>{filme.classificacao}</Text>
                            <Text style={styles.rowItem}>{filme.data}</Text>
                        </View>
                    ))}

                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleModalClose}
                >
                    <TouchableOpacity
                        style={styles.modalBackground}
                        activeOpacity={1}
                        onPressOut={handleModalClose}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Você pode pesquisar o filme pelo ID ou pela descrição.</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* <TouchableOpacity onPress={limpaTela} style={{height:"20%"}}>
                    <FontAwesome6 name="rotate-right" color="black" size={24} />
                </TouchableOpacity> */}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        marginBottom: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    columnHeader: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingVertical: 5,
        borderRadius: 5,
    },
    rowItem: {
        flex: 1,
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        maxWidth: '80%',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
