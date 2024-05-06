const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');
const { generateQRCode } = require('./QrCodeService');

const sendEmailCreateOrder = async (orderDetails) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

    // let listItem = '';
    // const attachImage = []
    // orderItems.forEach((order) => {
    //   listItem += `<div>
    //   <div>
    //     Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
    //     <div>Bên dưới là hình ảnh của sản phẩm</div>
    //   </div>`
    //   attachImage.push({ path: order.image })
    // })

    const qrCodeImage = await generateQRCode(orderDetails);

    let emailContent = `
    <style>
  /* CSS cho hình ảnh */
  img {
    display: block;
    margin: 0 auto; /* Canh giữa hình ảnh */
    max-width: 100%; /* Đảm bảo hình ảnh không vượt quá chiều rộng của email */
    height: auto; /* Chiều cao tự động tính theo tỷ lệ chiều rộng */
    border-radius: 8px; /* Bo góc cho hình ảnh */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng đổ */
  }
</style>

  <div>
    <b>Chào bạn,</b>
    <p>Chúng tôi xin thông báo rằng đơn đặt vé xe của bạn đã được xác nhận thành công. Dưới đây là các chi tiết của chuyến đi:</p>
    
    <p><b>Thông tin về Chuyến Xe:</b></p>
    <ul>
      <li><b>Nhà Xe:</b> ${orderDetails.busOwnerName}</li>
      <li><b>Tuyến Đường:</b> ${orderDetails.routeName}</li>
      <li><b>Giờ khời hành:</b> ${orderDetails.departureTime}</li>
      <li><b>Ngày Khởi Hành:</b> ${orderDetails.departureDate}</li>
      <li><b>Điểm Đón:</b> ${orderDetails.timePickUp} - ${orderDetails.pickUp}</li>
      <li><b>Ngày:</b> ${orderDetails.datePickUp}</li>
      <li><b>Ghi Chú:</b> ${orderDetails.notePickUp ? orderDetails.notePickUp : ''}</li>
      <li><b>Điểm Trả:</b> ${orderDetails.timeDropOff} - ${orderDetails.dropOff}</li>
      <li><b>Ngày:</b> ${orderDetails.dateDropOff}</li>
      <li><b>Ghi Chú:</b> ${orderDetails.noteDropOff ? orderDetails.noteDropOff : ''}</li>
    </ul>

    <p><b>Chi Tiết Đặt Vé:</b></p>
    <ul>
      <li><b>Số Ghế:</b> ${orderDetails.seatCount}</li>
      <li><b>Vị Trí Ghế:</b> ${JSON.stringify(orderDetails.seats)}</li>
      <li><b>Giá Vé:</b> ${orderDetails.ticketPrice} VNĐ</li>
      <li><b>Phụ Thu:</b> ${orderDetails.extraCosts ? orderDetails.extraCosts : 0} VNĐ</li>
      <li><b>Giảm Giá:</b> ${orderDetails.discount ? orderDetails.discount : 0} VNĐ</li>
      <li><b>Tổng Cộng:</b> ${orderDetails.totalPrice} VNĐ</li>
    </ul>

    <p><b>Thông Tin Thanh Toán:</b></p>
    <ul>
      <li><b>Email:</b> ${orderDetails.email}</li>
      <li><b>Số Điện Thoại:</b> ${orderDetails.phone}</li>
      <li><b>Phương Thức Thanh Toán:</b> ${orderDetails.paymentMethod}</li>
      <li><b>Trạng Thái Thanh Toán:</b> ${orderDetails.isPaid ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</li>
    </ul>

    <p><b>QR code của vé:</b></p>
    <img src="${qrCodeImage}" alt="QR code thong tin ve">
    
    <p>Chúng tôi rất mong bạn sẽ có một chuyến đi an toàn và thú vị. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi theo thông tin dưới đây.</p>

    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ của chúng tôi</p>
    <p>Số điện thoại 0123456789</p>
  </div>
`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, // sender address
      to: 'tongquanghuy25@gmail.com', // list of receivers
      subject: "Xác nhận Đơn Đặt Vé Xe", // Subject line
      // text: "Hello world?", // plain text body
      html: emailContent,
      // attachments: attachImage,

    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

module.exports = {
  sendEmailCreateOrder
}