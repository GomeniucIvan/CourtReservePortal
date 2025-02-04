import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        eventFullName: css`
            font-weight: 600;
            font-size: ${token.fontSizeLG}px;
        `
    };
});