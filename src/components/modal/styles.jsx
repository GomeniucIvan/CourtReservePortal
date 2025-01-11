import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    wrapperContainer: css`
        //background-color: ${token.colorBgBase};
        border-radius: ${token.borderRadius}px;
        width: calc(100vw - ${token.padding*2}px);
        height: calc(100vh - ${token.padding*2}px);
        margin: auto;

        .ant-modal {
            width: 100% !important;
            margin: 0px auto !important;
            height: 100%;
            
            div[tabindex="0"] {
                height: 100%;     
            }
        }
        
        .ant-modal-content {
            height: 100%;
            box-shadow: none;
            padding: 0px !important;
        }
        
        .ant-modal-body {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    `,
    datePickerModal: css`
        .ant-modal {
            width: fit-content !important;
            margin: 0px auto !important;
            height: fit-content;
        }
        
        .ant-modal-close, .ant-picker-header-super-next-btn, .ant-picker-header-super-prev-btn {
            display: none !important;
        }
        
        .ant-picker-cell{
            width: 41px;
            height: 41px;
        }
        
        .ant-picker-cell-inner {
            min-width: 41px !important;
            height: 41px !important;
            line-height: 34px !important;
            border-radius: ${token.borderRadius} !important;
            align-items: center !important;
            justify-content: center !important;
            display: flex !important;
        }

        .ant-picker-cell-today .ant-picker-cell-inner::before {
            min-width: 41px !important;
            height: 41px !important;
            line-height: 34px !important;
            border-radius: ${token.borderRadius} !important;
        }

        .ant-picker-header button {
            color: ${token.colorTextBase};
            min-width: 2.4em;
        }

        .ant-picker-content th {
            opacity: 0.7;
        }
        
        .ant-picker-body{
            padding: 8px 10px 0px 10px !important;
        }
        
        .ant-picker-ranges {
            //display: none;
        }
        
        .ant-picker-panel-container {
            box-shadow: none;
        }

        .ant-modal {
            div[tabindex="0"] {
                height: auto;
            }
        }

        .ant-picker-year-panel .ant-picker-cell-inner,
        .ant-picker-month-panel .ant-picker-cell-inner {
            width: auto;
        }
        
        .ant-picker-cell:not(.ant-picker-cell-in-view),
        .ant-picker-cell-disabled {
            opacity: 0.4;
        }
    `,
    title: css`
        padding: ${token.padding}px 0;
        border-bottom: 1px solid ${token.colorBorder};
        margin-bottom: ${token.padding}px;
    `,
    body: css`
        overflow-y: auto;
        flex: 1;

        .ant-picker {
            display: none;
        }
    `,
    datePicker: css`
        position: unset;
    `,
    datePickerButtonConfirm: css`
        width: calc(100% - 20px) !important;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        margin: 10px auto;
    `,
    centerModal: css`
        .ant-modal-content {
            box-shadow: none;
            padding: ${token.paddingXXL}px !important;
        }

        .ant-modal-close {
            top: ${token.paddingXXL-1.5}px;
        }
    `
}));