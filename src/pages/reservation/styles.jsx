﻿import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    list: css`
       .ant-list-item {
           padding: 12px ${token.padding}px;
           .ant-list-item-meta-title {
               margin: 0 !important;
           }
       }
        .ant-tag {
            margin-left: ${token.Custom.cardIconPadding}px; 
        }
  `,
    playersCard: css`
        .ant-card-body {
            padding: 10px;
        }
    `,
  noPlayersCard: css`
    .ant-card-body {
      padding: 0px;
    }
  `,
    playersDivider: css`
        margin: 12px 0;
    `
}));