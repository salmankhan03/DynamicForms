export const setUserList = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_USER_LIST",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}