import {Swiper} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import {oneListItem} from "@/utils/Utils.jsx";

//https://mobile.ant.design/components/swiper

const SwiperSlider = ({ children, count }) => {
    const {styles} = useStyles();

    return (
        <Swiper stuckAtBoundary={false}
                trackOffset={4}
                slideSize={count === 1 ? 92 : 82}
                indicator={() => null}
                indicatorProps={styles.swiperIndicators}>
            {children}
         </Swiper>
    )
}

export default SwiperSlider;