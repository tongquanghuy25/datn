import { Button, Col, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import AddRouteComponent from './AddRouteComponent';
import InforRouteComponent from './InforRouteComponent';
import { useQuery } from '@tanstack/react-query';
import { getRouteByBusOwner } from '../../../services/RouteService';
import { useSelector } from 'react-redux';


const RouteManagerment = () => {
  const user = useSelector((state) => state.user)
  const [isCreateRoute, setIsCreateRoute] = useState(false)
  const [listRoute, setListRoute] = useState([]);
  const [routeSelected, setRouteSelected] = useState();

  const { data, isSuccess, isError, refetch } = useQuery(
    {
      queryKey: ['routes'],
      queryFn: () => getRouteByBusOwner(JSON.parse(localStorage.getItem('bus_owner_id')), user?.access_token),
    });

  useEffect(() => {
    if (isSuccess) {
      setListRoute(data?.data)
      setRouteSelected(data?.data[0])
    } else if (isError) {
      console.log('err', data);
    }
  }, [isSuccess, isError, data])

  const closeCreateRoute = () => {
    setIsCreateRoute(false)
  }

  return (
    <div style={{ marginTop: '20px', padding: '0 20px' }}>
      <Row justify="space-around">
        <Col span={7} >
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Danh sách tuyến đường</div>

          <div style={{ height: 'calc(92vh - 110px)', border: '1px solid #555', overflowY: 'auto' }}>
            {listRoute.map((route) =>
              <div
                onClick={() => {
                  setIsCreateRoute(false)
                  setRouteSelected(route)
                }}
                style={{ cursor: 'pointer', fontSize: '20px', color: routeSelected.id === route.id ? '#000000' : '#6d4c41', backgroundColor: routeSelected.id === route.id ? '#fbc02d' : '#fff9c4', margin: '10px 10px', padding: '5px', borderRadius: '10px' }}>
                <div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>{route?.districtStart} - {route?.provinceStart} ({route?.placeStart})</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowRightOutlined style={{ marginRight: '10px' }} /> <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>{route.districtEnd} - {route.provinceEnd} ({route?.placeEnd})</div>
                </div>
              </div>
            )}
            {/* {listRoute.map((route) =>
              <div
                onClick={() => {
                  setIsCreateRoute(false)
                  setRouteSelected(route)
                }}
                style={{ cursor: 'pointer', fontSize: '20px', color: ' #333', backgroundColor: routeSelected.id === route.id ? '#c6e7f5' : '#f0f0f0', margin: '10px 10px', padding: '5px', borderRadius: '10px' }}>
                <div>
                  <strong>{route?.districtStart} - {route?.provinceStart} ({route?.placeStart}) </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowRightOutlined style={{ marginRight: '10px' }} /> <strong>{route.districtEnd} - {route.provinceEnd} ({route?.placeEnd})</strong>
                </div>
              </div>
            )}
            {listRoute.map((route) =>
              <div
                onClick={() => {
                  setIsCreateRoute(false)
                  setRouteSelected(route)
                }}
                style={{ cursor: 'pointer', fontSize: '20px', color: ' #333', backgroundColor: routeSelected.id === route.id ? '#c6e7f5' : '#f0f0f0', margin: '10px 10px', padding: '5px', borderRadius: '10px' }}>
                <div>
                  <strong>{route?.districtStart} - {route?.provinceStart} ({route?.placeStart}) </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowRightOutlined style={{ marginRight: '10px' }} /> <strong>{route.districtEnd} - {route.provinceEnd} ({route?.placeEnd})</strong>
                </div>
              </div>
            )} */}

          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setIsCreateRoute(true)
              setRouteSelected('')
            }}
              type="primary" icon={<PlusOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginTop: '20px' }}>
              Thêm tuyến đường
            </Button>
          </div>

        </Col>
        <Col span={16} style={{ border: '1px solid #dddddd', backgroundColor: '#eaebe1' }}>
          {isCreateRoute ?
            <AddRouteComponent refetch={refetch} closeCreateRoute={closeCreateRoute}></AddRouteComponent> :
            <InforRouteComponent route={routeSelected} refetchListRoute={refetch}></InforRouteComponent>}
        </Col>
      </Row>
    </div>
  )
}

export default RouteManagerment