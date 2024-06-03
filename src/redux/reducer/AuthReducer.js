const initialState = {
    userData: {},
    userToken: {}
}

export const AuthReducer = (state = initialState, action) => {
    console.log('login--------------------------', action.payload)
    switch (action.type) {
        case "SET_USERDATA":
            return {
                ...state,
                userData:  action.payload
            }
        case "SET_USERTOKEN":
            return {
                ...state,
                userToken: action.payload
            }
        default:
            return state
    }
}
