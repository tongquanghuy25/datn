import SeatSelector from './SeatSelector';
import './style.css'
import React, { useMemo, useState } from 'react'

const TabSeatSelection = () => {
    const [selectedSeat, setSelectedSeat] = useState(null);

    const initArraySeat = () => {
        const seats = Array.from({ length: 29 }, (_, index) => ({
            id: index + 1,
            isOccupied: index === 2 || index === 15 || index === 27, // Mock occupied seats
        }));
        const seatss = []
        seatss.push({ isDriver: true })
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push(seats[0])
        seatss.push(seats[1])
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push(seats[2])
        seatss.push(seats[3])
        seatss.push(seats[4])
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push({ isDoor: true })
        seatss.push(seats[5])
        seatss.push(seats[6])
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })
        seatss.push({ isSpace: true })

        seatss.push(seats[7])
        seatss.push(seats[8])
        seatss.push({ isSpace: true })
        seatss.push(seats[9])
        seatss.push(seats[10])

        seatss.push(seats[11])
        seatss.push(seats[12])
        seatss.push({ isSpace: true })
        seatss.push(seats[13])
        seatss.push(seats[14])

        seatss.push(seats[15])
        seatss.push(seats[16])
        seatss.push({ isSpace: true })
        seatss.push(seats[17])
        seatss.push(seats[18])

        seatss.push(seats[19])
        seatss.push(seats[20])
        seatss.push({ isSpace: true })
        seatss.push(seats[21])
        seatss.push(seats[22])

        seatss.push(seats[23])
        seatss.push(seats[24])
        seatss.push(seats[25])
        seatss.push(seats[26])
        seatss.push(seats[27])
        return seatss
    }
    const seats = useMemo(() => initArraySeat(), []);

    const handleSeatSelection = (seat) => {
        setSelectedSeat(seat);
    };
    return (
        <div className="tab-seat">
            <h1>Chọn Ghế</h1>
            <div className="seat-layout">

                {seats.map((seat, index) => (
                    <SeatSelector
                        key={index}
                        seats={[seat]}
                        onSelectSeat={handleSeatSelection}
                        isSelected={selectedSeat && selectedSeat?.id === seat?.id}
                    />
                ))}

            </div>
        </div>
    )
}

export default TabSeatSelection