import { Modal } from 'antd-mobile'

 export const ModalWarning = (data) => {
//     Modal.confirm({
//         title: 'Custom Title',
//         content: '人在天边月上明',
//         centered: true,
//         okText: 'Confirm',
//         cancelText: 'Cancel',
//         okType: 'primary',
//         onOk: () => {
//             console.log('Confirmed');
//         },
//         onCancel: () => {
//             console.log('Cancelled');
//         },
//     });
}

export const ModalClose = (data) => {
    Modal.show({
        content: data.content,
        closeOnAction: true,
        actions: [
            {
                key: 'close',
                text: 'Close',
                primary: true,
            }
        ],
    })
    
    // Modal.confirm({
    //     title: data.title,
    //     content: data.content,
    //     centered: true,
    //     okText: 'Close',
    //     cancelButtonProps: { style: { display: 'none' } },
    //     okType: 'primary',
    //     icon: data.showIcon ? undefined : null,
    //     onOk: data.onOk,
    // });
}

