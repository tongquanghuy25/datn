import { Modal } from 'antd'
import React from 'react'

const InfomationSchedule = () => {
    return (
        <div>
            <Modal
                title={<h3>Thông tin chuyến</h3>}
                // open={isCreateSchedule}
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

export default InfomationSchedule