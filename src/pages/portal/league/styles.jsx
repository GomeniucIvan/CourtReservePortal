import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    leagueBlock: css`
        position: relative;
        width: 100%;
    `,
    leagueSelector: css`
        margin-bottom: ${token.paddingSM}px;
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
    playersTable: css`
        .ant-table-thead {
            position: sticky;
            top: -2px;
            z-index: 1;
        }
    `,
    playersTableRankColumn: css`
        width: 80px;
    `,
    highlightColumn: css`
        background-color: ${token.colorSuccessBg};
    `,
    winnerTeamWrapper: css`
        font-weight: bold;
    `,
    matchScoreDisabledInput: css`
        width: 40px;
        height: 40px;
        text-align: center;
        background-color: ${token.colorBgBase} !important;
    `,
    matchVsText: css`
        padding-right: 10px;
    `,
    matchScoreWinnerInput: css`
        background-color: ${token.colorSuccess} !important;
        color: #ffffff !important;
    `,
    matchScoreNumericInput: css`
        width: 40px !important;
        text-align: center !important;
        
        input {
            height: 40px !important;
            text-align: center !important;
            
            &:not([disabled]) {
                background-color: ${token.colorBgBase} !important;
            }
        }
    `,
    matchScoreNumericFocusedInput: css`
        border-color: ${token.colorPrimary} !important;
    `
}));