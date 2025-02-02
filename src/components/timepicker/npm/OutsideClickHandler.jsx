import React, { useEffect, useRef } from 'react';

const OutsideClickHandler = ({ children, onOutsideClick, focused, closeOnOutsideClick = true }) => {
  const childNodeRef = useRef(null);

  useEffect(() => {
    if (!closeOnOutsideClick) return;

    const handleOutsideClick = (event) => {
      if (childNodeRef.current && !childNodeRef.current.contains(event.target) && event.button === 1) {
        onOutsideClick && onOutsideClick(event);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
    };
  }, [onOutsideClick, closeOnOutsideClick]);

  return (
      <div ref={childNodeRef} className={'outside_container active'}>
        {children}
      </div>
  );
};

export default OutsideClickHandler;