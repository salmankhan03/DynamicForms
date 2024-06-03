export const setUserData = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_USERDATA",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const setUserToken = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "SET_USERTOKEN",
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    }
}
