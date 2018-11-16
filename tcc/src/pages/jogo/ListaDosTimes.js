import React from "react";

import { StyleSheet, View, FlatList, Button, ActivityIndicator, Text, Alert } from "react-native";

import { connect } from "react-redux";

import PlayerBeingItem from "../../components/PlayerBeingItem";

import { getJogadoresConfirmados, setFieldJogadorPresente } from "../../actions";

class ListaDosTimes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    componentDidMount() {
        this.props.getJogadoresConfirmados();
    }

    renderCriarTimeButton() {
        return (
            <View style={{paddingTop: 20}}>
                <Button
                    title='Criar time' 
                    onPress={() => {}} />
            </View>
        );
    }

    render() {
        const { jogadoresConfirmados, setFieldJogadorPresente } = this.props;

        if (jogadoresConfirmados === null) {
            return <ActivityIndicator />;
        }

        return (
            <View>
                <View style={styles.titulo}>
                    <Text style={{fontSize: 30, color: 'gray'}}>
                        Jogadores Presentes
                    </Text>
                </View>

                <FlatList
                    data={jogadoresConfirmados}
                    extraData={this.state.checked}
                    renderItem={({ item, index }) => (
                        <PlayerBeingItem 
                            index={index} 
                            jogador={item} 
                            onPress={() => {
                                setFieldJogadorPresente(index, 'jogador_presente', item.jogador_presente ? false : true);
                            }} />
                    )}
                    keyExtractor={(item, id) => id.toString()}
                    ListHeaderComponent={props => (<View style={styles.marginTop} />)}
                    ListFooterComponent={props => (<View style={styles.marginBottom} />)}
                />

                { this.renderCriarTimeButton() }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    marginTop: {
        marginTop: 5,
    },
    marginBottom: {
        marginBottom: 5,
    },
    titulo: {
        paddingTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const mapDispatchToProps = {
    getJogadoresConfirmados,
    setFieldJogadorPresente,
}

const mapStateToProps = state => {
    return {
        jogadoresConfirmados: state.jogadoresConfirmados,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListaDosTimes);