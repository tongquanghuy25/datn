import './style.css'
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import { Card, Row, Col, Button } from 'antd';
import { error, success } from '../Message';
import { editBusOwner } from '../../services/BusOwnerSevice';
import { editUser } from '../../services/UserService';
const BusOwnerCard = (props) => {
    const { data, access_token, refetch } = props
    console.log('accept', access_token);
    const { _id, userId, busOwnerName, citizenId, address, route } = data;
    const { email, phone, name } = userId;
    const mutation = useMutation({
        mutationFn: async (data) => {
            // console.log('id', data._id, data.access_token);
            console.log('dataaaa', data);
            await editUser(data.userId._id, { role: 'busowner' }, data.access_token);
            return await editBusOwner(data._id, { isAccept: true }, data.access_token);
        },
        onSuccess: () => {
            refetch()
            success('Sửa người dùng thành công !')
        },
        onError: (e) => {
            console.log(e);
            refetch()
            error('Sửa người dùng không thành công !')
        }
    });
    const HandleAccept = () => {
        mutation.mutate({ _id, access_token, userId })
    }
    return (
        <Card title="Thông tin nhà xe" className="user-info-card">
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <p><strong>Tên người dùng:</strong> {name}</p>
                    <p><strong>Số căn cước công dân:</strong> {citizenId}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Số điện thoại:</strong> {phone}</p>
                </Col>
                <Col span={12}>
                    <p><strong>Tên nhà xe:</strong> {busOwnerName}</p>
                    <p><strong>Địa chỉ:</strong> {address}</p>
                    <p><strong>Tuyến đường:</strong> {route}</p>
                </Col>
            </Row>
            <div className="button-container">
                <Button type="primary" onClick={HandleAccept}>Xác nhận</Button>
                <Button type="primary" danger style={{ marginLeft: '8px' }}>Từ chối</Button>
            </div>
        </Card>
    )
}

export default BusOwnerCard