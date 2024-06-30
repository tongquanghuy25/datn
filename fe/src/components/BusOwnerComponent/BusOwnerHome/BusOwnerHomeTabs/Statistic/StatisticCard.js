import React from 'react';
import { Card, Col, Row, Space, Statistic } from 'antd';

const StatisticCard = (props) => {
    const { title, value, icon } = props

    // const containerStyle = ;

    return (
        <>
            <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
                <Space direction='horizontal'>
                    {icon}
                    <Statistic
                        title={<div style={{ fontSize: '20px' }}>{title}</div>}
                        value={value}
                        valueStyle={{ fontSize: '24px' }}
                    // prefix={icon}
                    />
                </Space>
            </Card>
        </>
    )
}

export default StatisticCard

