import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    browser: css`
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadius}px;
        background-color: inherit;
    `,
    browserHeader: css`
        height: 24px;
        background-color:  #e4e9ec;
        box-sizing: border-box;
        position: relative;
        
        &:after {
            content: "";
            position: absolute;
            top: 6px;
            right: 48px;
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #24cc3d;
            box-shadow: 20px 0 #ffbf2b, 40px 0 #fd6458;
        }
    `,
    iframe: css`
        //padding: ${token.paddingSM}px;
    `
}));