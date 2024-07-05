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
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
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

    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: 'tongquanghuy25@gmail.com',
      subject: "Xác nhận Đơn Đặt Vé Xe",
      html: emailContent,

    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}


const sendEmailResetPassword = async (password) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

    let emailContent = `Kính gửi người dùng,

Chúng tôi đã đặt lại mật khẩu của bạn theo yêu cầu. Mật khẩu mới của bạn là:

${password}

Vui lòng thay đổi mật khẩu sau khi đăng nhập vì lý do bảo mật.
`

    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, // sender address
      to: 'tongquanghuy25@gmail.com',
      subject: "Cấp mật khẩu mới", // Subject line
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

const sendEmail = async (to, subject, content) => {
  try {
    console.log('dfsadfasd', to);

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
    console.log('dfsadfasd', to);
    await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, // sender address
      to: to,
      subject: subject, // Subject line
      html: content,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}
module.exports = {
  sendEmailCreateOrder,
  sendEmailResetPassword,
  sendEmail
}

let refusePartner = `
<p>Kính gửi ,</p>
<p>Chúng tôi xin cảm ơn bạn đã quan tâm và đăng ký trở thành đối tác của <strong>Tên Công ty</strong>.</p>
<p>Sau khi xem xét kỹ lưỡng hồ sơ đăng ký của bạn, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn đã không được chấp thuận trở thành đối tác (nhà xe/đại lý bán vé) của chúng tôi vào thời điểm này.</p>
<p>Quyết định này dựa trên các tiêu chí xét duyệt nghiêm ngặt của chúng tôi để đảm bảo rằng tất cả các đối tác của <strong>Tên Công ty</strong> đáp ứng đầy đủ các yêu cầu về chất lượng dịch vụ và uy tín. Chúng tôi rất tiếc vì điều này có thể gây ra sự thất vọng cho bạn.</p>
<p>Tuy nhiên, chúng tôi luôn đánh giá cao sự quan tâm và mong muốn hợp tác từ phía bạn. Chúng tôi khuyến khích bạn xem xét và cải thiện hồ sơ của mình theo các tiêu chí mà chúng tôi đề ra và rất mong sẽ nhận được đăng ký lại từ bạn trong tương lai.</p>
<p>Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin về quyết định này, xin vui lòng liên hệ với chúng tôi qua email <a href="mailto:support@example.com">support@example.com</a> hoặc số điện thoại (123) 456-7890.</p>
<p>Chân thành cảm ơn bạn đã dành thời gian và nỗ lực để đăng ký trở thành đối tác của chúng tôi. Chúng tôi hy vọng sẽ có cơ hội hợp tác cùng bạn trong tương lai.</p>
<p>Trân trọng,</p>
<p><strong>[Tên của Bạn]</strong><br>
Bộ phận Chăm sóc Đối tác<br>
<strong>[Tên Công ty/Nền tảng]</strong><br>
<a href="mailto:support@example.com">support@example.com</a><br>
(123) 456-7890</p>
`


