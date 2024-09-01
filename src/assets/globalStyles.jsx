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
   card: css`
        border: 1px solid ${token.colorBorder};
        position: relative;
    `,
   noBottomPadding: css`
        margin-bottom: 0 !important;
    `,
   entityTypeCircleIcon: css`
        width: 18px;
        height: 18px;
        border-radius: 50px;
        display: block;
    `,
   clickableCard: css`
    position: relative;
      &:after {
         position: absolute;
         content: '';
         background-image: url(/svg/hand-pointer.svg);
         -webkit-background-size: contain;
         -webkit-background-size: contain;
         background-size: contain;
         background-repeat: no-repeat;
         width: 18px;
         height: 19px;
         right: 4px;
         bottom: 4px;
         opacity: 0.2;
         ${token.Custom.workingTheme === 'dark' && 'filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(100%) contrast(100%);'}
      }
   `,
   inputBottomLink: css`
      padding-top: ${token.Custom.buttonPadding}px;
      padding-bottom: ${token.Form.itemMarginBottom}px;
   `,
   formNoBottomPadding: css `
        margin-bottom: 0;
   `,
   cardItemTitle: css`
        margin: 0;
        margin-right: 25px;
    `,
   headerRightActions: css`
      .ant-input {
         display: none !important;
         height: 32px;
      }
      
      .ant-input-group{
         margin-left: -30px;

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
      
      svg {
         fill: #565656;
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
   `,
   itemList: css`
      --border-bottom: transparent;
      --adm-color-border: transparent;
   `,
   listCardList: css`
      padding: 0 ${token.padding}px;
      .adm-list-item-content-main {
         padding: 0;
      }
     .adm-list-body-inner {
        --padding-left: 0px;
        --padding-right: 0px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: ${token.padding}px;
     }
   `,
   listCardGrid: css`
       height: 140px;
       position: relative;

       * {
           z-index: 1;
       }
   `,
   listBgColor: css`
       position: absolute;
       width: 100%;
       height: 100%;
       opacity: 0.06;
       top: 0;
       left: 0;
       z-index: 0 !important;
       border-radius: ${token.borderRadius}px;
   `,
   urgentcardItemTitle: css `
        margin-right: 80px;
    `,
   urgentRibbon: css `
        top: 12px;
    `,
   formBlock: css`
       margin-bottom: ${token.Form.itemMarginBottom}px;
       width: 100%;
   `,
   noTopPadding: css`
        margin-top: 0 !important;
    `,
   formDivider: css`
      width: calc(100% + ${token.padding * 2}px);
      margin-left: -${token.padding}px;
   `,
   noSpace: css`
       margin: 0;
       padding: 0;
       margin-bottom: 0px !important;
   `,
   checkboxWithLink: css`
    span {
       margin-right: 0;
       padding-right: 2px;
    }
   `,
   alertDivider: css`
      margin: 5px 0;
      border-color: ${token.colorInfoBorder};
   `,
   search: css `
    .ant-input-affix-wrapper {
       height: ${token.Input.controlHeight}px;
    }
      
      .anticon-close-circle {
         svg {
            font-size: 18px;
            margin-top: 4px;
         }
      }

      .ant-input-affix-wrapper-focused {
         .ant-input-search-button {
            border-color: ${token.colorPrimary};
         }
      }
   `,
   tabs: css `
    .ant-tabs-nav-wrap {
       padding: 0 ${token.padding}px;
       .ant-tabs-nav-list {
          width: 100%;
          
          .ant-tabs-tab {
             margin: auto;
          }
       }
    }
   `,
   stickyButton: css`
      height: ${token.Button.controlHeight}px;
      padding: 12px 10px;
   `
}));