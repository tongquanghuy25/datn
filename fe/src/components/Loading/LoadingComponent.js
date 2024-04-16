import React from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 30,
                        }}
                        spin
                    />
                } />
        </div>
    )
}

export default LoadingComponent