import React, { useRef, useState } from 'react';
import { Card, Button, Tabs, Rate, Modal, Form, Input, Select, Row, Col } from 'antd';
// import 'antd/dist/antd.css';
import './style.css'; // Liên kết file CSS của bạn
import { ExclamationCircleOutlined, EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import TabBookTicket from './TabContent/TabBookTicket/TabBookTicket';
import TabImagesComponent from './TabContent/TabImages/TabImagesComponent';
import TabJourneysComponent from './TabContent/TabJourneys/TabJourneysComponent';
import { calculateArrivalTime, formatTimeVn, getVnCurrency } from '../../utils';
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

    //         id: trip.id,
    //         busOwnerId: trip.busOwnerId.id,
    //         busOwnerName: trip.busOwnerId.busOwnerName,
    //         avatar: trip.busId.avatar,
    //         rating: trip.busId.averageRating,
    //         reviewCount: trip.busId.reviewCount,
    //         images: trip.busId.images,
    //         convinients: trip.busId.convinients,
    //         typeBus: trip.busId.typeBus,
    //         totalSeats: `${trip.busId.numberSeat - trip.ticketsSold}/${trip.busId.numberSeat}`,
    //         routeId: trip.routeId.id,
    //         departureLocation: `${trip.routeId.districtStart} - ${trip.routeId.placeStart}`,
    //         arrivalLocation: `${trip.routeId.districtEnd} - ${trip.routeId.placeEnd}`,
    //         ticketPrice: trip.ticketPrice,
    //         paymentRequire: trip.paymentRequire,
    //         prebooking: trip.prebooking,
    //         departureDate: trip.departureDate,
    //         arrivalTime: arrivalTime,
    //         departureTime: departureTime,

    console.log('trip', trip);


    return (
        <div className="card-trip-container">
            <Card className="card-trip">
                <Row className="card-trip-content">
                    <Col span={6} className="card-trip-avatar">
                        <img src={trip.bus.avatar} alt="Bus Avatar" />
                    </Col>
                    <Col span={8} className="card-trip-info">
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{trip.busOwner.busOwnerName}</div>
                        <p>Đánh giá: <strong> {trip.busOwner.averageRating} <Rate disabled defaultValue={1} count={1} /> ({trip.busOwner.reviewCount})</strong></p>
                        <p><strong>{trip.bus.typeBus} chỗ</strong></p>
                        <p>Số chỗ trống: <strong>{trip.totalSeats - trip.bookedSeats} / {trip.totalSeats}</strong></p>
                    </Col>
                    <Col span={10}>
                        <Row justify={'end'} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#29BE27' }}>Giá vé: {getVnCurrency(trip.ticketPrice)}</Row>
                        <div>{formatTimeVn(trip.departureTime)}</div>
                        <div><EnvironmentOutlined /> <strong>{`${trip.route.placeStart} - ${trip.route.districtStart} `}</strong></div>
                        <div>  <MoreOutlined /> </div>
                        <div><EnvironmentOutlined /> <strong>{`${trip.route.placeEnd} - ${trip.route.districtEnd} `}</strong></div>
                        <div> {formatTimeVn(calculateArrivalTime(trip.departureTime, trip.route.journeyTime))}</div>
                    </Col>
                </Row>
                <Row justify={'space-between'}>
                    <div
                        style={{ color: 'red', fontSize: '16px', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => { setIsReport(true) }}
                    >
                        <ExclamationCircleOutlined /> Báo cáo/ Khiếu nại
                    </div>
                    <div>
                        <Button type="primary" onClick={handleShowDetails} >Xem chi tiết</Button>
                        <Button type="primary" onClick={handleBookTickets} style={{ marginLeft: '20px' }}>Đặt vé</Button>
                    </div>
                </Row>

                {showDetails && (
                    <Tabs activeKey={activeTab} onChange={handleTabChange}>
                        <TabPane tab="Hình ảnh" key="1">
                            <TabImagesComponent images={JSON.parse(trip.bus.images)}></TabImagesComponent>
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
                        typeBus={trip.bus.typeBus}
                        paymentRequire={trip.paymentRequire}
                        prebooking={trip.prebooking}
                        routeId={trip.routeId}
                        ticketPrice={trip.ticketPrice}
                        departureTime={trip.departureTime}
                        tripId={trip.id}
                        departureDate={trip.departureDate}
                        busOwnerId={trip.busOwnerId}
                        busOwnerName={trip.busOwner.busOwnerName}
                        routeName={`${`${trip.route.placeStart}-${trip.route.districtStart} `} - ${`${trip.route.placeEnd}-${trip.route.districtEnd} `}`}
                    />

                )}

            </Card>

            {
                isReport && <Modal
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
                </Modal>
            }
        </div >
    );
};

export default BusCard;
