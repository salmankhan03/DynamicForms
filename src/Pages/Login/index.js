import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputComponent from "../../Components/Input";
import {setUserData, setUserToken} from "../../redux/action/auth";
import AuthServices from "../../Service";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Toast, notifySuccess, notifyError } from '../../Components/ToastComponents';
import './Login.css'

const LoginScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formDataErrors, setFormDataErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const validateForm = () => {
        const errors = {};

        console.log('formData----------------', formData)

        // Validate email
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        }

        // Validate password
        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        setFormDataErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                AuthServices.customerLogin(formData).then((resp) => {
                    if (resp?.user) {
                        notifySuccess(`Login SuccessFully`);
                        const cookieTimeOut = 1000;
                        dispatch(setUserData({
                            ...resp?.user
                        }))
                        dispatch(setUserToken(
                            resp?.token
                        ))
                        Cookies.set('userToken', JSON.stringify(resp?.token), {
                            expires: cookieTimeOut,
                        });

                        navigate(`/`)
                    }
                }).catch((error) => {
                    // setLoading(false)
                    notifyError(`Please Enter valid Email or Password`);
                    console.log(error)
                })
            } catch (error) {
                console.error('Login failed:', error);
            }
        } else {
            console.log('Validation errors:', formDataErrors);
        }
    };

    return (
        <div className="">
            <Toast/>
            <div className=''>
                <div className='row' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', width: '100vw' }}>

                    <div className='col-md-3'>
                        <div className={'loginForm'}>
                            <div>
                                <h2 style={{textAlign: 'center'}}>Login</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                            <div className="form-row mt-3">
                                <div className="form-group col-md-12">
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="registerName">Email</label>
                                        <InputComponent
                                            type="text"
                                            id="email"
                                            customClass={`form-control gray-bg ${formDataErrors?.email ? 'validation-error-border' : ''} `}//
                                            value={formData?.email}
                                            onChange={(e) => handleChange('email', e.target.value,)}
                                            placeholder=""
                                        />
                                        {formDataErrors?.email && <div className="validation-error">{formDataErrors?.email}</div>}
                                    </div>
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="registerName">Password</label>
                                        <InputComponent
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            customClass={`form-control gray-bg ${formDataErrors?.password ? 'validation-error-border' : ''}`}
                                            value={formData?.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            placeholder=""
                                        />

                                        {formDataErrors?.password && <div className="validation-error">{formDataErrors?.password}</div>}
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" type="submit">
                                            <span>Login</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;


