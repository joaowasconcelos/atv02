import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import { DatabaseConnection } from '../../database/database'

export default function App() {
    const db = new DatabaseConnection.getConnection;
    const [input, setInput] = useState('')
    const [resultado, setResultado] = useState([])

    const procurarFilme = () => {
        if (input.trim() === '' || input === null) {
            Alert.alert('Erro', 'Se você não digitar nada, não tem como procurar o filme.');
            return;
        }
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM filmes1 WHERE genero LIKE ? OR nome_filme LIKE ?',
                [`%${input}%`, `%${input}%`],
                (_, { rows }) => {
                    setResultado(rows._array);
                }
            );
        });
    };

    return (
        <View>
            <TextInput
                placeholder="Entre com o nome do filme ou ID"
                value={input}
                onChangeText={setInput}
            />
            <Button title="Procurar" onPress={procurarFilme} />
            <View>
                {resultado.map(filmes => (
                    <View key={filmes.id}>
                        <Text>ID: {filmes.id}</Text>
                        <Text>DESCRIÇÃO: {filmes.nome_filme}</Text>
                        <Text>GENERO: {filmes.genero}</Text>
                        <Text>CLASSIFICAÇÃO: {filmes.classificacao}</Text>
                        <Text>DATA: {filmes.data}</Text>
                    </View>
                ))}
            </View>

        </View>
    );
}