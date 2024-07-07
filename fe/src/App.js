import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { axiosJWT, getDetailsUser, refreshToken } from './services/UserService';
import { resetUser, updateUser } from './redux/slides/userSlide';
import HomePage from './pages/HomePage/HomePage';
import SignInPage from './pages/SignInPage/SignInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';
import BusOwnerPage from './pages/BusOwnerPage/BusOwnerPage';
import DriverPage from './pages/DriverPage/DriverPage';
import TicketAgentPage from './pages/TicketAgentPage/TicketAgentPage';
import AdminHomeComponent from './components/Admin/AdminHomeComponent';
import AdminBusComponent from './components/Admin/AdminBusComponent';
import AdminUserComponent from './components/Admin/AdminUserComponent';
import AdminTicketComponent from './components/Admin/AdminTicketComponent';
import AdminDiscountComponent from './components/Admin/AdminDiscountComponent';
import AdminDriverComponent from './components/Admin/AdminDriverComponent';
import BusOwnerHome from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHome';
import DriverManagement from './components/BusOwnerComponent/DriverManagerment/DriverManagement';
import ScheduleManagerment from './components/BusOwnerComponent/ScheduleManagerment/ScheduleManagerment';
import RouteManagerment from './components/BusOwnerComponent/RouteManagerment/RouteManagerment';
import BusManagerment from './components/BusOwnerComponent/BusManagerment/BusManagerment';
import TripManagerment from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHomeTabs/TripManagerment/TripManagerment';
import TicketManagerment from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHomeTabs/TicketManagerment/TicketManagerment';
import GoodsManagerment from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHomeTabs/GoodManagerment/GoodsManagerment';
import BookedTicketsPage from './pages/BookedTicketsPage/BookedTicketsPage';
import TestPage from './pages/TestPage/TestPage';
import AcceptPartner from './components/Admin/AcceptPartner';
import AdminPartnerComponent from './components/Admin/AdminPartnerComponent';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage';
import PartnerRegistrationPage from './pages/PartnerRegistrationPage/PartnerRegistrationPage';
import ProfileComponent from './components/AcountComponent/ProfileComponent';
import ChangePasswordComponent from './components/AcountComponent/ChangePasswordComponent';
import RunningTripComponent from './components/DriverComponent/RunningTripComponent/RunningTripComponent';
import ListMyTripComponent from './components/DriverComponent/ListMyTripComponent/ListMyTripComponent';
import SaleTickets from './components/AgentComponent/TicketSales/SaleTickets';
import BookedTicketsComponent from './components/BookedTicketsComponent/BookedTicketsComponent';
import AdminSentMailComponent from './components/Admin/AdminSentMailComponent';
import AdminReportComponent from './components/Admin/AdminReportComponent';
import Statistic from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHomeTabs/Statistic/Statistic';
import FinancialManagement from './components/BusOwnerComponent/BusOwnerHome/BusOwnerHomeTabs/FinancialManagement/FinancialManagement';
import FinancialComponent from './components/AgentComponent/FinancialComponent/FinancialComponent';
import StatisticComponent from './components/DriverComponent/StatisticComponent/StatisticComponent';


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
  }, [])

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }

  const isJsonString = (data) => {
    try {
      JSON.parse(data)
    } catch (error) {
      return false
    }
    return true
  }

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    } else {
    }
    return { decoded, storageData }
  }

  axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwtDecode(refToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await refreshToken(refToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        window.location.href = '/sign-in'
        dispatch(resetUser())
        localStorage.clear()
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Router>
        <Routes>
          {/* {routes.map((route) => {
            const Page = route.page
            return (
              <Route key={route.path} path={route.path} element={
                <Page />
              } />
            )
          })} */}
          <Route path='/' element={<HomePage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />
          <Route path='/partner-registration' element={<PartnerRegistrationPage />} />
          <Route path='/booked-tickets' element={<BookedTicketsPage />} />

          <Route path='/admin' element={<AdminPage />} >
            <Route path='home' element={<AdminHomeComponent />} />
            <Route path='user' element={<AdminUserComponent />} />
            <Route path='driver' element={<AdminDriverComponent />} />
            <Route path='partner' element={<AdminPartnerComponent />} />
            <Route path='accept-partner' element={<AcceptPartner />} />
            <Route path='bus' element={<AdminBusComponent />} />
            <Route path='ticket' element={<AdminTicketComponent />} />
            <Route path='discount' element={<AdminDiscountComponent />} />
            <Route path='report' element={<AdminReportComponent />} />
            <Route path='sent-mail' element={<AdminSentMailComponent />} />
            <Route path='profile' element={<ProfileComponent />} />
            <Route path='change-password' element={<ChangePasswordComponent />} />
          </Route>

          <Route path='/bus-owner' element={<BusOwnerPage />}>
            <Route path='home' element={<BusOwnerHome />} >
              <Route path='statistical' element={<Statistic />} />
              <Route path='trip' element={<TripManagerment />} />
              <Route path='ticket' element={<TicketManagerment />} />
              <Route path='goods' element={<GoodsManagerment />} />
              <Route path='financial' element={<FinancialManagement />} />
              <Route path='profile' element={<ProfileComponent />} />
              <Route path='change-assword' element={<ChangePasswordComponent />} />
            </Route>

            <Route path='driver' element={<DriverManagement />} />
            <Route path='schedule' element={<ScheduleManagerment />} />
            <Route path='route' element={<RouteManagerment />} />
            <Route path='bus' element={<BusManagerment />} />
          </Route>

          <Route path='/driver' element={<DriverPage />} >
            <Route path='running-trip' element={<RunningTripComponent />} />
            <Route path='my-trip' element={<ListMyTripComponent />} />
            <Route path='statistical' element={<StatisticComponent />} />
            <Route path='profile' element={<ProfileComponent />} />
            <Route path='change-password' element={<ChangePasswordComponent />} />

          </Route>
          <Route path='/agent' element={<TicketAgentPage />} >
            <Route path='sale-tickets' element={<SaleTickets />} />
            <Route path='tickets-saled' element={<BookedTicketsComponent />} />
            <Route path='financial' element={<FinancialComponent />} />
          </Route>

          <Route path='/test' element={<TestPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
