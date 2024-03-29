import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";

const db = new DatabaseConnection.getConnection

export default function Cadastro() {
    const navigation = useNavigation();
    const [descricao, setDescicao] = useState();
    const [genero, setGenero] = useState();
    const [data, setData ] = useState();
    const [classf, setClassf] = useState()
    const [id, setId] = useState();
   
    const adicionarFilmes = () => {
        if (descricao === null || descricao.trim() === "") {
            Alert.alert("Erro", "Insira um valor válido descrição");
            return;
        }else if(genero == null || genero.trim()== ""){
            Alert.alert("Erro", "Insira um valor válido para o genero");
            return;
        }
        db.transaction(tx => {
            tx.executeSql("INSERT INTO filmes1 (nome_filme, genero, classificacao, data) VALUES (?,?,?,?)",
              [descricao, genero, classf,data],
              (_,) => {
                Alert.alert("Info", "Registro inserido com sucesso")
                setDescicao("");
                setClassf("")
                setData("")
                setGenero("")
              },
              (_, error) => {
                console.error("erro ao adicionar um filme", error),
                  Alert.alert("Erro", "ocorreu um erro ao adicionar um filme")
              }
            )
          })

        
    }

    return (
        <SafeAreaView style={styles.container}>
             <View style={{gap:15}}>
              <Text style={{}}>CADASTRO NOVO FILME</Text>
            <TextInput style={styles.input} value={descricao} onChangeText={setDescicao} placeholder='Digite uma descrição' ></TextInput>
            <TextInput style={styles.input} value={genero} onChangeText={setGenero} placeholder='Digite uma Genero' ></TextInput>
            <TextInput style={styles.input} value={classf} onChangeText={setClassf} placeholder='Digite uma Classificação' ></TextInput>
            <TextInput style={styles.input} value={data} onChangeText={setData} placeholder='Digite uma data' ></TextInput>
            <TouchableOpacity onPress={adicionarFilmes}><Text>Salvar</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      justifyContent:"center", alignItems:"center", display:"flex"
   

  },
  input: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignItems: "center",
      width: "90%",
      height: "8%",
      borderRadius: 10,
      borderColor:"black",
      borderWidth:2,
},


});