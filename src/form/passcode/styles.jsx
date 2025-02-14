import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    root: css`
        
        .ant-passcode-input {
            .cell-container {
                display: flex;
            }

            .cell {
                aspect-ratio: 1 / 1; //set height same as width
                width: 100%;
                border: 1px solid ${token.colorBorder};
                border-radius: ${token.Input.borderRadius}px;
                background: transparent;
                align-items: center;
                justify-content: center;
                display: flex;
                position: relative;
                
                &.cell-focused {
                    border-color: ${token.colorPrimary};
                }
                &.cell-dot {
                    border-color: ${token.colorSuccess};
                }
                
                &:not(.cell-dot):after {
                    content: '•';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.4;
                }
                &.cell-error {
                    border-color: ${token.colorError};
                }
                
                .cell-input {
                    position: relative;
                    border: none;
                    background: transparent;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    font-size: inherit;
                    outline: none;
                    z-index: 1;
                    -webkit-user-select: text;
                    -moz-user-select: text;
                    user-select: text;
                }
            }
            
            &.-seperated {
               .cell:not(:last-child) {
                   margin-right: ${token.marginXS}px;
               }
            }

            &.-error {
                .cell {
                    border-color: ${token.colorError};
                }
            }
            
            .native-input {
                display: block;
                height: 100%;
                left: 0;
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 2;
                background-color: transparent;
                border: none;
                color: transparent;
                box-shadow: none !important;
                caret-color: transparent !important;
                outline: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
        }
  `,
}));