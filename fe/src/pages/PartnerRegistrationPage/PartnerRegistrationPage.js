import { Card, Tabs } from 'antd';
import './style.css'
import React, { useEffect, useState } from 'react'
import TabPane from 'antd/es/tabs/TabPane';
import PartnerRegistrationForm from '../../components/PartnerRegistrationComponent/PartnerRegistrationForm';



const PartnerRegistrationPage = () => {
    const [activeTab, setActiveTab] = useState('busOwner');
    return (
        <div className='form_partner'>
            <Card >
                <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)}>
                    <TabPane tab="Nhà xe" key="busOwner">
                        <PartnerRegistrationForm isBusOwner={true}></PartnerRegistrationForm>
                    </TabPane>
                    <TabPane tab="Đại lý" key="agent">
                        <PartnerRegistrationForm isBusOwner={false}></PartnerRegistrationForm>
                    </TabPane>
                </Tabs>
            </Card>


        </div >
    )
}

export default PartnerRegistrationPage