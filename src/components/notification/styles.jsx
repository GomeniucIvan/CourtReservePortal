import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        notification: css`
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
            border-radius: ${token.borderRadius}px;
            margin: ${token.padding * 2}px ${token.padding}px 0px ${token.padding}px;
            transition: transform 0.3s ease-in-out;
        `,
    };
});