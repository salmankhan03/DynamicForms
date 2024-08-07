import React, {useEffect, useState} from 'react';
import { Layout, Select, Input, Button, Modal } from 'antd';
import './DynamicForm.css';
import UserGroupServices from "../../Service/UserGroupServices";
import { Toast, notifySuccess, notifyError } from '../../Components/ToastComponents';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FormTable from "./FormTable";
const { Option } = Select;

const DynamicForm = () => {
    const [formFields, setFormFields] = useState([]);
    const [counter, setCounter] = useState(0);
    const [fieldType, setFieldType] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [defaultValue, setDefaultValue] = useState('');
    const [selectOptions, setSelectOptions] = useState(['']);
    const [formJson, setFormJson] = useState('');
    const [fieldIsRequired, setFieldIsRequired] = useState(false);
    const [userTree, setUserTree] = useState([]);
    const [permissionList, setPermissionList] = useState([]);
    const [addOptionDisabled, setAddOptionDisabled] = useState(true);
    const [addFieldDisabled, setAddFieldDisabled] = useState(true);
    const [selectedUserName, setSelectedUserName] = useState();
    const [selectedUserPermission, setSelectedUserPermission] = useState();
    const [mediaOption, setMediaOption] = useState('');
    const [formList, setFormList] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editFormId, setEditFormId] = useState(null);
    const [editFormName, setEditFormName] = useState(null);
    const [publishForm, setPublishForm] = useState(1);
    const [isPrintAllow, setIsPrintAllow] = useState(1);
    const [isMailAllow, setIsMailAllow] = useState(1);
    const [show, setShow] = useState(false);
    const [permissionShow, setPermissionShow] = useState(false);

    useEffect(() => {
        getUserList()
        getPermissionList()
        getFormList()
    }, [])


    function getFormList() {
        UserGroupServices.formList().then((resp) => {
            if (resp.list) {
                setFormList(resp?.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function getUserList() {
        UserGroupServices.userTree().then((resp) => {
            if (resp.list) {
                setUserTree(resp?.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function getPermissionList() {
        UserGroupServices.permission().then((resp) => {
            if (resp.list) {
                setPermissionList(resp?.list)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleEdit = (form) => {
        setShow(true)
        setEditFormId(form.id);
        setEditFormName(form.name)
        const formData = JSON.parse(JSON.parse(form.form_fields) );
        setFormFields(formData);
        setPublishForm(form.is_published)
        setIsPrintAllow(form.allow_print)
        setIsMailAllow(form.allow_mail)
    };

    const handleDelete = formId => {
        UserGroupServices.deleteForm(formId).then((resp) => {
            if (resp) {
                notifySuccess('form delete successFully')
                getFormList()
            }
        }).catch((error) => {
            console.log(error)
        })
    };

    const handleFieldTypeChange = (value) => {
        setFieldType(value);
    };

    const handleLabelInputChange = (e) => {
        setLabelInput(e.target.value);
    };

    const handleDefaultInputChange = (e) => {
        setDefaultValue(e.target.value);
    };

    const handleMediaOptionChange = (value) => {
        setMediaOption(value);
    };

    const handleSelectOptionInputChange = (index, value) => {
        const newSelectOptions = [...selectOptions];
        newSelectOptions[index] = value;
        setSelectOptions(newSelectOptions);
        setAddOptionDisabled(value.trim() === ''); // Disable Add Option button if the option is empty
        setAddFieldDisabled(fieldType === 'checkbox' || fieldType === 'radio' || fieldType === 'select-input' ? value.trim() === '' : false);
    };

    const handleAddOption = () => {
        setSelectOptions([...selectOptions, '']);
        setAddOptionDisabled(true);
        setAddFieldDisabled(true);
    };

    const handleRemoveOption = (index) => {
        const newSelectOptions = [...selectOptions];
        newSelectOptions.splice(index, 1);
        setSelectOptions(newSelectOptions);
        if (newSelectOptions.some(option => option.trim() !== '')) {
            setAddFieldDisabled(false);
        }
    };

    const handleChange = (value) => {
        const selectedItem = userTree.find(item => item.name === value);
        if (selectedItem) {
            setSelectedUserName(selectedItem.id);
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
        console.log('Selected permissions:', value);
    };

    const addField = (e) => {
        e.preventDefault();
        let newField;

        switch (fieldType) {

            case 'checkbox':
                newField = {
                    fieldLabel: labelInput,
                    fieldType: 'checkbox',
                    fieldSubType: "",
                    fieldVal: defaultValue,
                    fieldOptions: selectOptions.filter(option => option.trim() !== '').join(','),
                    fieldIsRequired: fieldIsRequired ? 1 : 0
                };
                break;
            case 'date':
            case 'datetime-local':
            case 'email':
            case 'tel':
            case 'number':
            case 'password':
            case 'text':
            case 'textarea':
                newField = {
                    fieldLabel: labelInput,
                    fieldType: fieldType === 'textarea' ? 'textarea' : (fieldType === 'date' || fieldType === 'datetime-local' ? 'btndate' :'textfield'),
                    fieldSubType: fieldType === 'textarea' || fieldType === 'text' || fieldType === 'date' ? '' :
                        fieldType === 'tel' ? 'mobilephone' :
                            fieldType === 'datetime-local' ? 'datetime' : fieldType,
                    fieldVal: defaultValue,
                    fieldOptions: '',
                    fieldIsRequired: fieldIsRequired ? 1 : 0
                };
                break;
            case 'select-input':
                newField = {
                    fieldLabel: labelInput,
                    fieldType: 'btnpicker',
                    fieldSubType: '',
                    fieldVal: defaultValue,
                    fieldOptions: selectOptions.filter(option => option.trim() !== '').join(','),
                    fieldIsRequired: fieldIsRequired ? 1 : 0
                };
                break;
            case 'radio':
                newField = {
                    fieldLabel: labelInput,
                    fieldType: 'radiobutton',
                    fieldSubType: '',
                    fieldVal: defaultValue,
                    fieldOptions: selectOptions.filter(option => option.trim() !== '').join(','),
                    fieldIsRequired: fieldIsRequired ? 1 : 0
                };
                break;
            case 'image':
            case 'video':
            case 'media':
                newField = {
                    fieldLabel: labelInput || "Attachments", // Use labelInput or default to "Attachments"
                    fieldType: 'media',
                    fieldSubType: fieldType !== 'media' ? fieldType : '',
                    fieldVal: defaultValue || "Select", // Use defaultValue or default to "Select"
                    fieldOptions: mediaOption,
                    fieldIsRequired: fieldIsRequired ? 1 : 0
                };
                break;
            default:
                return;
        }

        setCounter(counter + 1);
        notifySuccess(`Dynamic ${fieldType} field successfully add`);
        setFormFields([...formFields, newField]);
        setLabelInput('');
        setDefaultValue('');
        setSelectOptions(['']);
        setFieldType('');
        setMediaOption('')
        setFieldIsRequired(false);
    };

    const removeField = (index) => {
        const newFormFields = [...formFields];
        newFormFields.splice(index, 1);
        setFormFields(newFormFields);
    };

    const generateFormJson = (e) => {
        e.preventDefault()
        if(formFields?.length > 0) {
            if(editFormId) {
                setFormJson(JSON.stringify(formFields, null, 2));
                UserGroupServices.createForm({
                    id: editFormId,
                    name: editFormName,
                    is_published: publishForm ? 1 : 0,
                    allow_mail: isMailAllow ? 1 : 0,
                    allow_print: isPrintAllow ? 1 : 0,
                    fields:  JSON.stringify(JSON.stringify(formFields, null, 2))
                }).then((resp) => {
                    setShow(false)
                    notifySuccess(`Form Json edit SuccessFully`);
                    getFormList()
                    setFormFields([])
                }).catch((error) => {
                    notifyError(`Something went wrong`);
                })
            } else {
                setFormJson(JSON.stringify(formFields, null, 2));
                UserGroupServices.createForm({
                    name: editFormName ? editFormName : 'Dynamic form',
                    is_published: publishForm ? 1 : 0,
                    allow_mail: isMailAllow ? 1 : 0,
                    allow_print: isPrintAllow ? 1 : 0,
                    fields:  JSON.stringify(JSON.stringify(formFields, null, 2))
                }).then((resp) => {
                    setShow(false)
                    notifySuccess(`Form Json add SuccessFully`);
                    getFormList()
                    setFormFields([])
                    setEditFormId('')
                }).catch((error) => {
                    notifyError(`Something went wrong`);
                })
            }
        }
    };

    const addPermission = (e) => {
        e.preventDefault();
        if(selectedUserPermission?.length > 0 && selectedUserName){
            const payload = {
                roleId: selectedUserName,
                permissions: JSON.stringify(selectedUserPermission)
            }
            UserGroupServices.addPermission(payload).then((resp) => {
                if (resp) {
                    setPermissionShow(false)
                    notifySuccess('User permission add successFully')
                }
            }).catch((error) => {
                notifyError(error)
                console.log(error)
            })
        }
    }

    const closeModal = () => {
        setShow(false)
        setFieldType([])
        setFormFields([])
        setEditFormId('')
        setIsMailAllow('')
        setIsPrintAllow('')
        setPublishForm('')
    }

    const handlePermissionCancel = () => {
        setPermissionShow(false)
        setSelectedUserPermission()
        setSelectedUserName('')
    }

    return (
        <Layout style={{ minHeight: 'calc(100vh - 56px)' }}>
            <Toast />

            <Layout style={{backgroundColor: '#F9FAFB'}}>
                <Modal
                    title={editFormId ? "Edit Form" : "Create Form"}
                    centered
                    open={show}
                    onOk={generateFormJson}
                    okText={editFormId ? "Edit Form" : "Submit Form"}
                    okButtonProps={{
                        style: { backgroundColor: '#001529' }
                    }}
                    onCancel={closeModal}
                    width={'75%'}
                >
                        <Container>
                            <Row>
                                <Col xs={12} sm={12} md={5}>
                                    <div className="addFieldContainer">
                                        <div>
                                            <div className={"sidebarLabel"}>Please Add Form Name</div>
                                            <Input
                                                type="text"
                                                placeholder="Enter Form Name"
                                                value={editFormName}
                                                onChange={(e) => setEditFormName(e.target.value)}
                                                className={'addFieldSelect'}
                                            />
                                            </div>
                                        <div className={"sidebarLabel"}>Please select Field</div>
                                        <Select value={fieldType} onChange={handleFieldTypeChange} className={'addFieldSelect'}>
                                            <Option value="">Select Field Type</Option>
                                            <Option value="checkbox">Checkbox</Option>
                                            <Option value="date">Date</Option>
                                            <Option value="datetime-local">Datetime-local</Option>
                                            <Option value="email">Email</Option>
                                            <Option value="tel">Tel</Option>
                                            <Option value="number">Number</Option>
                                            <Option value="password">Password</Option>
                                            <Option value="text">Text</Option>
                                            <Option value="textarea">Textarea</Option>
                                            <Option value="select-input">Select</Option>
                                            <Option value="radio">Radio</Option>
                                            <Option value="image">Image</Option>
                                            <Option value="video">Video</Option>
                                            <Option value="media">Media</Option>
                                        </Select>
                                        {['date', 'datetime-local', 'email', 'tel', 'number', 'password', 'text', 'textarea'].includes(fieldType) && (
                                            <>
                                                <div className={"sidebarLabel"}>Add Placeholder value</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Set Default value"
                                                    value={defaultValue}
                                                    onChange={handleDefaultInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                                <div className={"sidebarLabel"}>Add Form field label</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter field label"
                                                    value={labelInput}
                                                    onChange={handleLabelInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                            </>
                                        )}
                                        {fieldType === 'select-input' && (
                                            <div>
                                                <div className={"sidebarLabel"}>Add Form field label</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter field label"
                                                    value={labelInput}
                                                    onChange={handleLabelInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                                <div className={"sidebarLabel"}>Add Options value</div>
                                                {selectOptions.map((optionInput, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Input
                                                            type="text"
                                                            placeholder={`Enter option ${index + 1}`}
                                                            value={optionInput}
                                                            onChange={(e) => handleSelectOptionInputChange(index, e.target.value)}
                                                            className={'addFieldSelect'}
                                                        />
                                                        {index > 0 && ( // Show close icon for options beyond the first three
                                                            <Button type="link" danger onClick={() => handleRemoveOption(index)}>Remove</Button>
                                                        )}
                                                    </div>
                                                ))}

                                                <Button disabled={addOptionDisabled} style={{marginBottom: 10}} onClick={handleAddOption}>Add Option</Button>
                                                <div className={"sidebarLabel"}>Add Default value</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Set Default value"
                                                    value={defaultValue}
                                                    onChange={handleDefaultInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                            </div>
                                        )}
                                        {['checkbox', 'radio'].includes(fieldType) && (
                                            <div>
                                                <div className={"sidebarLabel"}>Add Form field label</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter field label"
                                                    value={labelInput}
                                                    onChange={handleLabelInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                                <div className={"sidebarLabel"}>Add checkbox/radio title</div>
                                                {selectOptions.map((optionInput, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Input
                                                            type="text"
                                                            placeholder={`Enter option ${index + 1}`}
                                                            value={optionInput}
                                                            onChange={(e) => handleSelectOptionInputChange(index, e.target.value)}
                                                            className={'addFieldSelect'}
                                                        />
                                                        {index > 0 && ( // Show close icon for options beyond the first three
                                                            <Button type="link" danger onClick={() => handleRemoveOption(index)}>Remove</Button>
                                                        )}
                                                    </div>
                                                ))}

                                                <Button style={{margin: '5px 0'}} disabled={addOptionDisabled} style={{marginBottom: 10}} onClick={handleAddOption}>Add Multiple Options</Button>
                                                <div className={"sidebarLabel"}>Set Default value</div>
                                                <Input
                                                    type="text"
                                                    placeholder="Set Default value"
                                                    value={defaultValue}
                                                    onChange={handleDefaultInputChange}
                                                    className={'addFieldSelect'}
                                                />
                                            </div>
                                        )}
                                        {(fieldType === 'image' || fieldType === 'video' || fieldType === 'media') && (
                                            <div className={'optionsContainer'}>
                                                <div>
                                                    <div className={"sidebarLabel"}>Add Placeholder value</div>
                                                    <Input
                                                        type="text"
                                                        placeholder="Set Default value"
                                                        value={defaultValue}
                                                        onChange={handleDefaultInputChange}
                                                        className={'addFieldSelect'}
                                                    />
                                                    <div className={"sidebarLabel"}>{`Add ${fieldType}`}</div>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter field label"
                                                        value={labelInput}
                                                        onChange={handleLabelInputChange}
                                                        className={'addFieldSelect'}
                                                    />
                                                </div>
                                                <div className="sidebarLabel">Media Options:</div>
                                                <Select value={mediaOption} onChange={handleMediaOptionChange} className={'mediaOptionSelect'} style={{width: '100%'}}>
                                                    <Option value="">Select Media Option</Option>
                                                    {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
                                                        <Option key={num} value={num.toString()}>{num}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        )}
                                        {fieldType && (
                                            <div>
                                                <div>
                                                    <label className={'sidebarLabel'} style={{ margin: "10px 0"}}>Is Field Required:</label>
                                                    <input
                                                        type="checkbox"
                                                        checked={fieldIsRequired}
                                                        onChange={() => setFieldIsRequired(!fieldIsRequired)}
                                                        style={{ margin: "5px 5px"}}
                                                    />
                                                </div>
                                                <Button disabled={fieldType === 'checkbox' || fieldType === 'radio' || fieldType === 'select-input'  ? addFieldDisabled : false} className={"AddButton"} onClick={addField}>Add {fieldType}</Button>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={7}>
                                    <div className="content">
                                        <form className="form">
                                            <h4 style={{textAlign: 'center', fontWeight: 800}}>{editFormName ? editFormName : 'Dynamic form'}</h4>
                                            {formFields.map((field, index) => (
                                                <div key={index} className="field" style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                                                    <label>{field.fieldLabel}</label>
                                                    {field.fieldType === 'btnpicker' && (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <select value={field.fieldVal} style={{ width: '100%' }} disabled>
                                                                {field.fieldOptions.split(',').map((option, index) => (
                                                                    <option key={index} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                            <Button className="removeButton" onClick={() => removeField(index)}>Remove</Button>
                                                        </div>
                                                    )}
                                                    {['textfield', 'textarea', 'btndate'].includes(field.fieldType) && (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {field.fieldType === 'textarea' ? (
                                                                <textarea value={field.fieldVal} style={{ width: '100%' }} readOnly />
                                                            ) : (
                                                                <input type={field.fieldSubType} value={field.fieldVal} style={{ width: '100%' }} readOnly />
                                                            )}
                                                            <Button className="removeButton" onClick={() => removeField(index)}>Remove</Button>
                                                        </div>
                                                    )}
                                                    {field.fieldType === 'checkbox' && (
                                                        <div>
                                                            {(Array.isArray(field.fieldOptions) ? field.fieldOptions : field.fieldOptions.split(',')).map((option, index) => (
                                                                <div key={index} style={{ width: '100%' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name={`checkbox_${index}`}
                                                                        value={option}
                                                                        checked={field.fieldVal.split(',').includes(option)}
                                                                        disabled
                                                                    /> {option}
                                                                </div>
                                                            ))}
                                                            <Button className="removeButton" onClick={() => removeField(index)}>Remove</Button>
                                                        </div>
                                                    )}
                                                    {field.fieldType === 'radiobutton' && (
                                                        <div>
                                                            {field.fieldOptions.split(',').map((option, index) => (
                                                                <div key={index} style={{ width: '100%' }}>
                                                                    <input type="radio" name={`radio_${index}`} value={option} checked={field.fieldVal === option} readOnly /> {option}
                                                                </div>
                                                            ))}
                                                            <Button className="removeButton" onClick={() => removeField(index)}>Remove</Button>
                                                        </div>
                                                    )}

                                                    {field.fieldType === 'media' && (
                                                        <div>
                                                            <label>{field.fieldVal}</label>
                                                            <Select style={{width: '100%'}} defaultValue={field.fieldOptions}>
                                                                {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
                                                                    <Option key={num} value={num.toString()}>{num}</Option>
                                                                ))}
                                                            </Select>
                                                            <Button className="removeButton" onClick={() => removeField(index)}>Remove</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <div>
                                                <label className={'sidebarLabel'} style={{ margin: "10px 0"}}>Publish Form</label>
                                                <input
                                                    type="checkbox"
                                                    checked={publishForm}
                                                    onChange={(e) => setPublishForm(!publishForm)}
                                                    style={{ margin: "5px 5px"}}
                                                />
                                            </div>
                                            <div>
                                                <label className={'sidebarLabel'} style={{ margin: "10px 0"}}>Print Form</label>
                                                <input
                                                    type="checkbox"
                                                    checked={isPrintAllow}
                                                    onChange={(e) => setIsPrintAllow(!isPrintAllow)}
                                                    style={{ margin: "5px 5px"}}
                                                />
                                            </div>
                                            <div>
                                                <label className={'sidebarLabel'} style={{ margin: "10px 0"}}>Email Form</label>
                                                <input
                                                    type="checkbox"
                                                    checked={isMailAllow}
                                                    onChange={(e) => setIsMailAllow(!isMailAllow)}
                                                    style={{ margin: "5px 5px"}}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </Col>
                            </Row>
                        </Container>

                </Modal>

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
                            <Select placeholder="Select a name"  onChange={handleChange} style={{ width: '100%' }}>
                                {userTree.map(item => (
                                    <Option key={item.id} value={item.name}>{item.name}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} style={{marginTop: 10, marginBottom: 10}}>
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

                <div className={'container'} style={{marginTop: '50px'}}>
                    <div className='row'>
                        <div className={'AddFormContainerHeader'} style={{display: 'flex', justifyContent: "space-between", margin: '10px 0 30px'}}>
                            <div style={{fontSize: '30px'}}>Form List</div>
                            <div>
                                {/*<button style={{*/}
                                {/*    padding: '10px 20px',*/}
                                {/*    fontSize: '16px',*/}
                                {/*    backgroundColor: '#001529',*/}
                                {/*    color: '#FFFFFF',*/}
                                {/*    border: 'none',*/}
                                {/*    borderRadius: '4px',*/}
                                {/*    cursor: 'pointer',*/}
                                {/*    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',*/}
                                {/*    transition: 'background-color 0.3s ease',*/}
                                {/*    marginRight: '10px'*/}
                                {/*}} onClick={() => setPermissionShow(true)}>Add Permission</button>*/}
                                <button style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    backgroundColor: '#001529',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s ease',
                                }} onClick={() => setShow(true)}>Create Form</button>

                            </div>
                        </div>

                    </div>
                    <div className='row'>

                        <div className={'col-md-12'}>
                            <FormTable
                                formList={formList}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                setSelectedRowKeys={setSelectedRowKeys}
                                selectedRowKeys={selectedRowKeys}
                            />
                        </div>
                    </div>
                </div>

            </Layout>
        </Layout>
    );
};

export default DynamicForm;
