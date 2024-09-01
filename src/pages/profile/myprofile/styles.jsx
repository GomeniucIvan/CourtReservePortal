﻿import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    table: css`
        border-top: 1px solid ${token.colorBorder};
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