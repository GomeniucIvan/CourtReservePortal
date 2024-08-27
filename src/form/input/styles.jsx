import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    input: css`
        color: ${token.colorText};
    `,
}));