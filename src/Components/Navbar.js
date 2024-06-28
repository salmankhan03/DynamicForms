import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthServices from "../Service";
import Cookies from 'js-cookie';

const CustomNavbar = () => {

    const navigate = useNavigate();
    let token;
    if (Cookies.get('userToken')) {
        token = JSON.parse(Cookies.get('userToken'));
    }

    const handleLogout = () => {
        let token;
        if (Cookies.get('userToken')) {
            token = JSON.parse(Cookies.get('userToken'));
        }

        if (token) {
            const cookieTimeOut = 1000;

            AuthServices.customerLogout().then((resp) => {
                console.log("resp customer Logout", resp)
                if (resp) {
                    Cookies.set('userToken', JSON.stringify(""), {
                        expires: cookieTimeOut,
                    });
                    localStorage.removeItem('persist:root');
                    navigate(`/login`)
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            navigate(`/`)
        }

    };

    return (
        <Navbar sticky="top" expand="lg" style={{ padding: '15px 25px', background: '#001529' }}>
            <Navbar.Brand as={Link} to="/" style={{color: '#fff'}}>My Website</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                {token && <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/" style={{color: '#fff'}}>Home</Nav.Link>
                    <Nav.Link as={Link} to="/user" style={{color: '#fff'}}>User</Nav.Link>
                    <Nav.Link as={Link} to="/user-group" style={{color: '#fff'}}>User Group</Nav.Link>
                    <Nav.Link onClick={handleLogout} style={{color: '#fff'}}>
                        Logout <FontAwesomeIcon icon={faSignOutAlt} />
                    </Nav.Link>
                </Nav>}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
