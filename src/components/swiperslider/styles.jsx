import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    swiperArrows: css`
        .adm-swiper-track-inner {
            padding-bottom: 20px;
        }
        
        .adm-page-indicator {
            --dot-spacing: 6px;
            --dot-size: 12px;
            --dot-border-radius:  4px;
            --dot-color: ${token.colorBorder};
            --active-dot-size: 18px;
            
            .adm-page-indicator-dot {
                height: 4px;
                transition: all 0.3s ease;
            }
        }
    `
}));