import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    drawerButton: css`
        padding: ${token.padding}px;
    `,
    drawerBottom: css `
        overflow: auto;
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
            display: none;
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