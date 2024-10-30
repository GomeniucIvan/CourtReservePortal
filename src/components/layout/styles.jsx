import {createStyles} from 'antd-style';

export const useStyles = createStyles(({css, token}) => ({
    root: css`
        margin: 0;
        padding: 0;
        overflow: hidden;

        form {
            .ant-btn {
                margin: ${token.Button.paddingXS / 2}px 0px;
            }
        }

        .sm-padding {
            margin: ${token.Button.paddingXS / 2}px 0px;
        }
        
        h1, h2, h3, h4, h5 {
            margin-block-start: 0;
        }
    `,
    layoutExtra: css`
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translate(0%, -50%);
        z-index: 999;
        background-color: ${token.colorText};
        display: flex;
        flex-direction: column;
        border-radius: ${token.borderRadius}px;
        padding: ${token.padding / 2}px;
        gap: ${token.padding / 2}px;
        opacity: 0.8;

        button {
            min-width: 24px !important;
            height: 24px !important;
        }
    `,
    themeButton: css`
        background: linear-gradient(to bottom right, white, black);
    `,
    primaryColor: css`
        background: ${token.colorPrimary};
    `,
    languagePickerContainer: css`
        position: relative;
    `,
    colorPickerContainer: css`
        position: relative;
    `,
    colorOptions: css`
        position: absolute;
        background-color: ${token.colorText};
        top: 0;
        width: 150px;
        display: flex;
        left: -158px;
        border-radius: ${token.borderRadius}px;
        height: 30px;
        align-items: center;
        justify-content: space-around;
    `,
    imageOptions: css`
        position: absolute;
        background-color: ${token.colorText};
        top: 0;
        width: 150px;
        display: flex;
        left: -158px;
        border-radius: ${token.borderRadius}px;
        height: 30px;
        align-items: center;
        justify-content: space-around;
    `,
    languageOptions: css`
        position: absolute;
        background-color: ${token.colorText};
        top: -8px;
        width: 80px;
        display: flex;
        left: -88px;
        border-radius: ${token.borderRadius}px;
        height: 34px;
        align-items: center;
        justify-content: space-around;
    `,
    skeleton: css`
        --width: 100%;
        --height: 250px;
        --border-radius: ${token.borderRadius}px;
    `
}));