import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    orgCardLogo: css`
        max-height: 72px;
        -o-object-fit: contain;
        object-fit: contain;
        width: 72px;
        max-width: 100%;
    `,
    orgModalLogo: css`
        max-height: 46px;
        -o-object-fit: contain;
        object-fit: contain;
        width: 46px;
        max-width: 100%;
    `,
    orgLoadingLogo: css`
        max-height: 120px;
        -o-object-fit: contain;
        object-fit: contain;
        width: 120px;
        max-width: 100%;
    `,
    primaryButton: css`
        color: ${token.colorPrimary} !important;
        padding: 0;
        font-weight: 600;
        background-color: transparent !important;
    `,
    headerBadgesWrapper: css`
        .ant-tag:last-child{
            margin-right: 0;
        }
    `,
    footerIconFlex: css`
        width: 44px;
        height: 44px;
    `,
    orgModalOrgInfo: css`
        padding: ${token.padding}px;
        border-radius: ${token.borderRadius}px;
        border: 1px solid ${token.colorBorder};
    `
}));