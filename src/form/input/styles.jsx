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
    `,
    disabledInput: css`
        position: relative;
    `,
    disabledFakeInput: css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    `
}));