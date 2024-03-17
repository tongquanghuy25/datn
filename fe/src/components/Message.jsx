import { message } from "antd";

const success = (mes = 'Success') => {
    message.success(mes);
};

const error = (mes) => {
    message.error(mes ? mes : "Error")
};

const warning = (mes = 'Warning') => {
    message.warning(mes);
};

export { success, error, warning }