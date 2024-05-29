import React, { useRef, useState } from 'react';
import { Card, Button, Tabs, Rate, Modal, Form, Input, Select } from 'antd';
// import 'antd/dist/antd.css';
import './style.css'; // Liên kết file CSS của bạn
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import TabBookTicket from './TabContent/TabBookTicket/TabBookTicket';
import TabImagesComponent from './TabContent/TabImages/TabImagesComponent';
import TabJourneysComponent from './TabContent/TabJourneys/TabJourneysComponent';
import { getVnCurrency } from '../../utils';
import TabReview from './TabContent/TabReview/TabReview';
import TextArea from 'antd/es/input/TextArea';
import { createReport } from '../../services/ReportService';
import { useMutation } from '@tanstack/react-query';
import { errorMes, successMes } from '../Message/Message';

const { Option } = Select;

const BusCard = ({ trip }) => {
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [showDetails, setShowDetails] = useState(false);
    const [bookTickets, setBookTickets] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [activeTab, setActiveTab] = useState('1');


    // const listTicketSold = ['A1', 'A2', 'A3', 'B1']
    const handleShowDetails = () => {
        setBookTickets(false)
        setShowDetails(!showDetails);
    };
    const handleBookTickets = () => {
        setShowDetails(false)
        setBookTickets(!bookTickets);
    };

    const handleTabChange = key => {
        setActiveTab(key);
    };

    const mutationCreateReport = useMutation({
        mutationFn: (data) => {
            return createReport(data)
        },
        onSuccess: (data) => {
            successMes(data?.message);
            setIsReport(false)
            form.resetFields()
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    })

    const onFinish = (values) => {
        mutationCreateReport.mutate({
            busOwnerId: trip.busOwnerId,
            phone: values.phone,
            title: values.title,
            content: values.content
        })
    }


    return (
        <div className="card-trip-container">
            <Card className="card-trip">
                <div className="card-trip-content">
                    <div className="card-trip-avatar">
                        <img src={trip.avatar} alt="Bus Avatar" />
                    </div>
                    <div className="card-trip-info">
                        <p className='name'>{trip.busOwnerName}</p>
                        <p>Đánh giá: {trip.rating} <Rate disabled defaultValue={1} count={1} /> ({trip.rating})</p>
                        <p className="price">Giá vé: {getVnCurrency(trip.ticketPrice)}</p>
                        <p>Số chỗ còn trống: {trip.availableSeats}</p>
                    </div>
                    <div>
                        <p>Giờ xuất phát: {trip.departureTime}</p>
                        <p>Địa điểm xuất phát: {trip.departureLocation}</p>
                        <p>Giờ đến: {trip.arrivalTime}</p>
                        <p>Địa điểm đến: {trip.arrivalLocation}</p></div>
                </div>
                <div className="card-trip-actions">
                    <div
                        style={{ color: 'red', fontSize: '16px', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => { setIsReport(true) }}
                    >
                        <ExclamationCircleOutlined /> Báo cáo/ Khiếu nại
                    </div>
                    <div>
                        <Button type="primary" onClick={handleShowDetails}>Xem chi tiết</Button>
                        <Button type="primary" onClick={handleBookTickets}>Đặt vé</Button>
                    </div>
                </div>

                {showDetails && (
                    <Tabs activeKey={activeTab} onChange={handleTabChange}>
                        <TabPane tab="Hình ảnh" key="1">
                            <TabImagesComponent images={trip.images}></TabImagesComponent>
                        </TabPane>
                        <TabPane tab="Đánh giá" key="2">
                            <TabReview busOwnerId={trip?.busOwnerId} />
                        </TabPane>
                        <TabPane tab="Tiện ích" key="3">
                            Nội dung Tiện ích
                        </TabPane>
                        <TabPane tab="Hành trình" key="4">
                            <TabJourneysComponent departureTime={trip.departureTime} routeId={trip.routeId}></TabJourneysComponent>
                        </TabPane>
                        <TabPane tab="Chính sách" key="5">
                            Nội dung hành trình
                        </TabPane>
                    </Tabs>
                )}
                {bookTickets && (

                    <TabBookTicket
                        typeBus={trip.typeBus}
                        paymentRequire={trip.paymentRequire}
                        prebooking={trip.prebooking}
                        routeId={trip.routeId}
                        ticketPrice={trip.ticketPrice}
                        departureTime={trip.departureTime}
                        tripId={trip._id}
                        departureDate={trip.departureDate}
                        busOwnerId={trip.busOwnerId}
                        busOwnerName={trip.busOwnerName}
                        routeName={`${trip.departureLocation} - ${trip.arrivalLocation}`}
                    />

                )}

            </Card>

            {isReport && <Modal
                title={<h3>Báo cáo với chúng tôi</h3>}
                open={isReport}
                okText='Gửi'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
                onCancel={() => {
                    setIsReport(false)
                    form.resetFields()
                }}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >

                    <Form.Item name="phone" >
                        <Input placeholder="Số điện thoại liên hệ với bạn" />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Chủ đề muốn báo cáo"

                    >
                        <Select
                            style={{ minWidth: '150px', marginRight: '10px' }}
                            showSearch
                            placeholder="Chọn tuyến đường"
                        >
                            <Option value="Giá vé">Giá vé</Option>
                            <Option value="Điểm đón trả">Điểm đón trả</Option>
                            <Option value="Thông tin tiện ích">Thông tin tiện ích</Option>
                            <Option value="Lịch chạy(Giờ chạy)">Lịch chạy(Giờ chạy)</Option>
                            <Option value="Thông tin nhà xe">Thông tin nhà xe</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>

                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung muốn báo cáo"

                    >
                        <TextArea
                            placeholder='Vui lòng nhập mô tả chi tiết'
                        />

                    </Form.Item>

                </Form>
            </Modal>}
        </div>
    );
};

export default BusCard;
