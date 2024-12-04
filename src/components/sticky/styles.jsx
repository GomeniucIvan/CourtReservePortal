import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    sticky: css`
        position: -webkit-sticky; 
        position: sticky;
        top: -1px; 
        z-index: 100;
        background-color: ${token.colorBgBase};
        width: 100%;
    `
}));