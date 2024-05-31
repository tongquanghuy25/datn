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
      <Row justify="space-around" style={{ height: '85vh' }}>
        <Col span={7} style={{ maxHeight: '100%' }}>
          <div style={{ fontSize: '16px', fontWeight: '450', marginBottom: '5px' }}>Danh sách tuyến đường</div>

          <div style={{ border: '1px solid #555', overflowY: 'auto', maxHeight: '88%' }}>
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
            )}

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
        <Col span={16} style={{ height: '100%', overflowY: 'auto', border: '1px solid #dddddd', backgroundColor: '#eaebe1' }}>
          {isCreateRoute ? <AddRouteComponent refetch={refetch} closeCreateRoute={closeCreateRoute}></AddRouteComponent> : <InforRouteComponent route={routeSelected} refetchListRoute={refetch}></InforRouteComponent>}

        </Col>
      </Row>
    </div>
  )
}

export default RouteManagerment