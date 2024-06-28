import React, {useEffect, useState} from 'react';
import { Button, Drawer, Form, Input } from 'antd';
import UserTable from './UserTable';
import UserGroupServices from "../../Service/UserGroupServices";
import {setUserGroupList} from "../../redux/action/userGroup-action";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useDispatch, useSelector} from "react-redux";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import UserServices from "../../Service/UserServices";
import {setUserList} from "../../redux/action/user-action";
import { Toast, notifySuccess, notifyError } from '../../Components/ToastComponents';

const UserIcon = () => <FontAwesomeIcon icon={faUser} style={{ marginRight: 4 }} />;

const CategoryMenu = () => {
    const initialUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const userList = useSelector(state => state.UserReducer);
    const userGroupList = useSelector(state => state.UserGroupReducer);

    const [users, setUsers] = useState();
    const [usersGroup, setUsersGroup] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [selectedTreeKeys, setSelectedTreeKeys] = useState([]);
    const [drawerKey, setDrawerKey] = useState(0); // Key to remount Drawer



    const dispatch = useDispatch();

    useEffect(() => {
        getUserList()
    }, [userList?.length])

    useEffect(() => {
        getUserGroupList()
    }, [])

    function getUserList() {
        UserServices.getAllUser().then((resp) => {
            if (resp.list) {
                dispatch(setUserList([
                    ...resp?.list
                ]))
                setUsers(resp?.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function getUserGroupList() {
        UserGroupServices.getAllUserGroup().then((resp) => {
            if (resp.list) {
                dispatch(setUserGroupList([
                    ...resp?.list
                ]))
                setUsersGroup(resp?.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleBulkDelete = () => {
        const updatedUsers = users.filter(user => !selectedRowKeys.includes(user.id));
        setUsers(updatedUsers);
        setSelectedRowKeys([]);
    };

    const handleEdit = user => {

        const userRoleId = user.role_id;
        setSelectedTreeKeys(userRoleId ? [userRoleId.toString()] : []);
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        });
        setIsDrawerVisible(true);
    };

    const handleDelete = userId => {
        UserServices.deleteUser(userId).then((resp) => {
            if (resp) {
                notifySuccess('User delete successFully')
                getUserList()
            }
        }).catch((error) => {
            console.log(error)
        })
    };

    const showDrawer = () => {
        setFormData({ name: '', email: '', password: '' });
        setIsDrawerVisible(true);
        setDrawerKey(prevKey => prevKey + 1);
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setDrawerKey(prevKey => prevKey + 1);
    };

    const onFinish = values => {
        const selectedRoleId = selectedTreeKeys.length > 0 ? selectedTreeKeys[0].toString() : '';
        if (formData.id) {

            const payload = {
                role_id: selectedRoleId,
                id: formData.id,
                ...values
            }

            UserServices.createUser(payload).then((resp) => {
                if (resp) {
                    notifySuccess('User edit successFully')
                    getUserList()
                }
            }).catch((error) => {
                notifyError(error)
                console.log(error)
            })
        } else {
            const payload = {
                role_id: selectedRoleId,
                ...values
            }

            UserServices.createUser(payload).then((resp) => {
                if (resp) {
                    notifySuccess('User create successFully')
                    getUserList()
                }
            }).catch((error) => {
                notifyError(error)
                console.log(error)
            })
        }
        setIsDrawerVisible(false);
    };

    const handleCancel = () => {
        setIsDrawerVisible(false);
    };

    const handleTreeSelect = (selectedKeys, info) => {
        setSelectedTreeKeys(selectedKeys);
    };

    return (
        <div>
            <Toast />
            <div className="container p-4 mt-4 mb-4">
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                        <div className="button-group">
                            {/*<Button type="danger" onClick={handleBulkDelete}>*/}
                            {/*    Bulk Delete*/}
                            {/*</Button>*/}
                            <Button type="primary" onClick={showDrawer} style={{backgroundColor: '#001529'}}>
                                + Add User
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
            />

            <Drawer
                key={drawerKey} // Remount Drawer when key changes
                title={formData.id ? "Edit User" : "Add User"}
                placement="right"
                closable={false}
                onClose={handleDrawerClose}
                visible={isDrawerVisible}
                width={400}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        initialValue={formData.name}
                        rules={[{ required: true, message: 'Please enter user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        initialValue={formData.email}
                        rules={[{ required: true, message: 'Please enter email' }]}
                    >
                        <Input />
                    </Form.Item>
                   {!formData.id &&  <Form.Item
                        label="Password"
                        name="password"
                        initialValue={formData.password}
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input />
                    </Form.Item>}
                    <p>Select user group</p>
                    <Tree
                        onSelect={handleTreeSelect}
                        defaultExpandAll
                        treeData={usersGroup.map(user => ({
                            key: user.id.toString(),
                            title: user.name,
                            icon: UserIcon,
                            role_id: user.id
                        }))}
                        selectedKeys={selectedTreeKeys}
                    />

                    <Form.Item style={{ position: 'absolute', bottom: 0, left: 10, right: 0, borderTop: '1px solid #AEB9CA', padding: '15px' }}>
                        <Button type="primary" htmlType="submit">
                            {formData.id ? "Update" : "Add"}
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default CategoryMenu;
