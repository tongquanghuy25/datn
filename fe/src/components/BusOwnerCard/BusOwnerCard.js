import './style.css'
import React from 'react'
import { useMutation } from '@tanstack/react-query';
import { Card, Row, Col, Button } from 'antd';
import { errorMes, successMes } from '../Message/Message';
import { deleteAgent, deleteBusOwner, editAgent, editBusOwner } from '../../services/PartnerSevice';
import { deleteUser, editUser } from '../../services/UserService';
const BusOwnerCard = (props) => {
    const { data, access_token, refetch } = props
    // const { id, userId, busOwnerName, citizenId, address, route } = data;
    // const { email, phone, name } = userId;
    const mutationAccept = useMutation({
        mutationFn: async (data) => {
            console.log(data);
            if (data.isBusOwner) {
                await editUser(data?.userId, data?.access_token, { role: 'BUSOWNER' });
                return await editBusOwner(data.id, data.access_token, { isAccept: true });
            } else {
                await editUser(data?.userId, data?.access_token, { role: 'AGENT' });
                return await editAgent(data.id, data.access_token, { isAccept: true });
            }
        },
        onSuccess: (data) => {
            successMes('Xác nhận đối tác thành công!')
            refetch()
        },
        onError: (data) => {
            refetch()
            errorMes(data?.response?.data?.message)
        }
    });


    const HandleAccept = () => {
        mutationAccept.mutate({
            id: data?.id,
            access_token,
            userId: data?.userId,
            isBusOwner: data.busOwnerName ? true : false
        })
    }

    const mutationRefuse = useMutation({
        mutationFn: async (data) => {
            await deleteUser(data?.userId, data?.access_token);
            if (data.isBusOwner) {
                return await deleteBusOwner(data.id, data.access_token);
            } else {
                return await deleteAgent(data.id, data.access_token);
            }
        },
        onSuccess: () => {
            successMes('Từ chối đối tác!')
            refetch()
        },
        onError: (data) => {
            refetch()
            errorMes(data?.response?.data?.message)
        }
    });

    const HandleRefuse = () => {
        mutationRefuse.mutate({
            id: data?.id,
            access_token,
            userId: data?.user.id,
            isBusOwner: data.busOwnerName ? true : false
        })
    }
    console.log('dâ', data);
    return (
        <Card className={`info-card ${data?.busOwnerName ? 'busOwner' : 'agent'}`} >
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>{data?.busOwnerName ? "Thông tin nhà xe" : "Thông tin đại lý"}</div>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <p><strong>Tên quản lý:</strong> {data?.managerName}</p>
                    <p><strong>Email quản lý:</strong> {data?.managerEmail}</p>
                    <p><strong>Số điện thoại quản lý:</strong> {data?.managerPhone}</p>
                </Col>
                <Col span={8}>
                    {data?.busOwnerName ?
                        <p><strong>Tên nhà xe:</strong> {data?.busOwnerName}</p>
                        :
                        <p><strong>Tên đại lý:</strong> {data?.agentName}</p>
                    }
                    <p><strong>Địa chỉ:</strong> {data?.address}</p>

                    <p><strong>Số căn cước công dân:</strong> {data?.citizenId}</p>
                </Col>
                <Col span={10}>
                    <p><strong>Loại doanh nghiệp:</strong> {data?.companyType}</p>
                    <p><strong>Mô tả:</strong> {data?.companyDescription}</p>
                </Col>
            </Row>
            <div className="button-container">
                <Button type="primary" onClick={HandleAccept}>Xác nhận</Button>
                <Button type="primary" onClick={HandleRefuse} danger style={{ marginLeft: '8px' }}>Từ chối</Button>
            </div>
        </Card>
    )
}

export default BusOwnerCard