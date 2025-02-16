import {useStyles} from "./styles.jsx";
import {NumberKeyboard} from "antd-mobile";
import {toBoolean} from "@/utils/Utils.jsx";
import {useEffect, useRef, useState} from "react";

const IOSKeyboard = ({show, onInput, onClose, onDelete, showCloseButton = false}) => {
    const {styles} = useStyles();
    const keyboardContainerRef = useRef(null);
    const [containerReady, setContainerReady] = useState(false);

    // Ensure container is ready before showing the keyboard
    useEffect(() => {
        if (keyboardContainerRef.current) {
            setContainerReady(true);
        }
    }, []);
    
    const onInputInner = (e) => {
        if (typeof onInput == "function") {
            onInput(e);
        }
    }

    const onCloseInner = (e) => {
        if (typeof onClose == "function") {
            onClose(e);
        }
    }

    const onDeleteInner = (e) => {
        if (typeof onDelete == "function") {
            onDelete(e);
        }
    }

    return (
        <div ref={keyboardContainerRef} className={styles.keyboardContainer}>
            {(containerReady && toBoolean(show)) && (
                <NumberKeyboard
                    className={styles.iosKeyboard}
                    visible={show}
                    showCloseButton={toBoolean(showCloseButton)}
                    onClose={onCloseInner}
                    onInput={onInputInner}
                    onDelete={onDeleteInner}
                    getContainer={() => keyboardContainerRef.current}
                />
            )}
        </div>
    )
}

export default IOSKeyboard;