import React, { useState } from 'react';
import { Table, Space, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './index.css'

const UserTable = ({ users, onEdit, onDelete, setSelectedRowKeys }) => {
    const [selectedRowKeysInternal, setSelectedRowKeysInternal] = useState([]);

    const columns = [
        {
            title: 'Select',
            key: 'select',
            render: (text, record) => (
                <Checkbox
                    onChange={(e) => {
                        const selected = e.target.checked;
                        const key = record.id;

                        const updatedKeys = selected
                            ? [...selectedRowKeysInternal, key]
                            : selectedRowKeysInternal.filter((k) => k !== key);

                        setSelectedRowKeysInternal(updatedKeys);


                        setSelectedRowKeys(updatedKeys);
                    }}
                    checked={selectedRowKeysInternal.includes(record.id)}
                />
            ),
        },
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
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => onEdit(record)}><FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer' }} /></a>
                    <a onClick={() => onDelete(record.id)}><FontAwesomeIcon icon={faTrashAlt} style={{ cursor: 'pointer' }} /></a>
                </Space>
            ),
        },
    ];

    return (
        <div className="container">
        <Table
            dataSource={users}
            columns={columns}
            pagination={false}
            bordered
        />
        </div>
    );
};

export default UserTable;
