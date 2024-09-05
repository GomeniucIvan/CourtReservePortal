import {useStyles} from "./styles.jsx";
import {useEffect, useRef, useState} from "react";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Input} from "antd";
import {cx} from "antd-style";
import {useApp} from "../../context/AppProvider.jsx";
import {useTranslation} from "react-i18next";

const {Search} = Input;

const HeaderSearch = ({placeholder = 'typeToFilter', setText, isLoading}) => {
    const [isSearchOpened, setIsSearchOpened] = useState(false);
    const {globalStyles, token} = useApp();
    const searchIconRef = useRef();
    const [inputWidth, setInputWidth] = useState(0);
    const [enteredValue, setEnteredValue] = useState('');
    const inputRef = useRef();
    const {t} = useTranslation('');
    
    const debounceTimeout = useRef(null);

    useEffect(() => {
        if (isSearchOpened) {
            if (searchIconRef.current) {
                const rightIconRect = searchIconRef.current.getBoundingClientRect();

                //todo add 49 to token
                setInputWidth(rightIconRect.left - token.padding - 49);
            }
        } else {
            setInputWidth(0);
        }
    }, [isSearchOpened]);

    const onSearch = (e) => {
        const value = e.target.value;
        setEnteredValue(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (setText && typeof setText === 'function') {
                setText(value);
            }
        }, 600);
    }

    const onSearchBlur = (e) => {
        if (isNullOrEmpty(enteredValue)) {
            setIsSearchOpened(false);
        }
    }

    return (
        <div ref={searchIconRef}
             onClick={() => {
                 if (!toBoolean(isSearchOpened)) {
                     setIsSearchOpened(true);
                     
                     setTimeout(function(){
                         if (inputRef.current) {
                             inputRef.current.focus();
                         }
                     }, 100)
                 }
             }}>
            <Search ref={inputRef}
                    rootClassName={cx(globalStyles.headerSearch, isSearchOpened && globalStyles.headerSearchOpened)}
                    placeholder={t(placeholder)}
                    onInput={onSearch}
                    onBlur={onSearchBlur}
                    style={{width: 0, '--input-width': `${inputWidth}px`}}/>
        </div>
    );
}

export default HeaderSearch;
