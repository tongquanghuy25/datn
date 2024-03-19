import React from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FooterComponent from '../../components/FooterComponent/FooterComponent'

const HomePage = () => {
    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div style={{ backgroundColor: 'red', height: '200vh' }}>
            </div>
            <FooterComponent></FooterComponent>
        </div>
    )
}

export default HomePage