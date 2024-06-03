const initialState = {
    userGroupListData: [],
}

export const UserGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_GROUP_LIST":
            return {
                ...state,
                userGroupListData:  action.payload
            }      
        default:
            return state
    }
}
