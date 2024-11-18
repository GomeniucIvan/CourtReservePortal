﻿import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    searchOrganizationImage: css`
       width: 56px;
       height: 56px;

        img {
            width: -webkit-fill-available;
            height: max-content;
        }
  `,
    searchOrganizationNoImage: css`
        background-color: ${token.colorCourtReserve};
        border-radius: ${token.borderRadius}px;

        img {
            padding: 10px;
        }
    `,
    searchOrganizationFullAddress: css`
        opacity: 0.6;
        line-height: 16px;
    `,
  membershipCard: css`
    .adm-card-body {
      padding: 0px;
    }
    
    .react-memberships-item-cost-label{
      font-size: ${token.fontSize}px;
      font-weight: 400;
    }
    
    .price-suffix {
      font-weight: 400;
      font-size: ${token.fontSize}px;
      color: ${token.colorPrimary};
    }
  `,
  membershipWithTags: css`
    margin-top: 10px;
  `,
  membershipTags: css`
    gap: 4px 0px;
    position: absolute;
    top: -10px;
    
    .ant-tag {
      margin: 0px;
    }
  `,
  membershipFooterBlock: css`
    background-color: ${token.colorBorder};
    border-bottom-left-radius: ${token.borderRadius}px;
    border-bottom-right-radius: ${token.borderRadius}px;
  `
}));