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
            
            input {
                position: absolute;
                left: -200vw;
                top: 0;
                display: block;
                width: 50px;
                height: 20px;
                opacity: .5;
            }
        }
  `,
}));