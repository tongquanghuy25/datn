export const getVnCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export const convertTimeToHourMinute = (timeString) => {
    var timeParts = timeString.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    return `${hours} giờ ${minutes < 10 ? `0${minutes}` : minutes}`
}

export const calculateArrivalTime = (startTime, duration) => {
    // Chuyển giờ xuất phát và thời gian di chuyển thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
    let [durationHours, durationMinutes, durationSeconds] = duration.split(':').map(Number);

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

export const calculateEndTime = (startTime, durationMinutes) => {
    // Chuyển thời gian bắt đầu thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);

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

    return `${endHours} h ${endMinutes}`;
}

export const calculateArrivalDateAndTime = (departureDate, departureTime, durationMinutes) => {
    // Chuyển đổi departureDate và departureTime thành đối tượng Date
    let [startHours, startMinutes, startSeconds] = departureTime.split(':').map(Number);

    // Tạo đối tượng Date với departureDate và departureTime
    let startDate = new Date(departureDate);
    startDate.setUTCHours(startHours);
    startDate.setUTCMinutes(startMinutes);
    startDate.setUTCSeconds(startSeconds);

    // Thêm số phút di chuyển vào thời gian bắt đầu
    startDate.setUTCMinutes(startDate.getUTCMinutes() + durationMinutes);

    // Lấy ngày và thời gian đến từ đối tượng Date
    let arrivalDate = startDate.toISOString().split('T')[0];
    let arrivalTime = startDate.toISOString().split('T')[1].split(':');
    let formattedArrivalTime = `${arrivalTime[0]}:${arrivalTime[1]}`;

    return { arrivalDate, arrivalTime: formattedArrivalTime };
}