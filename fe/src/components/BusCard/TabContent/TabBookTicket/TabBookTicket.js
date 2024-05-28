import { Button, Col, Input, InputNumber, Radio, Result, Row, Space, Steps } from 'antd';
import { initArraySeat } from '../../../../utils/SeatDiagram';
import SeatSelector from './SeatSelector';
import './style.css'
import React, { useEffect, useMemo, useState } from 'react'
import { errorMes, successMes, warningMes } from '../../../Message/Message';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getStopPointsByBusRoute } from '../../../../services/RouteService';
import TextArea from 'antd/es/input/TextArea';
import Paypal from './paypal';
import { createTicketOrder, getSeatsBookedByTrip } from '../../../../services/OrderService';
import { checkDiscount } from '../../../../services/DiscountService';
import { getVnCurrency } from '../../../../utils';
const { Step } = Steps;


function calculateTime(startTime, minutes) {
    const [startHour] = startTime.split('giờ').map(str => parseInt(str.trim()));
    const totalMins = startHour * 60 + minutes;
    let endHours = Math.floor(totalMins / 60) % 24;
    let endMins = totalMins % 60;

    // Định dạng giờ và phút thành chuỗi 'hh:mm'
    const formattedHours = endHours < 10 ? `0${endHours}` : `${endHours}`;
    const formattedMins = endMins < 10 ? `0${endMins}` : `${endMins}`;

    return `${formattedHours}h${formattedMins}`;
}

