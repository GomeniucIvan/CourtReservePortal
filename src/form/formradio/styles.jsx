import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    drawerRadioGroup: css`
        display: flex;
        flex-direction: column;
    `,
    radioItem: css`
        height: 64px;
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: row-reverse;
        position: relative;
        margin-right: 0;
        padding: 0 ${token.padding}px;
        border-bottom: 1px solid ${token.colorBorder};
        
        &:last-child{
            border-bottom: none;
        }
        
        &.ant-radio-wrapper-checked{
            &:before {
                content: '';
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                position: absolute;
                background-color: ${token.colorPrimary};
                z-index: -1;
                opacity: 0.2;
            }
        }

        span:not(.ant-radio){
            margin-right: auto;
            padding-left: 0;
        }
        
        .ant-radio-inner {
            width: 24px;
            height: 24px;
        }

        .ant-radio-checked {
            .ant-radio-inner {
                &:after {
                    transform: scale(1.3);
                }
                &:before {
                    box-sizing: border-box;
                    position: absolute;
                    inset-block-start: 50%;
                    inset-inline-start: 50%;
                    display: block;
                    width: 12px;
                    height: 12px;
                    margin-block-start: -6px;
                    margin-inline-start: -6px;
                    background-color: ${token.colorPrimary};
                    border-block-start: 0;
                    border-inline-start: 0;
                    border-radius: 16px;
                    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
                    content: "";
                    z-index: 2;
                }
            }
        }
    `,
    radioLabel: css`
        margin: auto;
    `
}));