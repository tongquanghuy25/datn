export const getVnCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

//hh:mm:ss => hh giờ mm
export const formatTimeVn = (timeString) => {
    var timeParts = timeString?.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    return `${hours} giờ ${minutes < 10 ? `0${minutes}` : minutes}`
}

//hh:mm:ss => hh h mm
export const formatTime = (time) => {
    // Chuyển thời gian bắt đầu thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = time?.split(':').map(Number);
    return `${startHours}h${startMinutes < 10 ? `0${startMinutes}` : startMinutes}`;
}

// => hh:mm:ss
export const calculateArrivalTime = (startTime, duration) => {
    // Chuyển giờ xuất phát và thời gian di chuyển thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = startTime?.split(':').map(Number);
    let [durationHours, durationMinutes, durationSeconds] = duration?.split(':').map(Number);

    // Tạo đối tượng Date với giờ xuất phát
    let startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(startSeconds);

    // Thêm thời gian di chuyển vào giờ xuất phát
    startDate.setHours(startDate.getHours() + durationHours);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    startDate.setSeconds(startDate.getSeconds() + durationSeconds);

    // Lấy thời gian kết thúc
    let endHours = String(startDate.getHours()).padStart(2, '0');
    let endMinutes = String(startDate.getMinutes()).padStart(2, '0');
    let endSeconds = String(startDate.getSeconds()).padStart(2, '0');

    return `${endHours}:${endMinutes}:${endSeconds}`;
}

// => hh h mm
export const calculateEndTime = (startTime, durationMinutes) => {
    // Chuyển thời gian bắt đầu thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = startTime?.split(':').map(Number);

    // Tạo đối tượng Date với thời gian bắt đầu
    let startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(startSeconds);

    // Thêm số phút di chuyển vào thời gian bắt đầu
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);

    // Lấy giờ và phút từ đối tượng Date
    let endHours = String(startDate.getHours()).padStart(2, '0');
    let endMinutes = String(startDate.getMinutes()).padStart(2, '0');

    return `${endHours}h${endMinutes}`;
}

//(date, time , number minute => arrivalDate, time)
export const calculateArrivalDateAndTime = (departureDate, departureTime, durationMinutes) => {
    // Chuyển đổi departureDate và departureTime thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = departureTime?.split(':').map(Number);

    // Tạo đối tượng Date với departureDate và departureTime
    let startDate = new Date(departureDate);
    startDate.setUTCHours(startHours);
    startDate.setUTCMinutes(startMinutes);
    startDate.setUTCSeconds(startSeconds);

    // Thêm số phút di chuyển vào thời gian bắt đầu
    startDate.setUTCMinutes(startDate.getUTCMinutes() + durationMinutes);

    // Lấy ngày và thời gian đến từ đối tượng Date
    let arrivalDate = startDate.toISOString()?.split('T')[0];
    let arrivalTime = startDate.toISOString()?.split('T')[1].split(':');
    let formattedArrivalTime = `${arrivalTime[0]}:${arrivalTime[1]}`;

    return { arrivalDate, arrivalTime: formattedArrivalTime };
}

export const isCancellationAllowed = (startDateTime, startTime, cancelHours) => {
    // Chuyển đổi chuỗi ngày giờ xuất phát thành đối tượng Date
    const startDateTimeObj = new Date(startDateTime);

    // Chuyển đổi chuỗi giờ xuất phát thành số giờ, phút và giây
    const [hours, minutes, seconds] = startTime.split(':').map(Number);

    // Thiết lập giờ, phút và giây cho đối tượng Date
    startDateTimeObj.setHours(hours, minutes, seconds, 0);

    // Tính toán thời gian cho phép hủy vé
    const cancelWindowStart = new Date(startDateTimeObj.getTime() - cancelHours * 60 * 60 * 1000);

    // Lấy thời gian hiện tại
    const now = new Date();

    // Kiểm tra nếu thời gian hiện tại nằm trong khoảng cho phép hủy vé
    return now < cancelWindowStart;
}

// export const checkTimeDepartured = (startDateTime, startTime) => {
//     // Chuyển đổi chuỗi ngày giờ xuất phát thành đối tượng Date
//     const startDateTimeObj = new Date(startDateTime);

//     // Chuyển đổi chuỗi giờ xuất phát thành số giờ, phút và giây
//     const [hours, minutes, seconds] = startTime.split(':').map(Number);

//     // Thiết lập giờ, phút và giây cho đối tượng Date
//     startDateTimeObj.setHours(hours, minutes, seconds, 0);


//     // Lấy thời gian hiện tại
//     const now = new Date();

//     // Kiểm tra nếu thời gian hiện tại nằm trong khoảng cho phép hủy vé
//     return now > startDateTimeObj;
// }


