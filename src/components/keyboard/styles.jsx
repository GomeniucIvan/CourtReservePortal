import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    iosKeyboard: css `
        position: relative;
        margin-left: -${token.padding}px;
        margin-right: -${token.padding}px;
        margin-bottom: -${token.padding-0.5}px; //bottom extra line 0.5
        
        
    `,
    keyboardContainer: css `
        .adm-popup-body, .adm-number-keyboard-popup {
            position: relative;
        }
        
        .adm-number-keyboard-key {
          background-color: ${token.colorBgBase};  
            
            &::before {
                opacity: 0;
            }
        }
    `
}));