import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    progress: css`
        position: relative;
        padding-top: 2px;
        padding-bottom: 2px;
        width: fit-content;
        
        &:before {
            position: absolute;
            opacity: 0.15;
            background: ${token.colorPrimary};
            border-radius: 4px;
            content: '';
            width: 100%;
            height: 100%;
        }
        
        div:first-child {
            margin-left: 2px;
        }
        div:last-child {
            margin-right: 2px;
        }
    `,
    emptySquare: css`
        position: relative;
        width: 16px;
        height: 16px;
        
        &:before {
            position: absolute;
            opacity: 0.4;
            background: ${token.colorPrimary};
            border-radius: 4px;
            content: '';
            width: 100%;
            height: 100%;
        }
    `,
    filledSquare: css`
        &:before {
            opacity: 1;
        }
    `
}));