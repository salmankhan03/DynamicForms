import React, {useEffect, useState} from 'react';
import { Button, Drawer, Form, Input } from 'antd';
import UserTable from './UserTable';
import UserGroupServices from '../../Service/UserGroupServices'
import {useDispatch, useSelector} from "react-redux";
import {setUserGroupList} from "../../redux/action/userGroup-action";
import {Toast, notifySuccess, notifyError} from "../../Components/ToastComponents";

const CategoryMenu = () => {
    const userGroupList = useSelector(state => state.UserGroupReducer);
    const [users, setUsers] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [drawerKey, setDrawerKey] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        getUserGroupList()
    }, [userGroupList?.length])

    function getUserGroupList() {
        UserGroupServices.getAllUserGroup().then((resp) => {
            if (resp.list) {
                dispatch(setUserGroupList([
                    ...resp?.list
                ]))
                // notifySuccess('User group get successFully')
                setUsers(resp?.list)
            }
        }).catch((error) => {
            notifyError(error)
            console.log(error)
        })
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
                notifySuccess('User group delete successFully')
                getUserGroupList()
            }
        }).catch((error) => {
            notifyError(error)
            console.log(error)
        })

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
            }
            UserGroupServices.createUserGroup(updatedPayload).then((resp) => {
                if (resp) {
                    notifySuccess('User group edit successFully')
                    getUserGroupList()
                }
            }).catch((error) => {
                notifyError(error)
                console.log(error)
            })

        } else {
            UserGroupServices.createUserGroup(values).then((resp) => {

                if (resp) {
                    notifySuccess('User group create successFully')
                    getUserGroupList()
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

    return (
        <div>
            <Toast />
            <div className="container p-4 mt-4 mb-4">
                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 text-right">
                        <div className="button-group">
                            <Button type="danger" onClick={handleBulkDelete}>
                                Bulk Delete
                            </Button>
                            <Button type="primary" onClick={showDrawer}>
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
