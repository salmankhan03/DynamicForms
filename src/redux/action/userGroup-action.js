export const setUserGroupList = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_USER_GROUP_LIST",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}