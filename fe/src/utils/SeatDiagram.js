export const initArraySeat = (type, listTicketSold) => {

    switch (type) {
        case 'xe limousine 7':
            return limo7(listTicketSold)
        case 'xe limousine 9':
            return limo9(listTicketSold)
        case 'xe limousine 11':
            return limo11(listTicketSold)
        case 'xe limousine 16':
            return limo16(listTicketSold)
        case 'xe limousine 19':
            return limo19(listTicketSold)
        case 'xe khách 15':
            return khach15(listTicketSold)
        case 'xe khách 29':
            return khach29(listTicketSold)
        case 'xe khách 33':
            return khach33(listTicketSold)
        case 'xe khách 45':
            return khach45(listTicketSold)
        case 'xe giường nằm 22':
            return giuongnam22(listTicketSold)
        case 'xe giường nằm 34':
            return giuongnam34(listTicketSold)
        case 'xe giường nằm 40':
            return giuongnam40(listTicketSold)
        default:
            return { seatss: [], numCol: 0, numFloor: 0 }
    }

}

const limo7 = (listTicketSold) => {
    const seats = Array.from({ length: 7 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push(seats[0])
    seatss.push(seats[1])
    seatss.push({ isSpace: true })
    seatss.push(seats[2])
    seatss.push(seats[3])
    seatss.push({ isSpace: true })
    seatss.push(seats[4])
    seatss.push(seats[5])
    seatss.push({ isSpace: true })
    seatss.push(seats[6])
    return { seatss, numCol: 3, numFloor: 1 }
}

const limo9 = (listTicketSold) => {
    const seats = Array.from({ length: 9 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push(seats[0])
    seatss.push(seats[1])
    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push(seats[3])
    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])
    seatss.push(seats[6])
    seatss.push(seats[7])
    seatss.push(seats[8])
    return { seatss, numCol: 3, numFloor: 1 }
}

const limo11 = (listTicketSold) => {
    const seats = Array.from({ length: 11 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push(seats[0])
    seatss.push(seats[1])
    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push(seats[3])
    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])
    seatss.push(seats[6])
    seatss.push({ isSpace: true })
    seatss.push(seats[7])
    seatss.push(seats[8])
    seatss.push(seats[9])
    seatss.push(seats[10])
    return { seatss, numCol: 3, numFloor: 1 }
}

//4
const limo16 = (listTicketSold) => {
    const seats = Array.from({ length: 16 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push(seats[0])

    seatss.push(seats[1])
    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[3])
    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])

    seatss.push(seats[6])
    seatss.push(seats[7])
    seatss.push({ isSpace: true })
    seatss.push(seats[8])

    seatss.push(seats[9])
    seatss.push(seats[10])
    seatss.push({ isSpace: true })
    seatss.push(seats[11])

    seatss.push(seats[12])
    seatss.push(seats[13])
    seatss.push(seats[14])
    seatss.push(seats[15])

    return { seatss, numCol: 4, numFloor: 1 }
}

const limo19 = (listTicketSold) => {
    const seats = Array.from({ length: 19 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push(seats[0])

    seatss.push(seats[1])
    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[3])
    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])

    seatss.push(seats[6])
    seatss.push(seats[7])
    seatss.push({ isSpace: true })
    seatss.push(seats[8])

    seatss.push(seats[9])
    seatss.push(seats[10])
    seatss.push({ isSpace: true })
    seatss.push(seats[11])

    seatss.push(seats[12])
    seatss.push(seats[13])
    seatss.push({ isSpace: true })
    seatss.push(seats[14])

    seatss.push(seats[15])
    seatss.push(seats[16])
    seatss.push(seats[17])
    seatss.push(seats[18])

    return { seatss, numCol: 4, numFloor: 1 }
}

