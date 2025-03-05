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
   cardButton: css`
       .ant-card-body {
           padding-bottom: ${token.paddingXXL}px;
           padding-top: ${token.paddingXXL}px;
       }
   `,
   cardSMPadding: css`
        .ant-card-body {
           padding: 14px;
        }
    `,
    cardNoPadding: css`
        .ant-card-body {
           padding: 0;
        }
    `,
   listItemSM: css`
      &.ant-list-item{
         padding-inline: 12px;
      }
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
   block: css`
    display: block;
   `,
   headerRightActions: css`
      .ant-input {
         display: none !important;
         height: ${token.headerActionHeight}px;
      }
      
      .ant-input-group{
         margin-left: -30px;

         .ant-btn{
            height: ${token.headerActionHeight}px;
            width: 32px;
            border-radius: ${token.borderRadius}px !important;
         }
      }
      
      .ant-space-item {
         .ant-btn-icon-only {
            height: ${token.headerActionHeight}px;
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
         margin-left: calc(var(--input-width) * -1);
         width: var(--input-width);
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
   hideRibbon: css`
    display: none;
   `,
   formBlock: css`
       width: 100%;
   `,
   skeletonInput: css`
       height: ${token.Input.controlHeight}px;
       width: 100% !important; 
      .ant-skeleton-input{
         height: 100% !important;
         min-width: 100% !important;
         width: 100% !important;
      }
   `,
   skeletonSwitch: css`
      width: 60px !important;
   `,
   skeletonLabel: css`
       margin: 0 0 2px;
      
      .ant-skeleton-input{
         height: 20px !important;
      }
   `,
   skeletonTable: css`
      .ant-skeleton-button{
         height: ${token.Input.controlHeight}px !important;
      }
   `,
   noTopPadding: css`
      margin-top: 0 !important;
   `,
   noMargin: css`
      margin: 0 !important;
   `,
   noPadding: css`
      padding: 0 !important;
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
   leftTabs: css `
      .ant-tabs-nav-wrap {
         .ant-tabs-nav-list {
             gap: ${token.paddingSM}px;
            .ant-tabs-tab {
               margin: initial;
                padding-left: ${token.paddingSM}px;
                padding-right: ${token.paddingSM}px;
                
                &:first-child {
                    //padding-left: 0;
                }
            }
         }
      }
   `,
   scrollableTabs: css `
   
   `,
   stickyButton: css`
      height: ${token.Button.controlHeight}px;
      padding: 12px 10px;
   `,
   collapse: css`
      .adm-list-item {
         --padding-left: 0;
         --padding-right: 0;
         .adm-list-item-content {
            padding: 0px ${token.padding}px;
         }
      }
   `,
   waiverUploadFlex: css`
       .ant-upload {
           background-color: white;
           border-radius: ${token.borderRadius}px;
       }
      .ant-upload-wrapper {
         width: 100%;
      }
      .ant-upload-disabled {
         color: initial;
         cursor: initial;
         width: 100% !important;
      }
      
      .ant-typography {
         margin: 0;
      }
   `,
    
   signatureCanvasCard: css `
       background-color: white;
      .ant-card-body {
         padding: 0;
      }
   `,
   indexBar: css`
      .adm-index-bar-sidebar-item {
         width: 22px;
         height: 22px;
         font-size: 16px;
         --font-size: 14px;
      }
      
      .adm-index-bar-anchor-title {
         font-weight: bold;
          background-color: ${token.colorBgLayout};
          z-index: 2;
      }

      .adm-list-item{
         padding-left: 0;
         
         .adm-list-item-content-main {
            padding-left: var(--padding-left);
         }
      }
   `,
   safeAreaGlass: css`
      display: block;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      position: fixed;
      top: 0;
      z-index: 2;
      width: 100%;
   `,
   textCenter: css`
    text-align: center;
   `,
   swiper: css`
      .adm-page-indicator {
         --dot-spacing: 6px;
      }
      
      .adm-page-indicator-dot{
         width: 12px;
         height: 4px;
         border-radius: 10px;
      }
      
    .adm-page-indicator-dot-active{
       width: 24px;
    }
   `,
   globalLabel: css`
      font-size: ${token.Form.labelFontSize}px;
      padding: ${token.Form.verticalLabelPadding};
      margin-left: ${token.Form.labelColonMarginInlineStart}px;
      display: block;
      color: ${token.colorText}
   `,
   filterSelector: css`
    --border-radius: ${token.borderRadius}px;
    --border: 1px solid ${token.colorBorder};
    --checked-border: solid var(--adm-color-primary) 1px;
    --padding: 6px 10px;
      --color: ${token.colorBgContainer}
   `,
   modalFull: css `
      .adm-center-popup-wrap {
         left: ${token.padding}px;
         transform: translate(0%, -50%);
      }

      .adm-center-popup-body {
         width: calc(100vw - ${token.padding *2}px);
         height: calc(100vh - ${token.padding *2}px);
         max-height: calc(100vh - ${token.padding *2}px);
         padding-top: 0;
      }
      
      .adm-modal-title {
         padding: ${token.padding}px;
      }
      
      .adm-modal-content {
         max-height: calc(100vh - 80px - ${token.padding *2}px);
         padding: 0 ${token.padding}px;
      }

      .adm-modal-footer {
         padding: ${token.padding/2}px ${token.padding}px ${token.padding}px;
         display: flex;
         flex-direction: row;
         justify-content: space-around;
         
         .adm-space-item {
            width: calc((100vw / 2) - ${token.padding * 2}px - ${token.padding}px);
            margin-bottom: 0;
         }
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
    },
  `,
   playersDivider: css`
        margin: 12px 0;
    `,
   drawerRow: css`
      min-height: 64px;
      display: flex;
      align-items: center;
   `,
   orgCircleMember: css`
      width: 48px;
      height: 48px;
      border-radius: 50px;
      background-color: ${token.colorPrimary};
      color: ${token.colorOrgText};
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 48px;
       
       .ant-typography {
           color: ${token.colorOrgText};
       }
   `,
    drawerCustomListItem: css`
        min-height: 60px !important;
        border-bottom: 1px solid ${token.colorBorder};
        padding-left: ${token.padding}px;
        padding-right: ${token.padding}px;
    `,
   swiperItem: css`
        width: calc(100% - ${token.padding}px);
   `,
   swiperLastItem: css`
      width: ${window.innerWidth - (token.padding*2)}px;
   `,
   tag: css`
        border-radius: ${token.borderRadiusXS}px;
       margin-inline-end: 0px;
   `,
    formError: css`
        color: ${token.Form.colorError};
        margin-left: 4px;
        margin-bottom: 0 !important;
        font-size: ${token.fontSizeSM}px;
    `,
    fullWidth: css`
        width: 100%;
    `,
    table: css`
        .ant-table-cell{

        }
    `,
    tableSmallHead: css`
        .ant-table-thead {
            .ant-table-cell {
                padding: ${token.paddingSM}px ${token.paddingMD}px !important;
            }
        }
        .ant-table-cell {
            padding: ${token.paddingMD}px ${token.paddingMD}px !important;
        }
    `,
    checkbox: css`
        .ant-checkbox-inner {
            border-radius: ${token.checkboxBorderRadius}px;
        }
    `,
    textCapitalize: css`
        text-transform: capitalize;
    `
}));