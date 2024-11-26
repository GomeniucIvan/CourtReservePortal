import { createStyles } from 'antd-style';

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
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
    
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
    background-color: color-mix(in srgb, ${token.colorPrimary} 10%, transparent) ;
    border-bottom-left-radius: ${token.borderRadius}px;
    border-bottom-right-radius: ${token.borderRadius}px;
  `,
  resendCodeButton: css`
    padding: 0;
    margin: 0px !important;
    max-height: 22px;
    color: ${token.colorLink} !important;
    
    &:disabled{
      opacity: 0.6;
    }
  `
}));