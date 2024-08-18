import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    orgArea: css`
        height: 40vh;
        background-color: blue;
        border-radius: 0 0 50% 50% / 18px;
    `,
    card: css`
        border: 1px solid ${token.colorBorder};
        position: relative;
    `,
    organizationContainer: css`
        transition: all 100ms ease-in-out;
        border-radius: 10px;
        position: absolute;
        list-style: none;
        left: 0;
        right: 0;
        text-align: center;
        -webkit-box-shadow: 0 2px 15px 1px rgba(225, 225, 225, 0.5);
        box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.5);
        top: 54px;
        margin: 0px 20px;
        background: linear-gradient(to right, #4286f4, #373B44);
    `,
    cardItem: css`
        z-index: 2;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        height: 100%;
        margin: 1px;
        background: #ffffff;
        border-radius: 11px;
        border: 1px solid;
    `,
    cardItemTitle: css`
        margin: 0;
        margin-right: 25px;
    `,
    cardItemDescription: css`
        letter-spacing: 0.1px;
        min-height: 67px;
        overflow-wrap: break-word;
        display: block;
    `,
    hideAnnouncementButton: css`
        padding: 0 !important;
        height: 22px !important;
        width: 22px;
        font-size: 10px !important;
        position: absolute !important;
        right: 8px;
        top: 12px;
    `,
    urgentHideAnnouncementButton: css`
        right: 56px;
    `,
    urgentcardItemTitle: css `
        margin-right: 80px;
    `,
    urgentRibbon: css `
        top: 12px;
    `,
    segmentCard: css `
        //margin: 0px ${token.padding}px;
        --adm-card-body-padding-block: 0px;
        
        .adm-card-body {
            border: 2px solid whitesmoke;
            border-radius: 6px;
        }
        
        .ant-segmented {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }
        
    `,
    reservationTypeCircle: css`
        width: 18px;
        height: 18px;
        border-radius: 50px;
        display: block;
    `,
    noBottomPadding: css`
        margin-bottom: 0 !important;
    `
}));