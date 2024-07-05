import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, CarOutlined, TeamOutlined, DashboardOutlined } from "@ant-design/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';
import { getDataAdmin } from '../../services/UserService';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

const AdminHomeComponent = () => {

  const user = useSelector((state) => state.user);
  const [dataAdmin, setDataAdmin] = useState({
    numUser: 0,
    numBusOwner: 0,
    numBus: 0,
    numDriver: 0,
    dataNewUser: [],
    dataRevenue: []

  })

  const data1 = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];


  const { data, isSuccess, isError, refetch } = useQuery(
    {
      queryKey: ['dataAdmin'],
      queryFn: () => getDataAdmin(user?.access_token),
    });

  useEffect(() => {
    if (isSuccess) {
      setDataAdmin(data?.data)
    } else if (isError) {
      console.log('err', data);
    }

  }, [isSuccess, isError, data])

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  // Prepare data with percentage change
  const dataWithPercentage = dataAdmin.dataNewUser.map((entry, index) => {
    if (index === 0) {
      return { ...entry, percentageChange: 0 };
    } else {
      const previousNewUser = dataAdmin.dataNewUser[index - 1].newUser;
      const percentageChange = calculatePercentageChange(entry.newUser, previousNewUser);
      return { ...entry, percentageChange };
    }
  });
  return (
    <div>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={dataAdmin.numUser}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nhà xe"
              value={dataAdmin.numBusOwner}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số xe"
              value={dataAdmin.numBus}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số tài xế"
              value={dataAdmin.numDriver}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row justify={'space-around'} style={{ marginTop: 16 }}>
        <Col>
          <Card title="So sánh số lượng người dùng mới">
            <ResponsiveContainer width={400} height={300}>
              <BarChart data={dataWithPercentage}>
                <CartesianGrid />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [value, `${props.payload.percentageChange.toFixed(2)}%`]} />
                <Legend />
                <Bar dataKey="newUser" fill="#8884d8" name="Người dùng mới" />
                <Bar dataKey="percentageChange" fill="#82ca9d" name="Phần trăm thay đổi" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col>
          <Card title="Revenue Over Time">
            <ResponsiveContainer width={400} height={300}>
              <LineChart data={data1}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminHomeComponent