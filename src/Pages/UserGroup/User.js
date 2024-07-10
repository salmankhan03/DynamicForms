import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Modal, Select } from 'antd';
import UserTable from './UserTable';
import UserGroupServices from '../../Service/UserGroupServices';
import { useDispatch, useSelector } from "react-redux";
import { setUserGroupList } from "../../redux/action/userGroup-action";
import { Toast, notifySuccess, notifyError } from "../../Components/ToastComponents";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const { Option } = Select;

const CategoryMenu = () => {
    const userGroupList = useSelector(state => state.UserGroupReducer);
    const [users, setUsers] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [drawerKey, setDrawerKey] = useState(0);
    const [permissionShow, setPermissionShow] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserPermission, setSelectedUserPermission] = useState([]);
    const [userTree, setUserTree] = useState([]);
    const [permissionList, setPermissionList] = useState([]);
    const [permissionUserName, setPermissionUserName] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        getUserGroupList();
    }, [userGroupList?.length]);

    useEffect(() => {
        getUserList();
        getPermissionList();
    }, []);

    function getUserList() {
        UserGroupServices.userTree().then((resp) => {
            if (resp.list) {
                setUserTree(resp.list);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function getPermissionList() {
        UserGroupServices.permission().then((resp) => {
            if (resp.list) {
                setPermissionList(resp.list);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function getUserGroupList() {
        UserGroupServices.getAllUserGroup().then((resp) => {
            if (resp.list) {
                dispatch(setUserGroupList([
                    ...resp.list
                ]));
                setUsers(resp.list);
            }
        }).catch((error) => {
            notifyError(error);
            console.log(error);
        });
    }

    const handleBulkDelete = () => {
        const updatedUsers = users.filter(user => !selectedRowKeys.includes(user.id));
        setUsers(updatedUsers);
        setSelectedRowKeys([]);
    };

    const handleEdit = user => {
        setFormData({
            id: user.id,
            name: user.name,
        });
        setIsDrawerVisible(true);
    };

    const handleDelete = userId => {
        UserGroupServices.deleteUserGroup(userId).then((resp) => {
            if (resp) {
                notifySuccess('User group delete successFully');
                getUserGroupList();
            }
        }).catch((error) => {
            notifyError(error);
            console.log(error);
        });

        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    };

    const showDrawer = () => {
        setFormData({ name: '' });
        setIsDrawerVisible(true);
        setDrawerKey(prevKey => prevKey + 1);
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setDrawerKey(prevKey => prevKey + 1);
    };

    const onFinish = values => {
        if (formData.id) {
            const updatedPayload = {
                name: values.name,
                id: formData.id
            };
            UserGroupServices.createUserGroup(updatedPayload).then((resp) => {
                if (resp) {
                    notifySuccess('User group edit successFully');
                    getUserGroupList();
                }
            }).catch((error) => {
                notifyError(error);
                console.log(error);
            });

        } else {
            UserGroupServices.createUserGroup(values).then((resp) => {
                if (resp) {
                    notifySuccess('User group create successFully');
                    getUserGroupList();
                }
            }).catch((error) => {
                notifyError(error);
                console.log(error);
            });
        }
        setIsDrawerVisible(false);
    };

    const handleCancel = () => {
        setIsDrawerVisible(false);
    };

    const handlePermissionCancel = () => {
        setPermissionShow(false);
        setSelectedUserPermission([]);
        setSelectedUserName('');
        setPermissionUserName('')
    };

    const handleChange = value => {
        const selectedItem = userTree.find(item => item.name === value);
        if (selectedItem) {
            setSelectedUserName(selectedItem.name);
            setPermissionUserName(selectedItem.id)
        }
    };

    const handlePermissionChange = value => {
        if (value.includes("All")) {
            if (value.length === 1) {
                const allPermissions = permissionList.map(item => item.name);
                setSelectedUserPermission(allPermissions);
            } else {
                setSelectedUserPermission(permissionList.map(item => item.name));
            }
        } else {
            setSelectedUserPermission(value);
        }
    };

    const addPermission = e => {
        e.preventDefault();

        if (selectedUserPermission?.length > 0 && selectedUserName) {
            const payload = {

                roleId: permissionUserName,
                permissions: JSON.stringify(selectedUserPermission)
            };
            UserGroupServices.addPermission(payload).then((resp) => {
                if (resp) {
                    setPermissionShow(false);
                    getUserGroupList();
                    notifySuccess('User permission add successFully');
                }
            }).catch((error) => {
                notifyError(error);
                console.log(error);
            });
        }
    };

    const handleEditPermissions = user => {
        setSelectedUserName(user.name);
        setPermissionUserName(user.id)
        setSelectedUserPermission(user.permissions.map(permission => permission.name));
        setPermissionShow(true);
    };

    return (
        <div>
            <Toast />
            <Modal
                title="Add Permisson"
                centered
                open={permissionShow}
                onOk={addPermission}
                onCancel={handlePermissionCancel}
                okText={"Submit Permission"}
                okButtonProps={{
                    style: { backgroundColor: '#001529' }
                }}
            >
                <Row>
                    <Col xs={12} sm={12} md={12}>
                        <div className={"sidebarLabel"}>Select user</div>
                        <Select placeholder="Select a name" onChange={handleChange} value={selectedUserName} style={{ width: '100%' }}>
                            {userTree.map(item => (
                                <Option key={item.id} value={item.name}>{item.name}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} style={{ marginTop: 10, marginBottom: 10 }}>
                        <div className={"sidebarLabel"}>Select Permission</div>
                        <Select
                            mode="multiple"
                            placeholder="Select a Permission"
                            onChange={handlePermissionChange}
                            value={selectedUserPermission}
                            style={{ width: '100%' }}
                        >
                            <Option key="all" value="All">All</Option>
                            {permissionList.map(item => (
                                <Option key={item.id} value={item.name}>{item.name}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Modal>
            <div className="container p-4 mt-4 mb-4">
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                        <div className="button-group">
                            <button style={{
                                padding: '5px 20px',
                                fontSize: '16px',
                                backgroundColor: '#001529',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease',
                                marginRight: '10px'
                            }} onClick={() => setPermissionShow(true)}>Add Permission</button>
                            <Button type="primary" onClick={showDrawer} style={{ backgroundColor: '#001529' }}>
                                + Add User Group
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEditPermissions={handleEditPermissions}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
            />

            <Drawer
                key={drawerKey}
                title={formData.id ? "Edit User Group" : "Add User Group"}
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
