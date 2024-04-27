import { Modal } from 'antd'
import React from 'react'

const InfomationTrip = () => {
    return (
        <div>
            <Modal
                title={<h3>Thông tin chuyến</h3>}
                // open={isCreateTrip}
                okText='Xác nhận'
                onOk={() => {
                    formRef.current.submit()
                }}
                cancelText='Hủy'
            // onCancel={onCancel}
            >

            </Modal>
        </div>
    )
}

export default InfomationTrip