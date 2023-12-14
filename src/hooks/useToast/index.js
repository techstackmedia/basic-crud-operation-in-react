import { useState } from 'react';

const useToast = () => {
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);

        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    return {
        toastMessage,
        showToast,
    };
};

export default useToast;
