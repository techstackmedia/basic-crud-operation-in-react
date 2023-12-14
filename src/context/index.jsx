import { createContext, useState } from 'react';

const CreateCardContext = createContext();

const ITEMS_PER_PAGE = 6;
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/cardsData`;

const CardContextProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState({
    card: {},
    isEditing: false,
  });

  // Toggle Edit Card function
  const toggleEditCard = (card) => {
    setEditingCard((prev) => {
      return {
        ...prev,
        card,
        isEditing: !prev.isEditing,
      };
    });

    editCard(card.id, { body: card.body });
  };

  // Timer function for clearing errors
  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Fetch data function
  const fetchData = async (forceFetch = true) => {
    setIsLoading(true);
    try {
      // Check if data fetching is needed (either forced or not loaded)
      if (forceFetch || !isLoading) {
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

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Toast function
  const showToast = (message) => {
    setToastMessage(message);

    // Hide the toast after a certain duration
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Remove Card function
  const removeCard = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting card. Could not delete the card');
      }

      // Wait for fetchData to complete before updating the state
      // fetchData();

      const updatedCardsData = cardsData.filter((card) => card.id !== id);
      setCardsData(updatedCardsData);
      showToast('Card deleted successfully!');
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Add Card function
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
        // Wait for fetchData to complete before updating the state
        // fetchData()

        const addedCard = await response.json();
        setCardsData((prevData) => [...prevData, addedCard]);
        showToast('Card added successfully!');
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Edit Card function
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
        // Wait for fetchData to complete before updating the state
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

  // Search function
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
          // Wait for fetchData to complete before updating the state
          // fetchData()

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
    <CreateCardContext.Provider
      value={{
        error,
        editingCard,
        toggleEditCard,
        toastMessage,
        addCard,
        handleSearch,
        removeCard,
        cardsData,
        isLoading,
        showToast,
        ITEMS_PER_PAGE,
        fetchData,
      }}
    >
      {children}
    </CreateCardContext.Provider>
  );
};

export { CardContextProvider };
export default CreateCardContext;
