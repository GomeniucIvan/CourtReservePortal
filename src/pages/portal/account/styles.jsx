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
        background-color: ${token.colorPrimary};
        border-radius: ${token.borderRadius}px;

        img {
            padding: 10px;
        }
    `,
    searchOrganizationFullAddress: css`
        opacity: 0.6;
        line-height: 16px;
    `,
  
  resendCodeButton: css`
    padding: 0;
    margin: 0px !important;
    max-height: 22px;
    color: ${token.colorLink} !important;
    
    &:disabled{
      opacity: 0.6;
    }
  `,
  membershipReviewCard: css`
        padding: ${token.paddingLG}px ${token.padding}px;
        background-color: ${token.colorBgLayout};
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadius}px;
        `
}));