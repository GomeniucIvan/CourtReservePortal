import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  membershipCard: css`
    box-shadow: none;
    
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
  pricingButton: css`
    span {
      color: ${token.colorPrimary};
    }
  `,
  membershipReviewCard: css`
        padding: ${token.paddingLG}px ${token.padding}px;
        background-color: ${token.colorBgLayout};
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadius}px;
        `
}));