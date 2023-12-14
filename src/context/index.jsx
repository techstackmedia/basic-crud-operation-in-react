import { createContext, useRef, useState } from 'react';
import useToast from '../hooks/useToast';
import useCardEdit from '../hooks/useCardEdit';

const CardContext = createContext();

const ITEMS_PER_PAGE = 6;
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/cardsData`;

const CardContextProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(isLoading);

  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const fetchData = async (forceFetch = true) => {
    setIsLoading(true);
    try {
      if (forceFetch || !isLoadingRef.current) {
        const response = await fetch(BASE_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching data. Could not retrieve data');
        } else {
          const fetchedData = await response.json();
          setCardsData(fetchedData);
        }
      }
    } catch (e) {
      setError(e.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCard = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting card. Could not delete the card');
      }

      const updatedCardsData = cardsData.filter((card) => card.id !== id);
      setCardsData(updatedCardsData);
      showToast('Card deleted successfully!');
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  const addCard = async (newCard) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error('Error adding card. Could not add the card');
      } else {
        const addedCard = await response.json();
        setCardsData((prevData) => [...prevData, addedCard]);
        showToast('Card added successfully!');
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  const editCard = async (id, updatedCard) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error('Error editing card. Could not edit the card');
      } else {
        fetchData();

        const editedCard = await response.json();
        setCardsData((prevData) =>
          prevData.map((card) =>
            card.id === id ? { ...card, ...editedCard } : card
          )
        );
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  const { editingCard, toggleEditCard } = useCardEdit(editCard);
  const { showToast, toastMessage } = useToast();


  const handleSearch = async (searchTerm) => {
    try {
      if (searchTerm.trim() === '') {
        fetchData();
      } else {
        const response = await fetch(`${BASE_URL}?body_like=${searchTerm}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            'Error searching cards. Could not perform the search'
          );
        } else {
          const filteredCards = await response.json();
          setCardsData(filteredCards);
        }
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  return (
    <CardContext.Provider
      value={{
        error,
        editingCard,
        toggleEditCard,
        addCard,
        handleSearch,
        removeCard,
        cardsData,
        isLoading,
        showToast,
        toastMessage,
        ITEMS_PER_PAGE,
        fetchData,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export { CardContextProvider };
export default CardContext;