function calculateArrivalDateAndTime(departureDate, departureTime, durationInMinutes) {

    // Chia chuỗi ngày đi thành các thành phần ngày, tháng và năm
    const [day, month, year] = departureDate.split('/').map(Number);

    // Tách giờ và phút từ chuỗi giờ đi
    const [hours, minutes] = departureTime.split(':')?.map(Number);
    // const [, hours, minutes] = departureTime.match(/(\d+) giờ (\d+)/).map(Number);

    // Kiểm tra xem các thành phần đã chuyển đổi thành số hợp lệ chưa
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        console.log("Ngày hoặc giờ đi không hợp lệ");
        return;
    }

    // Tạo đối tượng Date từ các thành phần của ngày và giờ đi
    const departureDateTime = new Date(year, month - 1, day, hours, minutes);

    // Thêm số phút di chuyển vào ngày và giờ đi
    const arrivalDateTime = new Date(departureDateTime.getTime() + durationInMinutes * 60000);

    // Lấy ngày đến nơi
    const arrivalDate = `${arrivalDateTime.getDate()}/${arrivalDateTime.getMonth() + 1}/${arrivalDateTime.getFullYear()}`;

    // Lấy giờ đến nơi
    const arrivalTime = `${arrivalDateTime.getHours()}:${arrivalDateTime.getMinutes().toString().padStart(2, '0')}`;
    return { arrivalDate, arrivalTime };
}
const TabSeatSelection = (props) => {
    const { typeBus, paymentRequire, prebooking, routeId, ticketPrice, departureTime, tripId, departureDate, isAgent, handleOrderSuccess, busOwnerId } = props
    const user = useSelector((state) => state.user);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatCount, setSeatCount] = useState(0);
    const [totalPrice, setTotalPricet] = useState(0);
    const [isPaidAgent, setIsPaidAgent] = useState(false);
    const [message, setMessage] = useState('');
    const [codeDiscount, setCodeDiscount] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [isDiscounted, setIsDiscounted] = useState(false);


    const [listPickUpPoint, setListPickUpPoint] = useState([])
    const [listDropOffPoint, setListDropOffPoint] = useState([])
    const [pickUpPoint, setPickUpPoint] = useState();
    const [dropOffPoint, setDropOffPoint] = useState();
    const [notePickUp, setNotePickUp] = useState();
    const [noteDropOff, setNoteDropOff] = useState();

    const [listTicketSold, setListTicketSold] = useState([]);


    const { data, isSuccess, isError } = useQuery(
        {
            queryKey: [`seatsBooked${tripId}`],
            queryFn: () => getSeatsBookedByTrip(tripId),
        });

    useEffect(() => {
        if (isSuccess) {
            setListTicketSold(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])



    //Step
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep0 = () => {
        if (seatCount <= 0)
            if (isAgent) handleMessage('Vui lòng chọn ghế!')
            else errorMes('Vui lòng chọn ghế!')
        else setCurrentStep(currentStep + 1);
    };


    const nextStep1 = () => {
        if (pickUpPoint && dropOffPoint)
            setCurrentStep(currentStep + 1);
        else if (isAgent) handleMessage('Vui lòng chọn điểm đón trả!')
        else errorMes('Vui lòng chọn điểm đón trả!')
    };

    const prevStep1 = () => {
        const newPrice = totalPrice - parseInt((pickUpPoint?.extracost || 0) * seatCount) - parseInt((dropOffPoint?.extracost || 0) * seatCount)
        setPickUpPoint('')
        setDropOffPoint('')
        setTotalPricet(newPrice)
        setCurrentStep(currentStep - 1);
    };

    const nextStep2 = () => {
        if (!name || !email || !phone)
            if (isAgent) handleMessage('Vui lòng điển đầy đủ thông tin!')
            else errorMes('Vui lòng điển đầy đủ thông tin!')
        else setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };



    //Select Seat
    const handleDecrease = () => {
        if (seatCount > 1) {
            setTotalPricet(ticketPrice * (seatCount - 1))
            setSeatCount(seatCount - 1);
        }
    };

    const handleIncrease = () => {
        if (seatCount < 5) {
            setTotalPricet(parseInt(ticketPrice) * (seatCount + 1))
            setSeatCount(seatCount + 1);
        }
    };

    const { seatss: seats, seatss2: seats2, numCol, numFloor } = useMemo(() => initArraySeat(typeBus, listTicketSold), [typeBus, listTicketSold]);

    const handleSeatSelect = (seat) => {
        if (selectedSeats.find(item => item === seat.id)) {
            setSeatCount(selectedSeats.length - 1)
            setTotalPricet(ticketPrice * (selectedSeats.length - 1))
            setSelectedSeats(selectedSeats.filter(item => item != seat.id))
        } else {
            if (seatCount < 5) {
                setSeatCount(selectedSeats.length + 1)
                setTotalPricet(ticketPrice * (selectedSeats.length + 1))
                setSelectedSeats(preselectedSeats => [...preselectedSeats, seat.id])
            }
            else warningMes('Bạn đã chọn quá số lượng ghế quy định!')

        }
    };


    // Get List Stop Point
    const { data: dataStopPoint, refetch } = useQuery(
        {
            queryKey: [`listStopPoint${routeId}`],
            queryFn: () => getStopPointsByBusRoute(routeId),
        });

    useEffect(() => {
        setListPickUpPoint(dataStopPoint?.data?.listPickUpPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
        setListDropOffPoint(dataStopPoint?.data?.listDropOffPoint.sort((a, b) => a.timeFromStart - b.timeFromStart))
    }, [dataStopPoint])

    const onChangePickUpPoint = (e) => {
        let price = totalPrice
        const point = listPickUpPoint.find(item => item.id === e.target.value)
        if (pickUpPoint?.extracost) price = price - (pickUpPoint?.extracost)
        if (point?.extracost) price = price + (point?.extracost)

        setTotalPricet(price)
        setPickUpPoint(point)

    }
    const onChangeDropOffPoint = (e) => {
        let price = totalPrice
        const point = listDropOffPoint.find(item => item.id === e.target.value)
        if (dropOffPoint?.extracost) price = price - (dropOffPoint?.extracost)
        if (point?.extracost) price = price + (point?.extracost)

        setTotalPricet(price)
        setDropOffPoint(point)
    }


    //Information
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();

    useEffect(() => {
        setName(user?.name)
        setEmail(user?.email)
        setPhone(user?.phone)
    }, [user])


    //Discount
    const mutationCheckDiscount = useMutation(
        {
            mutationFn: (data) => {
                return checkDiscount(data)
            },
            onSuccess: (data) => {
                if (data?.data.discountType === 'percent') {
                    const discount = totalPrice * data?.data.discountValue / 100
                    setDiscountValue(discount)
                    setTotalPricet(totalPrice - discount)
                } else if (data?.data.discountType === 'fixed') {
                    setDiscountValue(data?.data.discountValue)
                    setTotalPricet(totalPrice - data?.data.discountValue)
                }
                setIsDiscounted(true)
            },
            onError: (data) => {
                errorMes(data?.response?.data?.message)
            }
        }
    )

    const handleApplyDiscount = () => {
        mutationCheckDiscount.mutate({ code: codeDiscount, busOwnerId: busOwnerId })
    }


    //Finish
    const handleMessage = (mes) => {
        setMessage(mes)
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }
    const mutation = useMutation(
        {
            mutationFn: (data) => {
                return createTicketOrder(data)
            },
            onSuccess: (data) => {
                if (isAgent) {
                    handleOrderSuccess()
                }
                else successMes('Đặt vé thành công')
            },
            onError: (data) => {
                if (isAgent) handleMessage(data?.response?.data?.message)
                errorMes(data?.response?.data?.message)
            }
        }
    )
    const handleFinish = (paymentMethod, isPaid, paidAt, transactionId) => {
        const { arrivalDate, arrivalTime } = calculateArrivalDateAndTime(departureDate, departureTime, pickUpPoint.timeFromStart)
        const { arrivalDate: endDate, arrivalTime: endTime } = calculateArrivalDateAndTime(departureDate, departureTime, dropOffPoint.timeFromStart)
        if ((paymentRequire && isAgent && isPaidAgent === false)) { handleMessage('Chuyến xe yêu cầu thanh toán trước!') }
        else {
            const data = {
                tripId,
                userOrder: user?.id,
                name,
                email,
                phone,
                departureTime,
                departureDate,

                pickUp: pickUpPoint.place,
                notePickUp,
                timePickUp: arrivalTime,
                datePickUp: arrivalDate,

                dropOff: dropOffPoint.place,
                noteDropOff,
                timeDropOff: endTime,
                dateDropOff: endDate,

                seats: selectedSeats,
                seatCount: seatCount,

                ticketPrice,
                extraCosts: ((pickUpPoint?.extracost || 0) + (dropOffPoint?.extracost || 0)),
                discount: discountValue,
                totalPrice,

                payee: isPaid || isPaidAgent ? user?.id : null,
                paymentMethod: isAgent,
                transactionId,
                paidAt,
                isPaid: isAgent ? isPaidAgent : isPaid,


            }
            mutation.mutate(data)
        }
    };



    return (
        <div style={{ marginTop: '20px' }}>
            <Steps current={currentStep}>
                <Step title="Chọn ghế" />
                <Step title="Điểm đón/trả" />
                <Step title="Thông tin" />
                <Step title="Thanh toán" />
            </Steps>
            <div style={{ marginTop: '20px' }}>
                {currentStep === 0 && (
                    <div>
                        {/* Phần hiển thị chọn vé */}
                        {prebooking ?
                            <div className="tab-seat">
                                <h1>Chọn Ghế</h1>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div>
                                        {numFloor === 2 && seats2.length > 0 && <div>Tầng 1</div>}
                                        <div style={{ gridTemplateColumns: `repeat(${numCol}, 1fr)` }} className="seat-layout">
                                            {seats?.map((seat, index) => (
                                                <SeatSelector
                                                    key={index}
                                                    seats={[seat]}
                                                    handleSeatSelect={handleSeatSelect}
                                                    isSelected={selectedSeats && selectedSeats.find(item => item === seat?.id)}
                                                />
                                            ))}

                                        </div>
                                    </div>
                                    {numFloor === 2 && seats2.length > 0 &&
                                        <div style={{ marginLeft: '40px', }}>
                                            <div>Tầng 2</div>
                                            <div style={{ gridTemplateColumns: `repeat(${numCol}, 1fr)` }} className="seat-layout">
                                                {seats2?.map((seat, index) => (
                                                    <SeatSelector
                                                        key={index}
                                                        seats={[seat]}
                                                        handleSeatSelect={handleSeatSelect}
                                                        isSelected={selectedSeats && selectedSeats.find(item => item === seat?.id)}
                                                    />
                                                ))}

                                            </div>
                                        </div>
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%', marginTop: '20px' }} >
                                        <div style={{ width: '10px', height: '10px', backgroundColor: '#f0f0f0' }}></div>
                                        <span>Đang trống</span>
                                        <div style={{ width: '10px', height: '10px', backgroundColor: '#999' }}></div>
                                        <span>Đã được đặt</span>
                                        <div style={{ width: '10px', height: '10px', backgroundColor: '#f00' }}></div>
                                        <span>Đang chọn</span>
                                    </div>
                                </div>
                            </div>
                            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                                <Result
                                    title="Chuyến xe không cho phép chọn vị trí ghế"
                                />
                                <div>
                                    <div>
                                        Chọn số lượng ghế
                                    </div>
                                    <Button size='small' shape="circle" onClick={handleDecrease}>-</Button>
                                    <InputNumber
                                        min={1}
                                        max={5}
                                        value={seatCount}
                                        readOnly
                                        style={{ width: 60, margin: '0px 5px' }}
                                    />
                                    <Button size='small' shape="circle" onClick={handleIncrease}>+</Button>
                                </div>

                            </div>
                        }
                        <Row style={{ borderTop: '1px solid #333', paddingTop: '20px' }} justify={'end'}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '30px' }}>
                                Tổng số tiền :
                                <span style={{ color: 'red', marginLeft: '10px' }}>{getVnCurrency(totalPrice)}</span>
                            </div>
                            <Button type="primary" onClick={nextStep0} >Tiếp tục</Button>
                        </Row>

                    </div>
                )}
                {currentStep === 1 && (
                    <div>
                        {/* Phần điền thông tin */}
                        <Row justify={'space-around'}>
                            <Col>
                                <h3>Chọn điểm đón</h3>
                                <div style={{ maxHeight: '200px', width: '250px', overflowY: 'auto' }}>
                                    <Radio.Group onChange={onChangePickUpPoint} value={pickUpPoint?.id} style={{ display: 'block' }}>
                                        {listPickUpPoint?.map((item) => (
                                            <Radio style={{ display: 'block', marginBottom: '10px' }} key={item.id} value={item.id}>
                                                {`${calculateTime(departureTime, item.timeFromStart)} - ${item.place}`}
                                                {item?.extracost && <span style={{ color: 'red', display: 'block', height: '0px', marginLeft: '20px' }}>{item?.extracost > 0 ? '+' : '-'}{getVnCurrency(item?.extracost)} /1 ghế</span>}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                                <TextArea
                                    placeholder="Ghi chú địa điểm đón ..."
                                    value={notePickUp}
                                    onChange={(e) => setNotePickUp(e.target.value)}
                                    rows={1}
                                />
                            </Col>
                            <Col>
                                <h3>Chọn điểm trả</h3>
                                <div style={{ maxHeight: '300px', width: '250px', overflowY: 'auto' }}>
                                    <Radio.Group onChange={onChangeDropOffPoint} value={dropOffPoint?.id} style={{ display: 'block' }}>
                                        {listDropOffPoint.map((item) => (
                                            <Radio style={{ display: 'block', marginBottom: '10px' }} key={item.id} value={item.id}>
                                                {`${calculateTime(departureTime, item.timeFromStart)} - ${item.place}`}
                                                {item?.extracost && <span style={{ color: 'red', display: 'block', height: '0px', marginLeft: '20px' }}>{item?.extracost > 0 ? '+' : '-'}{getVnCurrency(item?.extracost)} /1 ghế</span>}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>

                                <TextArea
                                    placeholder="Ghi chú địa điểm trả ..."
                                    value={noteDropOff}
                                    onChange={(e) => setNoteDropOff(e.target.value)}
                                    rows={1}
                                />
                            </Col>
                        </Row>

                        <Row style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }} justify={'space-between'}>
                            <Button style={{ marginRight: '10px' }} onClick={prevStep1}>
                                Quay lại
                            </Button>
                            <div style={{ display: 'flex' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '30px' }}>
                                    Tổng số tiền :
                                    <span style={{ color: 'red', marginLeft: '10px' }}>{getVnCurrency(totalPrice)}</span>
                                </div>
                                <Button type="primary" onClick={nextStep1}>
                                    Tiếp tục
                                </Button>
                            </div>
                        </Row>

                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <div className="ticket-info">
                            <Row justify={'center'}>
                                <h2>Thông tin vé</h2>
                            </Row>
                            <div style={{ width: '45%', marginBottom: '10px' }}>
                                <label>Tên:</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập tên"
                                />
                            </div>
                            <Row justify={'space-between'}>
                                <div style={{ width: '45%' }}>
                                    <label>Email:</label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email"
                                    />
                                </div>

                                <div style={{ width: '45%' }}>
                                    <label>Số điện thoại:</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </Row>

                            <div style={{ marginTop: '10px' }}>Số lượng vé: <span style={{ color: '#1710de' }}>{seatCount}</span></div>
                            {prebooking && <div style={{ marginTop: '10px' }}>Vị trí ghế:  <span style={{ color: '#de1074' }}>{selectedSeats?.map(seat => `${seat}, `)}</span></div>}
                            <Row style={{ marginTop: '10px' }}>
                                <Col style={{ fontSize: '16px' }}>
                                    Điểm đón:
                                </Col>
                                <Col style={{ marginLeft: '10px' }}>
                                    <span style={{ fontSize: '16px', color: 'black' }}>{` ${calculateTime(departureTime, pickUpPoint.timeFromStart)} - ${pickUpPoint.place}  `}</span>
                                    <div style={{ color: 'red' }}>{pickUpPoint.extracost ? `Phụ phí: ${getVnCurrency(pickUpPoint.extracost)} / người` : ''}</div>
                                    {notePickUp && <span style={{ color: '#105fde' }}>{`Ghi chú: ${notePickUp}`}</span>}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col style={{ fontSize: '16px' }}>
                                    Điểm trả:
                                </Col>
                                <Col style={{ marginLeft: '10px' }}>
                                    <span style={{ fontSize: '16px', color: 'black' }}>{` ${calculateTime(departureTime, dropOffPoint.timeFromStart)} - ${dropOffPoint.place}  `}</span>
                                    <div style={{ color: 'red' }}>{dropOffPoint.extracost ? `Phụ phí: ${getVnCurrency(dropOffPoint.extracost)} / người` : ''}</div>
                                    {noteDropOff && <span style={{ color: '#105fde' }}>{`Ghi chú: ${noteDropOff}`}</span>}
                                </Col>
                            </Row>

                        </div>
                        <Row style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }} justify={'space-between'}>
                            <Button style={{ marginRight: '10px' }} onClick={prevStep}>
                                Quay lại
                            </Button>
                            <div style={{ display: 'flex' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '30px' }}>
                                    Tổng số tiền :
                                    <span style={{ color: 'red', marginLeft: '10px' }}>{getVnCurrency(totalPrice)}</span>
                                </div>

                                <Button type="primary" onClick={nextStep2}>
                                    Tiếp tục
                                </Button>

                            </div>
                        </Row>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        {/* Phần thanh toán */}
                        <Row justify={'center'} align="middle" style={{ minHeight: '300px' }}>
                            {
                                !isAgent ?
                                    <div>
                                        <Paypal amount={totalPrice} handleFinish={handleFinish}></Paypal>
                                        {
                                            paymentRequire && <div style={{ color: 'red', fontSize: '18px' }}>Chuyến xe này yêu cầu thanh toán trước!</div>
                                        }
                                    </div>
                                    :
                                    <div>
                                        <Radio.Group >
                                            <Space direction="vertical"
                                                onChange={(e) => { setIsPaidAgent(e.target.value === 'true' ? true : false); }}
                                            >
                                                <Radio value={false}><h3>Chưa thanh toán</h3></Radio>
                                                <Radio value={true}><h3>Đã thanh toán</h3></Radio>
                                            </Space>
                                        </Radio.Group>
                                        {paymentRequire && <div style={{ color: 'red', fontSize: '18px' }}>Chuyến xe này yêu cầu thanh toán trước!</div>}
                                    </div>
                            }

                        </Row>
                        <Row justify={'end'}>
                            <span>Nhập mã giảm giá</span>
                            <Input
                                placeholder="Nhập mã giảm giá"
                                value={codeDiscount}
                                onChange={e => setCodeDiscount(e.target.value)}
                                style={{ width: '150px', marginLeft: '10px' }} />
                            <Button disabled={isDiscounted} style={{ marginLeft: '10px' }} onClick={handleApplyDiscount}>
                                Áp dụng
                            </Button>
                        </Row>
                        <Row style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }} justify={'space-between'}>
                            <Button style={{ marginRight: '10px' }} onClick={prevStep}>
                                Quay lại
                            </Button>

                            <div style={{ display: 'flex' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '30px' }}>
                                    Tổng số tiền :
                                    <span style={{ color: 'red', marginLeft: '10px' }}>{getVnCurrency(totalPrice)}</span>
                                </div>
                                {
                                    isAgent ?
                                        <Button type="primary" onClick={() => { handleFinish() }}>Đặt vé</Button>
                                        :
                                        (

                                            !paymentRequire && <Button type="primary" onClick={() => { handleFinish() }}>Đặt vé</Button>
                                        )
                                }
                            </div>
                        </Row>
                    </div>
                )}
            </div>
            <Row justify={'end'} style={{ color: 'red', marginTop: '5px', height: '1rem' }}>{message}</Row>
        </div>
    )
}

export default TabSeatSelection