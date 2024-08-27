import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        footer: css`
            background-color: ${token.colorBgBase};
            color: ${token.colorText};
        `,
    };
});