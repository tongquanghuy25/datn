import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { axiosJWT, getDetailsUser, refreshToken } from './services/UserService';
import { resetUser, updateUser } from './redux/slides/userSlide';

function App() {
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    // setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    // setIsLoading(false)
  }, [])

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
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  }
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* <Loading isLoading={isLoading}> */}
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            // const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                // <Layout>
                <Page />
                // </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
      {/* </Loading> */}
    </div>
  );
}

export default App;
