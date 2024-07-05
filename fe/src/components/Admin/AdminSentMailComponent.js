import React, { useState } from 'react';
import { Form, Input, Button, message, Row, AutoComplete } from 'antd';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { sentMailAdmin } from '../../services/UserService';
import { errorMes, successMes } from '../Message/Message';
// import 'antd/dist/antd.css';

const { TextArea } = Input;

const options = [
    { value: 'Tất cả' },
    { value: 'Nhà xe' },
    { value: 'Tài xế' },
    { value: 'Đại lý' },
    { value: 'Người dùng' },
]

const AdminSentMailComponent = () => {
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState('');
    const user = useSelector((state) => state.user)


    const mutation = useMutation({
        mutationFn: (data) => {
            console.log('da', data);
            return sentMailAdmin(user?.access_token, data)
        },
        onSuccess: () => {
            successMes("Gửi mail thành công !");
            form.resetFields()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })

    const onFinish = async (values) => {
        mutation.mutate({
            to: values.to,
            subject: values.subject,
            content: editorContent
        });
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'color', 'background',
        'align'
    ];

    return (
        <div style={{ maxWidth: 800, margin: '30px auto' }}>
            <h1>Gửi mail</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="to"
                    label="Đến"
                    rules={[{ required: true, message: 'Nhập đối tượng muốn gửi đến!' }]}
                    style={{ maxWidth: 400 }}
                >
                    {/* <Input placeholder="Người nhận" /> */}
                    <AutoComplete
                        options={options}
                        // onSearch={handleSearch}
                        placeholder="Người nhận"
                    />
                </Form.Item>
                <Form.Item
                    name="subject"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Nhập tiêu đề của mail!' }]}
                >
                    <Input placeholder="Tiêu đề mail" />
                </Form.Item>
                <Form.Item
                    label="Nội dung"
                    rules={[{ required: true, message: 'Nhập nội dung mail!' }]}
                >
                    <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                        modules={modules}
                        formats={formats}
                        style={{ height: 'calc(100vh - 370px)', overflowY: 'auto', backgroundColor: 'white' }}
                    />
                </Form.Item>
                <Form.Item
                >
                    <Row justify={'center'} >
                        <Button type="primary" htmlType="submit">
                            Gửi Email
                        </Button>
                    </Row>

                </Form.Item>
            </Form>
        </div>
    )
}

export default AdminSentMailComponent