import {
    SAVE_MESSAGE,
} from '../_actions/types';

// 비어있던 배열에 메시지 데이터를 넣어주는 것
export default function (state = {messages:[]}, action) {
    switch (action.type) {
        case SAVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.concat(action.payload)  // payload는 메시지 데이터들
            }
        default:
            return state;
    }
}