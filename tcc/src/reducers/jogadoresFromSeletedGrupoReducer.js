import { SET_JOGADORES_FROM_SELECTED_GRUPO, SET_FIELD_PARTIDA_GRUPO } from "../actions";

export default function (state = null, action) {
    switch (action.type) {
        case SET_FIELD_PARTIDA_GRUPO:
            const newStateGrupo = [ ...state ]; // Object.assign({}, state)
            newStateGrupo[action.index][action.field] = action.value;
            return newStateGrupo;
        case SET_JOGADORES_FROM_SELECTED_GRUPO:
            return action.jogadores;
        default:
            return state;
    }
}