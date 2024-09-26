import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    creditCardBlock: css`
        .ant-card-body {
            padding: ${token.padding}px;
        }
    `,
    creditCardIcon: css`
        border-radius: ${token.borderRadius}px;
        border: 1px solid ${token.colorBorder};
        width: 48px;
        height: 48px;
    `,
    paymentProfileWrapper: css`
        padding: 0 ${token.padding}px;
        
        .ant-card-body {
            padding: ${token.padding + (token.padding/2)}px ${token.padding}px !important;
        }
        
        .ant-ribbon {
            top: 8px;
        }
    `
}));