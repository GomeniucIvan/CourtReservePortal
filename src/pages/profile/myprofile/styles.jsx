import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    table: css`
        border-top: 1px solid ${token.colorBorder};
      
      .ant-table-thead {
        position: sticky;
        top: -2px;
        z-index: 5;
      }
  `,
    columnNotification: css`
        //width: 100%;
    `,
    columnEmail: css`
        width: 70px;
        text-align: center !important;
    `,
    columnPush: css`
        width: 70px;
        text-align: center !important;
    `
}));