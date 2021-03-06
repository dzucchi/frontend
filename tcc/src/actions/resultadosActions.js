import firebase from 'firebase';

export const saveResultado = (id_time_1, id_time_2, gol_time_1, gol_time_2) => {
    return (dispatch, getState) => {
        
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
        
        let nome_time_1;
        firebase
            .database()
            .ref(`grupos/${getState().grupoSelected.id}/partidas/${partidaAtivaKey}/times/${id_time_1}`)
            .once('value', snapshot => {
                nome_time_1 = snapshot.val().nome;
            });

        let nome_time_2;
        firebase
            .database()
            .ref(`grupos/${getState().grupoSelected.id}/partidas/${partidaAtivaKey}/times/${id_time_2}`)
            .once('value', snapshot => {
                nome_time_2 = snapshot.val().nome;
            });

        let data;
        firebase
            .database()
            .ref(`grupos/${getState().grupoSelected.id}/partidas/${partidaAtivaKey}/dia_do_jogo`)
            .once('value', snapshot => {
                data = snapshot.val();
            });

        // INSERIR O RESULTADO.
        const idSeletedGrupo = getState().grupoSelected.id;
        const db = firebase.database();
        const ref = db.ref(`/grupos/${idSeletedGrupo}/partidas/${partidaAtivaKey}/resultados`);
        const snap = ref.push();
        const key = snap.key;
        let resultado = {};
        resultado.data = data;
        resultado.nome_time_1 = nome_time_1;
        resultado.nome_time_2 = nome_time_2;
        resultado.time_1 = id_time_1;
        resultado.time_2 = id_time_2;
        resultado.gol_time_1 = gol_time_1;
        resultado.gol_time_2 = gol_time_2;
        resultado.id_partida = partidaAtivaKey;
        resultado.id = key;
        snap.ref.set(resultado);
    }
}