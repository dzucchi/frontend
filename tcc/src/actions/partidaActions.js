import firebase from 'firebase';

export const SET_FIELD_PARTIDA = 'SET_FIELD_PARTIDA';
export const setFieldPartida = (field, value) => {
    return {
        type: SET_FIELD_PARTIDA,
        field,
        value,
    }
}

export const PARTIDA_SAVED_SUCCESS = 'PARTIDA_SAVED_SUCCESS';
const partidaSaveSuccess = () => ({
    type: PARTIDA_SAVED_SUCCESS
});

export const SET_JOGADORES_FROM_SELECTED_GRUPO = 'SET_JOGADORES_FROM_SELECTED_GRUPO';
const setJogadoresFromSelectedGrupo = jogadores => ({
    type: SET_JOGADORES_FROM_SELECTED_GRUPO,
    jogadores
});

export const watchJogadoresFromSelectedGrupo = () => {
    return (dispatch, getState) => {

        // PEGAR TODOS OS JOGADORES DO GRUPO SELECIONADO.
        firebase
            .database()
            .ref(`/jogadores`)
            .on('value', snapshot => {
                let jogadores = {}
                const jogadoresKeys = Object.keys(getState().grupoSelected.jogadores);
                const jogadoresKeysBaseON = Object.keys(snapshot.val());
                jogadoresKeysBaseON.forEach((keyON) => {
                    jogadoresKeys.forEach((key) => {
                        if (key === keyON) {
                            jogadores = [ ...jogadores, snapshot.val()[keyON]];
                        }
                    });
                });
                

                // PEGAR A CHAVE DE TODOS OS JOGADORES PRESENTES.
                let jogadoresPresentesKeys;
                firebase
                    .database()
                    .ref(`grupos/${getState().grupoSelected.id}/partidas`)
                    .once('value', snapshot => {
                        snapshot.forEach((partida) => {
                            if (partida.val().ativa) {
                                if (partida.val().jogadores_presentes) {
                                    jogadoresPresentesKeys = Object.keys(partida.val().jogadores_presentes);
                                }
                            }
                        });
                    });
                
                let filtro = {};
                jogadores.forEach(jogador => {
                    let jogadorFiltrado = jogador[Object.keys(jogador)[0]];
                    jogadorFiltrado.presenca_confirmada = false;
                    if (jogadoresPresentesKeys) {
                        jogadoresPresentesKeys.forEach((id_user_presente) => {
                            if (id_user_presente === jogadorFiltrado.id_user) {
                                jogadorFiltrado.presenca_confirmada = true;
                            }
                        });
                    }
                    filtro = [...filtro, jogadorFiltrado];
                });
                dispatch(setJogadoresFromSelectedGrupo(filtro));
            });
    }
}

export const presenceUpdate = () => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            try {
                // PEGAR A KEY DA PARTIDA ATIVA.
                let partidaAtivaKey;
                firebase
                    .database()
                    .ref(`grupos/${getState().grupoSelected.id}/partidas`)
                    .once('value', snapshot => {
                        snapshot.forEach((partida) => {
                            if (partida.val().ativa) {
                                partidaAtivaKey = partida.key;
                            }
                        });
                    });
                
                // id_user DO USUÁRIO LOGADO.
                const jogadorId = getState().jogador.id_user;

                // PEGAR O INDEX DO JOGADOR LOGADO.
                let jogadorIndex;
                const { jogadoresFromSeletedGrupo } = getState();
                jogadoresFromSeletedGrupo.forEach((jogador, index) => {
                    if (jogador.id_user === jogadorId) {   
                        jogadorIndex = index;
                    }
                });

                // VERIFICAR SE EXISTE O NODE 'jogadores_presentes'.
                const ref = firebase.database().ref(`grupos/${getState().grupoSelected.id}/partidas/${partidaAtivaKey}/jogadores_presentes`)
                ref
                    .child(`${jogadorId}`)
                    .once('value', snapshot => {
                    if (snapshot.exists()) {
                        ref.child(`${jogadorId}`).remove();
                        //dispatch(setFieldPartida('presenca_confirmada', false));
                    } else {
                        let obj = {};
                        obj[jogadorId] = true;
                        ref.update(obj);
                        //dispatch(setFieldPartida('presenca_confirmada', true));
                    }
                });
                resolve();
            } catch (error) {
                console.error(error);
                reject();      
            }
        })
    }
}

export const savePartida = partida => {
    return async (dispatch, getState) => {
        const idSeletedGrupo = getState().grupoSelected.id;

        const db = firebase.database();
        const snap = db.ref(`/grupos/${idSeletedGrupo}/partidas`).push();
        const key = snap.key;
        partida.id = key;
        await snap.ref.set(partida);

        firebase
            .database()
            .ref(`/grupos/${idSeletedGrupo}`)
            .child('estagio')
            .set(1);

        dispatch(partidaSaveSuccess());  
    }
};