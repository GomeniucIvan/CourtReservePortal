import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    orgArea: css`

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
    segmentCard: css `
        //margin: 0px ${token.padding}px;
        --adm-card-body-padding-block: 0px;
        
        .adm-card-body {
            border: 2px solid ${token.colorBgLayout};
            border-radius: 6px;
        }
        
        .ant-segmented {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }
    `,
    leagueBlock: css`
        position: relative;
        margin: 2px ${token.padding}px 0px 16px;
    `,
    leagueSelector: css`
        margin-bottom: ${token.padding}px;
        border-color: ${token.colorBorder} !important;
        box-shadow: none !important;
    `,
    selectLeagueLabel: css`
        position: absolute;
        top: -12px;
        z-index: 2;
        left: 10px;
        background: ${token.colorBgBase};
        padding: 0px 6px;
    `,
    weatherHeaderIcon: css`
        width: 16px;
        height: 16px;
    `,
    weatherHeaderText: css`
        font-size: ${token.fontSize}px;
        font-weight: 400;
        line-height: 22px;
    `,
    rotateNotch: css`
        -webkit-animation:spin 1s linear infinite;
        -moz-animation:spin 1s linear infinite;
        animation:spin 1s linear infinite;
        
        @-moz-keyframes spin {
            100% { -moz-transform: rotate(360deg); }
        }
        @-webkit-keyframes spin {
            100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
            100% {
                -webkit-transform: rotate(360deg);
                transform:rotate(360deg);
            }
        }
    `
}));