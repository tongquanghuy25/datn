export const getListSeat = (type, listTicketSold, numberSeat) => {
    switch (type) {
        case 'xe limousine 7':
            return getListSeat1Floor(7, listTicketSold)
        case 'xe limousine 9':
            return getListSeat1Floor(9, listTicketSold)
        case 'xe limousine 11':
            return getListSeat1Floor(11, listTicketSold)
        case 'xe limousine 16':
            return getListSeat1Floor(16, listTicketSold)
        case 'xe limousine 19':
            return getListSeat1Floor(19, listTicketSold)
        case 'xe khách 15':
            return getListSeat1Floor(15, listTicketSold)
        case 'xe khách 29':
            return getListSeat1Floor(19, listTicketSold)
        case 'xe khách 33':
            return getListSeat1Floor(33, listTicketSold)
        case 'xe khách 45':
            return getListSeat1Floor(45, listTicketSold)
        case 'xe giường nằm 22':
            return getListSeat2Floor(10, 12, listTicketSold)
        case 'xe giường nằm 34':
            return getListSeat2Floor(17, 17, listTicketSold)
        case 'xe giường nằm 40':
            return getListSeat2Floor(20, 20, listTicketSold)
        default:

    }

}

const getListSeat1Floor = (numberSeat, listTicketSold) => {
    const seats = Array.from({ length: numberSeat }, (_, index) => ({
        id: `A${index + 1}`,
        data: listTicketSold?.find(item => {
            const result = item.seats?.find(it => it === `A${index + 1}`)

            return result
        })
    }));
    return seats
}


const getListSeat2Floor = (numberSeat1, numberSeat2, listTicketSold) => {
    const seats1 = Array.from({ length: numberSeat1 }, (_, index) => ({
        id: `A${index + 1}`,
        data: listTicketSold?.find(item => {
            const result = item.seats?.find(it => it === `A${index + 1}`)
            return result

            // if (!result) return item
            // else return null
        })
    }));

    const seats2 = Array.from({ length: numberSeat2 }, (_, index) => ({
        id: `B${index + 1}`,
        data: listTicketSold?.find(item => {
            const result = item.seats?.find(it => it === `B${index + 1}`)
            return result

            // if (!result) return item
            // else return null
        })
    }));
    const result = [...seats1, ...seats2]
    return result
}

