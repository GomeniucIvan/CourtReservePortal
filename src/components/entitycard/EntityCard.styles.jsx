import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    cardHeader: css`
        min-height: 72px;
    `,
    cardPadding: css`
        .slick-slide {
            > div:first-of-type {
                margin: 0 ${token.padding}px;
            }
        }
        
        .adm-error-block {
            margin: 0 ${token.padding}px;
            padding: ${token.padding}px;
        }
    `,
}));