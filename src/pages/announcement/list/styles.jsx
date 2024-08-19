import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    list: css`
       .ant-list-item {
           padding: 12px ${token.padding}px;
           .ant-list-item-meta-title {
               margin: 0 !important;
           }
       }
  `,
}));