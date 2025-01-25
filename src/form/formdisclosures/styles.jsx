import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    disclosureBlock: css`
        background-color: ${token.colorBgLayout};
        border-radius: ${token.borderRadius}px;
        border: 1px solid ${token.colorBorder};
        padding: ${token.padding}px;
    `,
    errorBlock: css`
        border: 1px solid ${token.colorError};
    `
}));