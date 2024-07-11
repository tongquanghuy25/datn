import React from 'react';
import { Typography, Row, Col, Card, Divider, Image } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
    const coreValues = [
        { title: 'Chất lượng', description: 'Đảm bảo chất lượng dịch vụ hàng đầu.' },
        { title: 'An toàn', description: 'Cam kết an toàn cho mọi hành trình.' },
        { title: 'Tin cậy', description: 'Xây dựng niềm tin với khách hàng.' },
        { title: 'Tận tâm', description: 'Phục vụ khách hàng một cách tận tâm.' },
        { title: 'Sáng tạo', description: 'Liên tục sáng tạo và cải tiến dịch vụ.' },
    ];

    const cardStyle = {
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textAlign: 'center',
        padding: '20px',
        marginBottom: '20px',
    };

    const hoverStyle = {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    };
    return (
        <>
            <HeaderComponent />
            <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                <Card>
                    <Row justify="center" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Title level={2} style={{ fontSize: '36px' }}>Về Chúng Tôi</Title>
                        </Col>
                    </Row>
                    <Divider />
                    <Row justify="center">
                        <Col xs={24} sm={20} md={16} lg={14}>
                            {/* <Image
                                width={200}
                                src="https://via.placeholder.com/200"
                                alt="Our Team"
                                style={{ borderRadius: '50%', marginBottom: '20px' }}
                            /> */}
                            <Paragraph style={{ fontSize: '18px' }}>
                                Chào mừng bạn đến với hệ thống bán vé và quản lý xe khách của chúng tôi. Chúng tôi cung cấp dịch vụ chất lượng cao giúp bạn dễ dàng đặt vé xe và quản lý hành trình của mình một cách thuận tiện và hiệu quả.
                            </Paragraph>
                            <Paragraph style={{ fontSize: '18px' }}>
                                Với đội ngũ nhân viên tận tâm và giàu kinh nghiệm, chúng tôi cam kết mang đến cho bạn trải nghiệm tốt nhất. Bạn có thể tìm kiếm các chuyến đi, đặt vé, quản lý vé đã đặt, và nhiều hơn nữa thông qua website của chúng tôi.
                            </Paragraph>
                            <Paragraph style={{ fontSize: '18px' }}>
                                Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
                            </Paragraph>
                            <Title level={3} style={{ fontSize: '30px' }}>Sứ Mệnh của Chúng Tôi</Title>
                            <Paragraph style={{ fontSize: '18px' }}>
                                Sứ mệnh của chúng tôi là cung cấp dịch vụ vận tải hành khách an toàn, tiện lợi và hiệu quả. Chúng tôi luôn không ngừng cải tiến và nâng cao chất lượng dịch vụ để đáp ứng nhu cầu của khách hàng.
                            </Paragraph>
                            <Title level={3} style={{ fontSize: '30px' }}>Tầm Nhìn của Chúng Tôi</Title>
                            <Paragraph style={{ fontSize: '18px' }}>
                                Trở thành đơn vị hàng đầu trong lĩnh vực vận tải hành khách, mang đến những giải pháp tiện lợi và an toàn nhất cho khách hàng.
                            </Paragraph>
                            <Title level={3} style={{ fontSize: '30px' }}>Giá Trị Cốt Lõi</Title>
                            <Row justify="center" gutter={[16, 16]}>
                                {coreValues.map((value, index) => (
                                    <Col xs={24} sm={12} md={8} key={index}>
                                        <Card
                                            hoverable
                                            style={cardStyle}
                                            bodyStyle={{ padding: '20px' }}
                                            onHover={() => ({ ...hoverStyle })}
                                        >
                                            <Title level={4} style={{ fontSize: '24px', color: '#1890ff' }}>{value.title}</Title>
                                            <Paragraph style={{ fontSize: '16px', color: '#555' }}>{value.description}</Paragraph>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>
            <FooterComponent />
        </>
    );
};

export default AboutUsPage;
