import { useState } from 'react';

const useCardEdit = (editCard) => {
    const [editingCard, setEditingCard] = useState({
        card: {},
        isEditing: false,
    });

    const toggleEditCard = (card) => {
        setEditingCard((prev) => ({
            ...prev,
            card,
            isEditing: !prev.isEditing,
        }));
        editCard(card.id, { body: card.body });
    };

    return {
        editingCard,
        toggleEditCard,
    };
};

export default useCardEdit;
