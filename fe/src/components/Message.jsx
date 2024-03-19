import { message } from "antd";

const success = (mes = 'Success') => {
    destroy();
    message.success(mes);
};

const error = (mes) => {
    destroy();
    message.error(mes ? mes : "Error")
};

const warning = (mes = 'Warning') => {
    message.warning(mes);
};

const loading = (mes = 'Loading') => {
    message.loading(mes);
};

const destroy = () => {
    message.destroy();
}


export { success, error, warning, loading, destroy }