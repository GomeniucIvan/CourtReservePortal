import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    cardPrimary: css `
        position: relative;
        border: 1px solid ${token.colorPrimary};
        .ant-card-body {
            padding: ${token.Custom.cardIconPadding}px;
            //box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
            height: 150px;
        }
    `,
    cardName: css`
        //height: 42px;
        display: block;
        
        .adm-ellipsis {
            line-height: 1.2;
            padding-bottom: 6px;
        }
    `,
    cardType: css`
        display: block;
        opacity: 0.6;
        line-height: 1.2;
        position: absolute;
        bottom: 8px;
    `,
    bottomBg: css`
        background-color: ${token.colorPrimary};
        border-radius: 50%;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        width: 100%;
        padding: 30px 0;
        position: absolute;
        left: 0;
        bottom: 0;
        opacity: 0.08;
    `,
    svgItem: css`
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 30px;
        
        svg {
            filter: drop-shadow(-2px 4px 2px rgba(0, 0, 0, .4));
        }
    `
}));