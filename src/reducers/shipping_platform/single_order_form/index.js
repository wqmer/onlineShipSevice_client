import { combineReducers } from 'redux'
import merge from 'lodash/merge'

const initialState = {
    sender_information: {
        is_ready: false,
        panel_title: '未填写',
        font_type: 'warning',
    },
    receipant_information: {
        is_ready: false,
        panel_title: '未填写',
        font_type: 'warning',
    },
    parcel_information: {
        is_ready: false,
        panel_title: '未填写',
        font_type: 'warning',
        parcel_list: [
            {
                key: 'first_pak',
                panel_title: '未录入',
                font_type: 'warning',
                pack_info: undefined,
                is_panel_opened: true,
            }
        ]
    },
    service_information: {
        is_required_fetch:true,
        is_select: false,
        service_name: undefined,
        panel_title: '请先完成输入信息',
        font_type: 'secondary',
        service_content:[]
    },
    billing_information: {
        on_display: false,
        total: 0,
    },
    setting: {
        open_panel: ['sender_information']
    }
};


export const actionTypes = {
    GET_FORM_INFO: "GET_FORM_INFO",
    UPDATE_FORM_INFO: "UPDATE_FORM_INFO",
    SET_INFO: "SET_INFO",
    RESET_SERVICE_INFO: "RESET_SERVICE_INFO",
    RESET_ALL_INFO: "RESET_ALL_INFO",
};

export const actions = {
    get_form_info: function (data) {
        return {
            type: actionTypes.GET_FORM_INFO,
            data
        }
    },

    update_form_info: function (data) {
        return {
            type: actionTypes.UPDATE_FORM_INFO,
            data
        }
    },

    reset_service_info: function () {
        return {
            type: actionTypes.RESET_SERVICE_INFO,
        }
    },
    reset_all_info: function () {
        return {
            type: actionTypes.RESET_ALL_INFO,
        }
    },
};



export function reducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_INFO:
            return merge({}, state, action.data)
        case actionTypes.RESET_ALL_INFO:
            return initialState
        case actionTypes.UPDATE_FORM_INFO:
            return {
                ...state,
                ...action.data
            }
        case actionTypes.RESET_SERVICE_INFO:
            return {
                ...state,
                service_information: undefined
            }
        default:
            return state;
    }
}

const single_order = combineReducers({
    form: reducer,
})


export default single_order

