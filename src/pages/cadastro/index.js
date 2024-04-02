import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";

const db = DatabaseConnection.getConnection()

export default function Cadastro() {
  const navigation = useNavigation();
  const [descricao, setDescicao] = useState("");
  const [genero, setGenero] = useState("");
  const [data, setData] = useState("");
  const [classf, setClassf] = useState("");
  

  const adicionarFilmes = () => {
    if (!descricao.trim() || !genero.trim() || !classf.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    db.transaction(tx => {
      tx.executeSql("INSERT INTO filmes1 (nome_filme, genero, classificacao, data) VALUES (?,?,?,date('now'))",
        [descricao, genero, classf, data],
        () => {
          Alert.alert("Info", "Registro inserido com sucesso");
          setDescicao("");
          setGenero("");
          setClassf("");
          setData("");
        },
        (_, error) => {
          console.error("Erro ao adicionar um filme:", error),
            Alert.alert("Erro", "Ocorreu um erro ao adicionar um filme");
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
          <Text style={styles.title}>CADASTRO NOVO FILME</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescicao}
            placeholder='Digite uma descrição'
          />
          <TextInput
            style={styles.input}
            value={genero}
            onChangeText={setGenero}
            placeholder='Digite um gênero'
          />
          <TextInput
            style={styles.input}
            value={classf}
            onChangeText={setClassf}
            placeholder='Digite uma classificação'
            keyboardType="numeric"
          />
          {/* <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder='Digite uma data'
            keyboardType="numeric"
          /> */}
          <TouchableOpacity onPress={adicionarFilmes} style={styles.button}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    width: "100%",
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
