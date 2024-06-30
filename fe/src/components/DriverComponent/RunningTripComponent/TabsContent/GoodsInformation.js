import { Col, Row, Tag } from 'antd'
import React from 'react'
import nodata from '../../../../acess/nodata.jpg'
import { formatTimeVn } from '../../../../utils'
import dayjs from 'dayjs';



const GoodsInformation = ({ listGoodsOrder }) => {
    return (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {listGoodsOrder?.length > 0 ?
                listGoodsOrder?.map(goodsOrder => {
                    return (
                        <>
                            <Row gutter={[8, 8]} style={{ margin: '10px', padding: '10px', width: '95%', borderRadius: '20px', border: '1px solid #666', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: 'white' }}>
                                <Col span={6}>
                                    <div><strong>Tên người gửi:</strong> {goodsOrder.nameSender}</div>
                                    <div><strong>Số điện thoại người gửi:</strong> {goodsOrder.phoneSender}</div>
                                    <div><strong>Địa điểm gửi hàng:</strong> {goodsOrder.sendPlace}</div>
                                    <div><strong>Ghi chú:</strong> {goodsOrder.noteSend}</div>
                                    <div><strong>Thời gian gửi hàng:</strong> {formatTimeVn(goodsOrder.timeSend)} ngày {dayjs(goodsOrder.dateSend).format('DD-MM-YYYY')}</div>
                                </Col>

                                <Col span={6}>
                                    <div><strong>Tên người nhận:</strong> {goodsOrder.nameReceiver}</div>
                                    <div><strong>Số điện thoại người nhận:</strong> {goodsOrder.phoneReceiver}</div>
                                    <div><strong>Địa điểm nhận hàng:</strong> {goodsOrder.receivePlace}</div>
                                    <div><strong>Ghi chú:</strong> {goodsOrder.noteReceive}</div>
                                    <div><strong>Thời gian nhận hàng:</strong> {formatTimeVn(goodsOrder.timeReceive)} {dayjs(goodsOrder.dateReceive).format('DD-MM-YYYY')}</div>
                                </Col>

                                <Col span={8}>
                                    <div><strong>Tên hàng hóa:</strong> {goodsOrder.goodsName}</div>
                                    <div><strong>Mô tả hàng hóa:</strong> {goodsOrder.goodsDescription}</div>


                                </Col>
                                <Col span={4} style={{ display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', }} >
                                    <div><strong>Số tiền:</strong> {goodsOrder.price} {goodsOrder.isPaid ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>}</div>
                                    <div ><strong>Trạng thái:</strong> {goodsOrder.status === 'Pending' ? 'Chưa nhận hàng' : goodsOrder.status === 'Received' ? 'Đã nhận hàng' : goodsOrder.status === 'Cancelled' ? 'Đã hủy' : 'Đã trả hàng'}</div>
                                </Col>

                            </Row>

                        </>
                    )
                })
                :
                <div style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <img src={nodata} style={{ maxWidth: '200px' }}></img>
                    <h2>Chưa có đơn hàng hóa nào</h2>
                </div>
            }
        </div>
    )
}

export default GoodsInformation