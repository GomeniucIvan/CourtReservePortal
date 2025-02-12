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
        
    `,
    recordingCardCoverImage: css`
        max-width: 100%;
    `
}));