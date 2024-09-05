import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    drawerButton: css`
        padding: ${token.padding}px;
    `,
    drawerBottom: css `
        overflow: auto;
    `,
    rangeDatePickerInput: css`
        .ant-picker-range {
            width: 100% !important;
            height: ${token.Input.controlHeight}px;

            &.ant-picker {
                opacity: 1 !important;
                position: initial !important;
            }
        }
    `,
    datePickerDrawer: css`
        .ant-picker-dropdown {
            position: initial !important;

            .ant-picker-date-panel,
            .ant-picker-year-panel,
            .ant-picker-month-panel,
            .ant-picker-decade-panel {
                width: 100%;
            }
        }

        .ant-picker {
            opacity: 0;
            position: absolute;
            z-index: -1;
        }
        
        .ant-picker-panel-container {
            box-shadow: none;
            border-top: 1px solid ${token.colorBorderSecondary};
            border-radius: 0;
        }

        .ant-picker-body {
            padding: 8px !important;
        }
    `
}));