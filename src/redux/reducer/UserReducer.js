const initialState = {
    userListData: [],
}

export const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_LIST":
            return {
                ...state,
                userListData:  action.payload
            }      
        default:
            return state
    }
}
