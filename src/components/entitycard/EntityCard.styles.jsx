import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    headerPadding: css`
        margin: 0 ${token.padding}px;
    `,
    cardPadding: css`
        .slick-slide {
            > div:first-of-type {
                margin: 0 ${token.padding}px;
            }
        }
    `,
}));