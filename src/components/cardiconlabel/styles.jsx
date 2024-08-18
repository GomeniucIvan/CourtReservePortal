import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    flexRow: css `
    margin: ${token.Custom.cardIconPadding/2}px 0;
    `
}));