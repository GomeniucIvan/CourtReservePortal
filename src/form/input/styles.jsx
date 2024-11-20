import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    input: css`
        color: ${token.colorText};
    `,
    inputFilled: css`
        color: ${token.colorTextDisabled};
        border: 1px solid ${token.colorBorder};
        
        &:focus {
            background-color: ${token.colorBgContainerDisabled};
        }
    `
}));