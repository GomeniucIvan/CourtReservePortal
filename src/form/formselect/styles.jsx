import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    select: css`
        width: 100%;
    `,

    selectGlobal: css`
        .ant-select-selector {
            border-color: ${token.colorBorder} !important;
            box-shadow: none !important;
        }
    `,
}));