import React, { useState } from 'react'
import { Row, Col, Card, Tag, Button, Popover, Modal } from 'antd';
import { FileTextOutlined } from '@ant-design/icons'


const SeatInformation = ({ listSeat, setVisible, getTicketOrderDetail }) => {

    return (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', gap: '16px' }}>
                {listSeat.map(seat => (

                    <Col style={{ flex: '0 0 calc(25% - 16px)' }} key={seat.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #666', borderRadius: '10px', padding: '5px 10px', height: '210px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}> {seat.id}</div>
                                <b style={{ color: 'orange', fontSize: '20px' }}>(G{seat.seatCount})</b>
                                <Tag
                                    color={seat.status === 'Đã lên xe' ? 'blue' : (seat.status === 'Đã hoàn thành' ? 'success' : 'warning')}
                                >
                                    {seat.status === 'Đã lên xe' ? seat.status : (seat.status === 'Đã hoàn thành' ? seat.status : 'Chưa lên xe')}
                                </Tag>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: '500', marginTop: '5px' }}>{seat.phone}</div>
                            <div><strong>Đón : </strong> {seat.pickUp} {seat.notePickUp && `(${seat.notePickUp})`}</div>
                            <div><strong>Trả : </strong> {seat.dropOff} {seat.noteDropOff && `(${seat.noteDropOff})`} </div>
                            <div style={{ marginBottom: '10px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex' }}>
                                    <strong>Giá vé : </strong> {seat.ticketPrice}
                                </div>
                                {seat.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>}
                                <Popover content="Chi tiết vé" >
                                    <FileTextOutlined onClick={() => { setVisible(true); getTicketOrderDetail(seat.orderId) }} style={{ fontSize: '20px' }} />
                                </Popover>

                            </div>
                        </div>

                    </Col>


                ))}
            </div>

        </div>
    )
}

export default SeatInformation