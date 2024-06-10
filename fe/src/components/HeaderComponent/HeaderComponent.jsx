import './style.css';
import { Breadcrumb, Col, Layout, Menu, Popover, Row, theme } from 'antd';
import {
    UserOutlined,
    CaretDownOutlined,
    PhoneOutlined,
    QuestionCircleOutlined,
    ContainerOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from '../../acess/logo.png';
import { useHandleLogout } from '../../utils/Action/HandleLogOut';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)

    const handleLogOut = useHandleLogout()

    useEffect(() => {
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
    }, [user?.name, user?.avatar])
    console.log('user', user);

    const content = (
        <div>
            <p className='popover-item' style={{}} onClick={() => navigate('/profile')}>Thông tin người dùng</p>
            <div style={{ borderTop: '1px solid black' }}></div>

            <p className='popover-item' style={{}} onClick={() => navigate('/change-password')}>Đổi mật khẩu</p>
            <div style={{ borderTop: '1px solid black' }}></div>
            <p className='popover-item' onClick={() => handleLogOut()}>Đăng xuất</p>
        </div>
    );

    return (
        <div style={{ heiht: '100%', width: '100%', display: 'flex', background: '#9255FD', justifyContent: 'center', height: '80px' }}>
            <Row style={{ heiht: '100%', width: '100%', display: 'flex', background: '#9255FD', justifyContent: 'space-between', alignItems: 'center' }}>
                <Col span={8} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div onClick={() => navigate('/')}>
                        {/* <a href="https://vexere.com"> */}
                        <img className='logo-header' src={logo} alt="logo" />
                        {/* </a> */}
                    </div>

                    {/* <div className='text-header'>
                        Cam kết uy tín với khách hàng
                    </div> */}

                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div onClick={() => { navigate('/booked-tickets') }} className='header-items'>
                        <ContainerOutlined style={{ marginRight: '10px' }} />
                        Xem vé đã mua
                    </div>
                    <div onClick={() => navigate('/partner-registration')} className='header-items'>
                        <UsergroupAddOutlined style={{ marginRight: '10px', fontSize: '20px' }} />
                        Trở thành đối tác
                    </div>
                    <div onClick={() => { console.log('huyhuy'); }} className='header-items'>
                        <QuestionCircleOutlined style={{ marginRight: '10px' }} />
                        Giới thiệu
                    </div>
                    <div onClick={() => { console.log('huyhuy'); }} className='header-items'>
                        <PhoneOutlined style={{ marginRight: '10px' }} />
                        Liên hệ
                    </div>
                </Col>
                <Col span={4} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {userAvatar ? (
                        <img src={userAvatar} alt="avatar" style={{
                            height: '50px',
                            width: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '10px',
                            border: '1px solid yellow'
                        }} />
                    ) : (
                        <UserOutlined style={{ fontSize: '30px', color: 'white', marginLeft: '10px' }} />
                    )}
                    {user?.access_token ? (
                        <>
                            <Popover content={content} trigger="click" open={isOpenPopup}>
                                <div className='text' style={{ cursor: 'pointer', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    onClick={
                                        () => setIsOpenPopup((prev) => !prev)}>
                                    {userName?.length ? userName : user?.email}
                                </div>
                            </Popover>
                        </>
                    ) :
                        (<div onClick={() => { navigate('/sign-in') }} className='text' style={{ cursor: 'pointer' }}>
                            Đăng nhập/Đăng ký
                            <div>
                                Tài khoản
                                <CaretDownOutlined />
                            </div>
                        </div>)
                    }
                </Col>
            </Row>
        </div>
    )
}

export default HeaderComponent