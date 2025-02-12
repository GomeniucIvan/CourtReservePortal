import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    periodSelect: css`
        label {
            span {
                display: none;
            }
        }
    `,
    recordingCardCover: css`
        .ant-card-cover {
            position: relative;
            img {
                border-top-left-radius: ${token.borderRadius}px;
                border-top-right-radius: ${token.borderRadius}px;
            }
        }
    `,
    recordingCardCoverImage: css`
        max-width: 100%;
    `,
    recordingPlayIconWrapper: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        width: 44px;
        height: 44px;
        background-color: rgba(0, 0, 0, 0.45);
        border-radius: 50%;
        cursor: pointer;
    `
}));