import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    profilePictureWrapper: css`
        margin: auto;

        .ant-avatar {
            margin: auto;
        }
    `,
    profilePictureButton: css`
        min-width: 100px;
    `,
    profilePictureAvatar: css`
        border: 1px solid ${token.colorBorder};
        border-radius: 50%;
    `,
    imgCrop: css`
        .ant-modal-close {
            top: 5px;
            inset-inline-end: 7px;
        }
        
        .ant-modal-footer {
            display: flex;
            .ant-btn {
                width: 100%;
            }
        }
    `
}));