import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
   cardIconBlock: css`
      width: ${token.Custom.cardIconWidth}px;
      display: flex;
      justify-content: center;
      align-items: center;
   `,
   drawerMenu: css`
        .ant-menu-item {
           padding-left: 14px !important;
        }
   `
}));