const khach15 = (listTicketSold) => {
    const seats = Array.from({ length: 15 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push(seats[0])
    seatss.push(seats[1])

    seatss.push(seats[2])
    seatss.push(seats[3])
    seatss.push(seats[4])
    seatss.push({ isDoor: true })

    seatss.push(seats[5])
    seatss.push(seats[6])
    seatss.push(seats[7])
    seatss.push({ isSpace: true })

    seatss.push(seats[8])
    seatss.push(seats[9])
    seatss.push(seats[10])
    seatss.push({ isSpace: true })

    seatss.push(seats[11])
    seatss.push(seats[12])
    seatss.push(seats[13])
    seatss.push(seats[14])

    return { seatss, numCol: 4, numFloor: 1 }
}

const khach29 = (listTicketSold) => {
    const seats = Array.from({ length: 29 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
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
    return { seatss, numCol: 5, numFloor: 1 }
}

const khach33 = (listTicketSold) => {
    const seats = Array.from({ length: 33 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[0])
    seatss.push(seats[1])
    seatss.push({ isSpace: true })
    seatss.push(seats[2])
    seatss.push(seats[3])

    seatss.push(seats[4])
    seatss.push(seats[5])
    seatss.push({ isSpace: true })
    seatss.push(seats[6])
    seatss.push(seats[7])

    seatss.push(seats[8])
    seatss.push(seats[9])
    seatss.push({ isSpace: true })
    seatss.push(seats[10])
    seatss.push(seats[11])

    seatss.push(seats[12])
    seatss.push(seats[13])
    seatss.push({ isSpace: true })
    seatss.push(seats[14])
    seatss.push(seats[15])

    seatss.push(seats[16])
    seatss.push(seats[17])
    seatss.push({ isSpace: true })
    seatss.push(seats[18])
    seatss.push(seats[19])

    seatss.push(seats[20])
    seatss.push(seats[21])
    seatss.push({ isSpace: true })
    seatss.push(seats[22])
    seatss.push(seats[23])

    seatss.push(seats[24])
    seatss.push(seats[25])
    seatss.push({ isSpace: true })
    seatss.push(seats[26])
    seatss.push(seats[27])

    seatss.push(seats[28])
    seatss.push(seats[29])
    seatss.push(seats[30])
    seatss.push(seats[31])
    seatss.push(seats[32])
    return { seatss, numCol: 5, numFloor: 1 }
}

const khach45 = (listTicketSold) => {
    const seats = Array.from({ length: 45 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[0])
    seatss.push(seats[1])
    seatss.push({ isSpace: true })
    seatss.push(seats[2])
    seatss.push(seats[3])

    seatss.push(seats[4])
    seatss.push(seats[5])
    seatss.push({ isSpace: true })
    seatss.push(seats[6])
    seatss.push(seats[7])

    seatss.push(seats[8])
    seatss.push(seats[9])
    seatss.push({ isSpace: true })
    seatss.push(seats[10])
    seatss.push(seats[11])

    seatss.push(seats[12])
    seatss.push(seats[13])
    seatss.push({ isSpace: true })
    seatss.push(seats[14])
    seatss.push(seats[15])

    seatss.push(seats[16])
    seatss.push(seats[17])
    seatss.push({ isSpace: true })
    seatss.push(seats[18])
    seatss.push(seats[19])

    seatss.push(seats[20])
    seatss.push(seats[21])
    seatss.push({ isSpace: true })
    seatss.push(seats[22])
    seatss.push(seats[23])

    seatss.push(seats[24])
    seatss.push(seats[25])
    seatss.push({ isSpace: true })
    seatss.push(seats[26])
    seatss.push(seats[27])

    seatss.push(seats[28])
    seatss.push(seats[29])
    seatss.push({ isSpace: true })
    seatss.push(seats[30])
    seatss.push(seats[31])

    seatss.push(seats[32])
    seatss.push(seats[33])
    seatss.push({ isSpace: true })
    seatss.push(seats[34])
    seatss.push(seats[35])

    seatss.push(seats[36])
    seatss.push(seats[37])
    seatss.push({ isSpace: true })
    seatss.push(seats[38])
    seatss.push(seats[39])

    seatss.push(seats[40])
    seatss.push(seats[41])
    seatss.push(seats[42])
    seatss.push(seats[43])
    seatss.push(seats[44])
    return { seatss, numCol: 5, numFloor: 1 }
}

const giuongnam22 = (listTicketSold) => {
    const seats = Array.from({ length: 10 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[0])
    seatss.push({ isSpace: true })
    seatss.push(seats[1])

    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push(seats[3])

    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])

    seatss.push(seats[6])
    seatss.push({ isSpace: true })
    seatss.push(seats[7])

    seatss.push(seats[8])
    seatss.push({ isSpace: true })
    seatss.push(seats[9])

    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })

    const seats2 = Array.from({ length: 12 }, (_, index) => ({
        id: `B${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `B${index + 1}`) ? true : false
    }));
    const seatss2 = []
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })

    seatss2.push(seats2[0])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[1])

    seatss2.push(seats2[2])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[3])

    seatss2.push(seats2[4])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[5])

    seatss2.push(seats2[6])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[7])

    seatss2.push(seats2[8])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[9])

    seatss2.push(seats2[10])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[11])

    return { seatss, seatss2, numCol: 3, numFloor: 2 }
}

const giuongnam34 = (listTicketSold) => {
    const seats = Array.from({ length: 17 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[0])
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push(seats[1])

    seatss.push(seats[2])
    seatss.push({ isSpace: true })
    seatss.push(seats[3])
    seatss.push({ isSpace: true })
    seatss.push(seats[4])

    seatss.push(seats[5])
    seatss.push({ isSpace: true })
    seatss.push(seats[6])
    seatss.push({ isSpace: true })
    seatss.push(seats[7])

    seatss.push(seats[8])
    seatss.push({ isSpace: true })
    seatss.push(seats[9])
    seatss.push({ isSpace: true })
    seatss.push(seats[10])

    seatss.push(seats[11])
    seatss.push({ isSpace: true })
    seatss.push(seats[12])
    seatss.push({ isSpace: true })
    seatss.push(seats[13])

    seatss.push(seats[14])
    seatss.push({ isSpace: true })
    seatss.push(seats[15])
    seatss.push({ isSpace: true })
    seatss.push(seats[16])

    const seats2 = Array.from({ length: 17 }, (_, index) => ({
        id: `B${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `B${index + 1}`) ? true : false
    }));
    const seatss2 = []
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })

    seatss2.push(seats2[0])
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[1])

    seatss2.push(seats2[2])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[3])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[4])

    seatss2.push(seats2[5])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[6])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[7])

    seatss2.push(seats2[8])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[9])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[10])

    seatss2.push(seats2[11])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[12])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[13])

    seatss2.push(seats2[14])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[15])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[16])

    return { seatss, seatss2, numCol: 5, numFloor: 2 }
}

