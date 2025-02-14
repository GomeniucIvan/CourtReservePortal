import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    leagueBlock: css`
        position: relative;
        width: 100%;
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
}));