import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    unreadNotification: css`
        background-color: rgba(255,255,0,0.10);
    `,
    image: css`
        max-height: 46px;
        -o-object-fit: contain;
        object-fit: contain;
        width: 46px;
        max-width: 100%;
    `
}));