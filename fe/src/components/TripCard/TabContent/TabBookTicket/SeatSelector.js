import React, { useState } from 'react'
import './style.css'

const SeatSelector = ({ seats, handleSeatSelect, isSelected }) => {


    const renderItems = (seat) => {
        if (seat?.isDriver) return <div className='driver'>Tài xế</div>
        else if (seat?.isDoor) return <div className='driver'>Cửa vào</div>
        else if (seat?.isSpace) return <div className='driver'></div>
        else return (
            <button
                key={seat?.id}
                className={`seat ${seat?.isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSeatSelect(seat)}
                disabled={seat.isOccupied}
            >
                {seat.id}
            </button>
        )

    }
    return (
        <div className="seat-selector">
            {seats.map((seat) => seat ? renderItems(seat) : <></>)}
        </div>
    )
}

export default SeatSelector