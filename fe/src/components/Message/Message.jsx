import { message } from "antd";

const successMes = (mes) => {
    destroyMes();
    message.success(mes ? mes : 'Success');
};

const errorMes = (mes) => {
    destroyMes();
    message.error(mes ? mes : "Error")
};

const warningMes = (mes = 'Warning') => {
    message.warning(mes);
};

const loadingMes = (mes = 'Loading') => {
    message.loading({
        content: mes,
        duration: 10,
    });
};

const destroyMes = () => {
    message.destroy();
}


export { successMes, errorMes, warningMes, loadingMes, destroyMes }