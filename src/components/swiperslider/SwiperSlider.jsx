import {Swiper} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import {oneListItem, toBoolean} from "@/utils/Utils.jsx";
import { cx } from 'antd-style';
//https://mobile.ant.design/components/swiper

const SwiperSlider = ({ children, count, arrows = false, fullWidth = false }) => {
    const {styles} = useStyles();

    return (
        <Swiper stuckAtBoundary={false}
                trackOffset={4}
                arrows={arrows}
                className={cx(toBoolean(arrows) && styles.swiperArrows)}
                slideSize={toBoolean(fullWidth) ? 96 : (count === 1) ? 92 : 90}
                indicator={ toBoolean(arrows) ? undefined : () => null}>
            {children}
         </Swiper>
    )
}

export default SwiperSlider;