const giuongnam40 = (listTicketSold) => {
    const seats = Array.from({ length: 20 }, (_, index) => ({
        id: `A${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `A${index + 1}`) ? true : false
    }));
    const seatss = []
    seatss.push({ isDriver: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isSpace: true })
    seatss.push({ isDoor: true })

    seatss.push(seats[0])
    seatss.push({ isSpace: true })
    seatss.push(seats[1])
    seatss.push({ isSpace: true })
    seatss.push(seats[2])

    seatss.push(seats[3])
    seatss.push({ isSpace: true })
    seatss.push(seats[4])
    seatss.push({ isSpace: true })
    seatss.push(seats[5])

    seatss.push(seats[6])
    seatss.push({ isSpace: true })
    seatss.push(seats[7])
    seatss.push({ isSpace: true })
    seatss.push(seats[8])

    seatss.push(seats[9])
    seatss.push({ isSpace: true })
    seatss.push(seats[10])
    seatss.push({ isSpace: true })
    seatss.push(seats[11])

    seatss.push(seats[12])
    seatss.push({ isSpace: true })
    seatss.push(seats[13])
    seatss.push({ isSpace: true })
    seatss.push(seats[14])

    seatss.push(seats[15])
    seatss.push(seats[16])
    seatss.push(seats[17])
    seatss.push(seats[18])
    seatss.push(seats[19])

    const seats2 = Array.from({ length: 20 }, (_, index) => ({
        id: `B${index + 1}`,
        isOccupied: listTicketSold?.find(item => item === `B${index + 1}`) ? true : false
    }));
    const seatss2 = []
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })
    seatss2.push({ isSpace: true })

    seatss2.push(seats2[0])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[2])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[1])

    seatss2.push(seats2[3])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[4])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[5])

    seatss2.push(seats2[6])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[7])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[8])

    seatss2.push(seats2[9])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[10])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[11])

    seatss2.push(seats2[12])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[13])
    seatss2.push({ isSpace: true })
    seatss2.push(seats2[14])

    seatss2.push(seats2[15])
    seatss2.push(seats2[16])
    seatss2.push(seats2[17])
    seatss2.push(seats2[18])
    seatss2.push(seats2[19])

    return { seatss, seatss2, numCol: 5, numFloor: 2 }
}