import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const style = { "layout": "vertical" };


const ButtonWrapper = ({ showSpinner, amount, handleFinish }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    amount = amount?.toString()

    return (
        amount && <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                createOrder={(data, actions) => {
                    console.log('actions', actions);
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(async (res) => {
                        console.log('ressss', res);
                        if (res.status === "COMPLETED") handleFinish('paypal', true, res.update_time, res.id)

                    });
                }}
            />
        </>
    );
}

const getExchangeRate = async () => {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        return parseInt(data.rates.VND);
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        return 25000;
    }
}

export default function Paypal({ amount, handleFinish }) {
    const [convertedAmount, setConvertedAmount] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const exchangeRate = await getExchangeRate();
            console.log('exchangeRate', exchangeRate);
            const convertedAmount = parseFloat((amount / exchangeRate)?.toFixed(2));
            setConvertedAmount(convertedAmount);
        };

        fetchData();
    }, [amount]);

    return (
        <div style={{ maxWidth: "350px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "AWVxc3TU97rliYKxzs6BEGVorN2O4yV199eB_fOoCxxqFydtJSssQ36syhk2xS6DbGN6CuupBPIZR4g9", components: "buttons", currency: "USD" }}>
                <ButtonWrapper amount={convertedAmount} showSpinner={false} handleFinish={handleFinish} />
            </PayPalScriptProvider>
        </div>
    );
}