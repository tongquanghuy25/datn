const QRCode = require('qrcode');

const generateQRCode = async (orderDetails) => {
    try {
        // Tạo nội dung mã QR từ các thông tin về chuyến xe và chi tiết đặt vé
        const qrContent = `
      Thông tin về Chuyến Xe:
      Nhà Xe: ${orderDetails.busOwnerName}
      Tuyến Đường: ${orderDetails.routeName}
      Giờ xuất phát: ${orderDetails.departureTime}
      Ngày Khởi Hành: ${orderDetails.departureDate}
      Điểm Đón: ${orderDetails.timePickUp} - ${orderDetails.pickUp}
      Ngày: ${orderDetails.datePickUp}
      Ghi Chú: ${orderDetails.notePickUp ? orderDetails.notePickUp : ''}
      Điểm Trả: ${orderDetails.timeDropOff} - ${orderDetails.dropOff}
      Ngày: ${orderDetails.dateDropOff}
      Ghi Chú: ${orderDetails.noteDropOff ? orderDetails.noteDropOff : ''}

      Chi Tiết Đặt Vé:
      Số Ghế: ${orderDetails.seatCount}
      Vị Trí Ghế: ${JSON.stringify(orderDetails.seats)}
      Giá Vé: ${orderDetails.ticketPrice} VNĐ 
      Phụ Thu: ${orderDetails.extraCosts ? orderDetails.extraCosts : 0} VNĐ
      Giảm Giá: ${orderDetails.discount ? orderDetails.discount : 0} VNĐ
      Tổng Cộng: ${orderDetails.totalPrice} VNĐ

      Trạng Thái Thanh Toán: ${orderDetails.isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
      Phương Thức Thanh Toán: ${orderDetails.paymentMethod}

    //   Thông Tin Thanh Toán:
    //   Phương Thức Thanh Toán: ${orderDetails.paymentMethod}
    //   Thanh Toán Tại: ${orderDetails.paidAt}
    //   Trạng Thái Thanh Toán: ${orderDetails.isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán"}

    //   Thông Tin Người Thanh Toán:
    //   Tên: ${orderDetails.payer.name}
    //   Email: ${orderDetails.payer.email}
    //   Số Điện Thoại: ${orderDetails.payer.phone}
    `;

        // Tạo mã QR code từ nội dung đã tạo
        const qrCodeImage = await QRCode.toDataURL(qrContent);
        console.log('qrCodeImage', qrCodeImage);
        return qrCodeImage;
    } catch (error) {
        console.error("Error generating QR code:", error.message);
        throw error;
    }
};

module.exports = {
    generateQRCode
}