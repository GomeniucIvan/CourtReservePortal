import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    transactionSegment: css`
        margin-top: 0 !important;
        
        .ant-segmented-group {
            label:nth-child(1){
                min-width: 60px;
            }
            label:nth-child(2){
                min-width: 45px;
            }
            label:nth-child(3){
                min-width: 75px;
            }
            label:nth-child(4){
                min-width: 90px;
            }
            label:nth-child(5){
                min-width: 40px;
            }
            
            .ant-segmented-item-label {
                padding: 0 6px;
            }
        }
        
  `,
}));