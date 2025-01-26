import { createStyles } from 'antd-style';

export const tStyles = createStyles(({ css, token }) => ({
    error: css`
        color: #6B1517;
        background-color: #FFCCC7;
        border-color: #FFCCC7;
    `,
    grey: css`
        background-color: #F0F0F0;
        border-color: #F0F0F0;
        color: #535457;
    `,
    waitlisted: css`
        background-color: #FFE7BA;
        border-color: #FFE7BA;
        color: #AD4E00;
    `,

    spotsAvailable: css`
        background-color: #D9F7BE;
        border-color: #D9F7BE;
        color: #135200;
    `,
    info: css`
        color: #10239E;
        background-color: #D6E4FF;
        border-color: #D6E4FF;
    `
}));