import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    drawerButton: css`
        padding: ${token.padding}px;
    `,
    drawerBottom: css `
        overflow: auto;
    `
}));