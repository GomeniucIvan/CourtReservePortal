import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    select: css`
        width: 100%;
    `,

    selectGlobal: css`
        .ant-select-selector:not(.ant-select-status-error) {
            box-shadow: none !important;
        }
        .ant-select-selection-item-remove{
            display: none !important;
        }
    `,
}));