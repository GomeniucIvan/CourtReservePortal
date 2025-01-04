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
    title: css`
        padding: ${token.padding}px 0;
        border-bottom: 1px solid ${token.colorBorder};
        margin-bottom: ${token.padding}px;
    `,
    body: css`
        padding: 0 ${token.colorBgBase}px;
        overflow-y: auto;
        flex: 1;
    `
}));