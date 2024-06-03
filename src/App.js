import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from "./Components/PrivateRoute";
import LoginScreen from "./Pages/Login";
import DynamicForm from "./Pages/DynamicField";
import Navbar from "./Components/Navbar";
import User from "./Pages/User/User";
import UserGroup from "./Pages/UserGroup/User";



function App() {
    const dispatch = useDispatch();
    const AuthData = useSelector(state => state.AuthReducer.userData);

    const [isLoggedIn, setLoggedIn] = useState(false)
    // console.log(isLoggedIn)
    // useEffect(() => {
    //     getStaticPageList()
    // }, [])
    //
    // async function getStaticPageList() {
    //     await AuthServices.getStaticTemplates({
    //         page: 1,
    //         limit: 100,
    //     }).then((resp) => {
    //         if (resp?.status_code === 200) {
    //             dispatch(setDefaultTemplateList([
    //                 ...resp?.list?.data
    //             ]))
    //
    //
    //         }
    //     }).catch((error) => {
    //
    //         console.log(error)
    //     })
    // }
    function loginStatusUpdate() {
        console.log("call")
    }
    useEffect(() => {
        // console.log(AuthData)
        // console.log(GuestData)
        if (AuthData) {
            setLoggedIn(true)
        }

    }, [AuthData])

    return (
        <div className='pagebox'>
            <Router>
                <Routes>

                    <Route path="/login" element={<WithNavbar component={LoginScreen} />} />
                    <Route
                        path="/"
                        element={<PrivateRoute element={<WithNavbar component={DynamicForm} />} isAuthenticated={AuthData.email ? true : false} fallbackPath="/login" />}
                    />
                    <Route
                        path="/user"
                        element={<PrivateRoute element={<WithNavbar component={User} />} isAuthenticated={AuthData.email ? true : false} fallbackPath="/login" />}
                    />
                    <Route
                        path="/user-group"
                        element={<PrivateRoute element={<WithNavbar component={UserGroup} />} isAuthenticated={AuthData.email ? true : false} fallbackPath="/login" />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

interface WithNavbarProps {
    component: React.ComponentType<any>;
}

function WithNavbar({ component: Component, ...rest }: WithNavbarProps) {
    return (
        <>
            <Navbar />
            <Component {...rest} />
        </>
    );
}

export default App;


