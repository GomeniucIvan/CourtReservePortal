import React, { Component } from 'react';
import Slider from 'react-slick';
import MagicSliderDots from './MagicSliderDots';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export class SlickSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScrolling: false,
            currentSlide: 0
        };
        this.touchStart = this.touchStart.bind(this);
        this.preventTouch = this.preventTouch.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.slider = React.createRef();
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    componentDidMount() {
        if (this.isIOS() || 1 == 1) {
            window.addEventListener('touchstart', this.touchStart);
            window.addEventListener('touchmove', this.preventTouch, { passive: false });
            window.addEventListener('touchend', this.touchEnd);
        }
    }

    componentWillUnmount() {
        if (this.isIOS() || 1 == 1) {
            window.removeEventListener('touchstart', this.touchStart);
            window.removeEventListener('touchmove', this.preventTouch, { passive: false });
            window.removeEventListener('touchend', this.touchEnd);
        }
    }

    touchStart(e) {
        if (this.isIOS() || 1 == 1) {
            this.firstClientX = e.touches[0].clientX;
            this.firstClientY = e.touches[0].clientY;
            this.setState({ isScrolling: false });
        }
    }

    touchEnd(e) {
        if (this.isIOS() || 1 == 1) {
            if (this.state.isScrolling) {
                // Reset the flag
                this.setState({ isScrolling: false });              
            }

            this.fixSlideTransitionPossition();
        }
    }

    preventTouch(e) {
        const minValue = 5; // Increase the threshold value if needed

        this.clientX = e.touches[0].clientX - this.firstClientX;
        this.clientY = e.touches[0].clientY - this.firstClientY;

        // Check for more horizontal than vertical movement
        if (Math.abs(this.clientX) > Math.abs(this.clientY) && Math.abs(this.clientX) > minValue) {
            if (e.cancelable) {
                e.preventDefault();
                e.returnValue = false;
            }
        } else {
            this.fixSlideTransitionPossition();
            // It's more of a vertical movement, allow the scroll
            this.setState({ isScrolling: true });
        }
    }

    afterChangeSlide = (current) => {
        this.setState({ currentSlide: current });
        if (typeof this.props.afterChange === 'function') {
            this.props.afterChange();
        }
    }

    fixSlideTransitionPossition() {
        if (this.slider && this.slider.current) {
            const { currentSlide } = this.state;
            this.slider.current.slickGoTo(currentSlide);
        }
    }

    render() {
        const settings = {
            dots: true,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            afterChange: this.afterChangeSlide,
            appendDots: dots => {
                return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} style={{ marginTop: '-20px', paddingBottom: '20px' }} />;
            }
        };

        return (
            <Slider ref={this.slider} {...settings}>
                {this.props.children}
            </Slider>
        )
    }
};