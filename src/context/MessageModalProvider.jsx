import React, { useState } from "react";
import CenterModal from "@/components/modal/CenterModal.jsx";


let modalHandler; // Global reference for the modal handler

const MessageModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isVisible: false,
        data: null
    });

    const displayModal = (data) => {
        setModal({ isVisible: true, data });
    };

    const closeModal = () => {
        setModal({ isVisible: false, data: null });
    };

    // Assign the displayModal function to the global reference
    modalHandler = displayModal;

    return (
        <>
            {children}
            <CenterModal data={modal.data} 
                         show={modal.isVisible}
                         buttonType={modal.data?.buttonType}
                         type={modal.data?.type}
                         onClose={closeModal} 
                         zIndex={9999}
                         title={typeof modal.data?.title === "function" ? modal.data?.title() : modal.data?.title}
                         children={typeof modal.data?.html === "function" ? modal.data.html(closeModal) : modal.data?.html} />
        </>
    );
};


//MessageModal
export const displayMessageModal = (data) => {
    if (modalHandler) {
        modalHandler(data);
    } else {
        console.error("MessageModalProvider is not initialized yet.");
    }
};

export default MessageModalProvider;