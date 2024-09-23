import React, { useState } from 'react';
import { Table, Space, Checkbox, Tag, Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './index.css'

const UserTable = ({ users, onEdit, onDelete, setSelectedRowKeys, onEditPermissions  }) => {
    const { confirm } = Modal;
    const showDeleteConfirm = (record) => {
        confirm({
          title: 'Are you sure to delete this form?',
          centered: 'true',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            onDelete(record.id);
          },
        });
      };

    const [selectedRowKeysInternal, setSelectedRowKeysInternal] = useState([]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Permissions',
            key: 'permissions',
            render: (text, record) => (
                <Space>
                    {record.permissions.map(permission => (
                        <Tag key={permission.id} color="#001529">{permission.name}</Tag>
                    ))}
                    {record.permissions?.length > 0 && <Button type="link" onClick={() => onEditPermissions(record)}>
                        <FontAwesomeIcon icon={faEdit} color="#001529" />
                    </Button>}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => onEdit(record)}><FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer' }} /></a>
                    <a onClick={() => showDeleteConfirm(record)}><FontAwesomeIcon icon={faTrashAlt} style={{ cursor: 'pointer', color: '#ff4444' }} /></a>
                </Space>
            ),
        },
    ];

    return (
        <div className="container">
        <Table
            dataSource={users}
            columns={columns}
            pagination={{
                pageSize: 10,
                defaultCurrent: 1,
            }}
            bordered
        />
        </div>
    );
};

export default UserTable;
