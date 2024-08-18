import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Button} from "antd";
import {isNullOrEmpty, equalString, toBoolean } from "../../utils/Utils.jsx";
import {isMobileKeyboardOpen} from "../../utils/MobileUtils.jsx";
import {Popup} from "antd-mobile";

const modalRootEl = document.getElementById('root');

export class DrawerBottom extends Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            translateY: 0, // Initial translateY value
            confirmButtonText: 'Confirm',
            btnIsLoading: false,
            drawerStyle: {},
            showDrawer: false,
            isClear: equalString(this.props.confirmButtonText, 'Clear')
        };
        this.startY = 0;
        this.startY = 0;
        this.dragThreshold = 15; // Threshold for closing the drawer
        this.isDragging = false; // Flag to track if dragging is occurring
        this.handleDragStart = this.handleDragStart.bind(this);
        this.drawerRef = React.createRef();
    }
    handleDragStart = (e) => {
        // Use 'clientY' for mouse events and 'touches[0].clientY' for touch events
        this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        this.isDragging = true;
        // Add both mouse and touch event listeners
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.addEventListener('touchmove', this.handleDragging);
        document.addEventListener('touchend', this.handleDragEnd);
    };

    handleDragging = (e) => {
        if (!this.isDragging) return;
        // Use 'clientY' for mouse events and 'touches[0].clientY' for touch events
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        let deltaY = currentY - this.startY;
        deltaY = Math.max(deltaY, 0);

        this.setState({ translateY: deltaY });
    };

    handleDragEnd = () => {
        this.isDragging = false;
        // Remove both mouse and touch event listeners
        document.removeEventListener('mousemove', this.handleDragging);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.removeEventListener('touchmove', this.handleDragging);
        document.removeEventListener('touchend', this.handleDragEnd);

        if (this.state.translateY > this.dragThreshold) {
            this.props.closeDrawer();
        } else {
            this.setState({ translateY: 0 });
        }
    };

    componentDidMount() {
        modalRootEl.appendChild(this.el);

        if (!isNullOrEmpty(this.props.confirmButtonText)) {
            this.setState({ confirmButtonText: this.props.confirmButtonText });
        }
    }

    componentDidUpdate(prevProps) {
        // Check if the 'open' prop has changed from false to true
        if (!prevProps.open && this.props.open && !this.state.showDrawer) {
            // Ensure that the update only happens once per opening of the drawer
            const wasKeyboardOpen = isMobileKeyboardOpen();

            if (wasKeyboardOpen) {
                setTimeout(() => {
                    this.setState({ showDrawer: true });
                    this.updateDrawerStyleAndScroll();
                }, 500); // Delay for 500 if mobile keyboard was open
            } else {
                this.setState({ showDrawer: true });
                this.updateDrawerStyleAndScroll();
            }
        } else if (!this.props.open && this.state.showDrawer) {
            // Reset the flag when the drawer is closed
            this.setState({ showDrawer: false });
        }
    }

    updateDrawerStyleAndScroll = () => {
        this.setState({
            drawerStyle: {
                transform: `translateY(${this.state.translateY}px)`,
                transition: this.isDragging ? 'none' : 'transform 0.3s ease'
            }
        });

        const selectedItem = this.drawerRef.current.querySelector('.drawer-item-selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'start'
            });
        }
    }

    componentWillUnmount() {
        modalRootEl.removeChild(this.el);
        document.removeEventListener('mousemove', this.handleDragging);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.removeEventListener('touchmove', this.handleDragging);
        document.removeEventListener('touchend', this.handleDragEnd);
    }

    render() {
        return (
            <Popup
                visible={toBoolean(this.state.showDrawer)}
                onMaskClick={() => {
                    this.props.closeDrawer();
                }}
                onClose={() => {
                    this.props.closeDrawer();
                }}
                bodyStyle={{ height: '60vh' }}
            >
                {this.props.children}
            </Popup>
        )
    }
    
    // render() {
    //     return ReactDOM.createPortal(
    //         <>
    //             <div ref={this.drawerRef} className={`react-drawer-ul ${this.props.showButton ? 'button--drawer' : ''} ${toBoolean(this.state.showDrawer) ? 'show' : ''} ${isNullOrEmpty(this.props.drawerClass) ? '' : ` ${this.props.drawerClass}`}`} style={this.props.drawerStyle}>
    //                 <div className="row">
    //                     <div className="drawer-handle" onMouseDown={this.handleDragStart} onTouchStart={this.handleDragStart}>
    //                         <span className="handle-bar"></span>
    //                         <span className="handle-bar"></span>
    //                     </div>
    //                     <div className="col-12 mobile-bottom-modal-wrapper">
    //                         <div className="modal-icon-title">
    //                             <span className="mobile-bottom-modal-title">{this.props.label}</span>
    //                             <span className="close-mobile-bottom-modal fn-close-mobile-bottom-modal" onClick={() => this.props.closeDrawer()}>x</span>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className='mobile-bottom-modal-container lower-padding'>
    //                     <div className='drawer-max-height-wrapper kendo-drawer-list-wrapper'>
    //                         {this.props.children}
    //                     </div>
    //                 </div>
    //                 {((this.props.showButton && !this.state.isClear) || (this.props.showButton && this.state.isClear && !isNullOrEmpty(this.props.selectedValue)) ) &&
    //                     <div className='drawer-multiselect-confirm'>
    //                         <Button text={this.state.confirmButtonText}
    //                                        type="button"
    //                                        loading={this.state.btnIsLoading}
    //                                        disabled={false}
    //                                        onClick={() => {
    //                                            if (typeof this.props.onConfirmButtonClick === 'function') {
    //                                                this.props.onConfirmButtonClick();
    //                                            }
    //
    //                                            if (toBoolean(this.props.redirect)) {
    //                                                this.setState({ btnIsLoading: true });
    //                                            } else {
    //                                                this.props.closeDrawer();
    //                                            }
    //                                        }}
    //                                        className={`btn ${this.props.secondaryButton ? 'btn-transparent-blue' : 'btn-success'}`} />
    //                     </div>
    //                 }
    //             </div>
    //             <div className={`react-drawer-backdrop ${toBoolean(this.props.open) ? '' : 'hide'}`} style={{ zIndex: '9999' }} onClick={() => this.props.closeDrawer()}></div>
    //         </>,
    //         this.el,
    //     );
    // }
}