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
   `,
   clickableCard: css`
   
   `,
   inputBottomLink: css`
      padding-top: ${token.Custom.buttonPadding}px;
      padding-bottom: ${token.Form.itemMarginBottom}px;
   `,
   formNoBottomPadding: css `
    margin-bottom: 0;
   `,
   headerRightActions: css`
      .ant-input {
         display: none !important;
         height: 32px;
      }
      
      .ant-input-group{
         margin-left: -28px;

         .ant-btn{
            height: 32px;
            width: 32px;
            border-radius: ${token.borderRadius}px !important;
         }
      }
      
      .ant-space-item {
         .ant-btn-icon-only{
            height: 32px;
            width: 32px;
         }
      }
   `,
   headerSearch: css `
      
   `,
   headerSearchOpened: css `
      .ant-input {
         display: initial !important;
         position: absolute;
      }

      .ant-input-group{
         .ant-btn{
            border-radius: 0px 8px 8px 0px !important;
         }
      }
   `
}));