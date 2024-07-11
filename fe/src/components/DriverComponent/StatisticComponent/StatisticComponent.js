import React, { useState, useEffect } from 'react';
import { DatePicker, Button, Card, Row, Col, Table, Typography } from 'antd';
import { CarOutlined, FileTextOutlined, DollarOutlined, InboxOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query';
import { getStatisticDriver } from '../../../services/DriverService';
import dayjs from 'dayjs';
import { formatTime, formatTimeVn } from '../../../utils';
import { errorMes } from '../../Message/Message';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;


const StatisticComponent = () => {

  const user = useSelector((state) => state.user);
  const [statistics, setStatistics] = useState({
    totalTrips: 0,
    totalTickets: 0,
    totalTicketAmount: 0,
    totalGoods: 0,
    totalGoodsAmount: 0,
  });
  const [tripDetails, setTripDetails] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);


  const mutation = useMutation({
    mutationFn: (data) => {
      const { startDate, endDate } = data
      return getStatisticDriver(user?.access_token, user?.id, JSON.parse(localStorage.getItem('driverid')), startDate, endDate)
    },
    onSuccess: (data) => {
      setStatistics(data?.data)
      setTripDetails(data?.data.tripDetails)
    },
    onError: (data) => {
      errorMes(data?.response?.data?.message)
    }
  })

  useEffect(() => {
    mutation.mutate({ startDate: dayjs().format('YYYY-MM-DD'), endDate: dayjs().format('YYYY-MM-DD') })
  }, [])

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
    }
  }, [dateRange]);

  const getData = () => {
    mutation.mutate({ startDate: dayjs(dateRange[0]).format('YYYY-MM-DD'), endDate: dayjs(dateRange[1]).format('YYYY-MM-DD') })
  }

  const columns = [
    {
      title: 'Tuyến đường',
      dataIndex: 'route',
      key: 'route',
      width: 350,

    },
    {
      title: 'Ngày xuất phát',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Giờ xuất phát',
      dataIndex: 'departureTime',
      key: 'departureTime',
      render: (time) => formatTimeVn(time),
    },
    {
      title: 'Số đơn vé',
      dataIndex: 'ticketOrders',
      key: 'ticketOrders',
    },
    {
      title: 'Tiền vé đã thu',
      dataIndex: 'ticketAmount',
      key: 'ticketAmount',
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'goodsOrders',
      key: 'goodsOrders',
    },
    {
      title: 'Tiền hàng đã thu',
      dataIndex: 'goodsAmount',
      key: 'goodsAmount',
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
  ];


  const colStyle = {
    textAlign: 'center',
    padding: '12px', // Thay đổi giá trị padding tại đây
    marginBottom: '16px',
    marginRight: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff', // Màu nền cho col
  };
  return (
    <div style={{ padding: 20 }}>
      <Row >
        <Col span={24}>
          <Card>
            <RangePicker
              format="YYYY-MM-DD"
              defaultValue={[dayjs(), dayjs()]}
              onChange={(dates) => setDateRange(dates)}
            />
            <Button
              type="primary"
              onClick={getData}
              disabled={!dateRange[0] || !dateRange[1]}
              style={{ marginLeft: 16 }}
            >
              Lấy dữ liệu
            </Button>
          </Card>
        </Col>
        <Col span={24} >
          <Row >
            <Col span={4}>
              <div style={colStyle}>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  <CarOutlined /> Tổng số chuyến
                </Title>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {statistics.totalTrips}
                </Text>
              </div>
            </Col>
            <Col span={5}>
              <div style={colStyle}>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  <FileTextOutlined /> Tổng số đơn vé
                </Title>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {statistics.totalTickets}
                </Text>
              </div>
            </Col>
            <Col span={5}>
              <div style={colStyle}>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  <DollarOutlined /> Số tiền đã thu từ vé
                </Title>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {statistics.totalTicketAmount.toLocaleString()} VND
                </Text>
              </div>
            </Col>
            <Col span={5}>
              <div style={colStyle}>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  <InboxOutlined /> Tổng số đơn gửi hàng
                </Title>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {statistics.totalGoods}
                </Text>
              </div>
            </Col>
            <Col span={5}>
              <div style={colStyle}>
                <Title level={5} style={{ marginBottom: '8px' }}>
                  <DollarOutlined /> Số tiền đã thu từ hàng
                </Title>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {statistics.totalGoodsAmount.toLocaleString()} VND
                </Text>
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Table
            rowKey="id"
            bordered
            columns={columns}
            dataSource={tripDetails}
            scroll={{
              y: 310,
            }}
          />
        </Col>
      </Row>
    </div >
  );
};

export default StatisticComponent;
