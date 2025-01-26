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
    bookingLeftCardLine: css`
        content: ' ';
        position: absolute;
        left: 0;
        width: 5px;
        top: 0;
        height: 100%;
        border-top-left-radius: ${token.borderRadiusSM}px;
        border-bottom-left-radius: ${token.borderRadiusSM}px;
    `,
    emptyFlexBlock: css`
       // min-height: 176px;
    `,
    emptyText: css`
        color: ${token.colorText};
    `,
    emptyCard: css`
        background-color: ${token.colorBgLayout};
    `
}));