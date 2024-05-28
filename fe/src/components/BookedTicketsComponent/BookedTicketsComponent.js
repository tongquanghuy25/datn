import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketById, getTicketsByUser } from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Divider, Form, Input, Rate, Row, Tag } from 'antd';
import { errorMes, successMes, warningMes } from '../../components/Message/Message';
import BookedTicketsCard from '../../components/BookedTicketsComponent/BookedTicketsCard';

const BookedTicketsComponent = () => {
    const user = useSelector((state) => state.user)
    const [listTicket, setListTicket] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [ticketId, setTicketId] = useState('')
    const [phone, setPhone] = useState('')
    const queryClient = useQueryClient();


    const { data, isSuccess, isError, refetch } = useQuery(
        {
            queryKey: ['tickets'],
            queryFn: () => { return getTicketsByUser(user?.access_token, user?.id) },
        });

    useEffect(() => {
        if (isSuccess) {
            console.log('getdataa');
            setListTicket(data?.data)
        } else if (isError) {
            console.log('err', data);
        }
    }, [isSuccess, isError, data])

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await getTicketById(data);
        },
        onSuccess: (data) => {
            setListTicket(data?.data)
        },
        onError: (data) => {
            errorMes(data?.response?.data?.message)
        }
    });


    const handleSearch = () => {
        mutation.mutate({ ticketId, phone })
        setIsSearch(true)
    }
    const handleCancelSearch = () => {
        const list = queryClient.getQueryData(['tickets'])?.data
        if (list?.length > 0) setListTicket(queryClient.getQueryData(['tickets'])?.data)
        else refetch()
        setTicketId('')
        setPhone('')
        setIsSearch(false)
    }
    return (
        <div>
            <Row style={{ marginTop: '20px' }} justify={'center'}>
                <Input
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder='Nhập id vé'
                    value={ticketId}
                    onChange={e => setTicketId(e.target.value)}
                />
                <Input
                    style={{ width: '200px', marginRight: '20px' }}
                    placeholder='Nhập số điện thoại'
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                {
                    !isSearch ? <Button type='primary' onClick={handleSearch}>Tìm kiếm</Button>
                        : <Button type='primary' danger onClick={handleCancelSearch}>Xóa tìm kiếm</Button>
                }
            </Row>
            {
                listTicket?.length > 0 && <>
                    <Row justify={'center'}>
                        {!isSearch ? <h2>Danh sách vé đã đặt</h2>
                            : <h2>Thông tin vé</h2>
                        }

                    </Row>
                    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                        {listTicket?.map(ticket => {
                            return <BookedTicketsCard ticket={ticket} refetch={refetch} />
                        })}
                    </div>
                </>

            }
        </div>
    )
}

export default BookedTicketsComponent