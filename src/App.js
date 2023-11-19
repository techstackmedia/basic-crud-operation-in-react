import { useEffect, useState } from 'react';
import AddButton from './components/AddButton';
import Card from './components/Card';
import Search from './components/Search';
import './App.css';
import logo from './logo.svg';
import Spinner from './components/Spinner';

// Constants
const ITEMS_PER_PAGE = 6;
const BASE_URL = 'http://localhost:5000/cardsData';

export default function App() {
  // Effect Hook for initial data fetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State Hooks
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Derived pagination values
  const indexOfLastCard = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - ITEMS_PER_PAGE;
  const currentCards = cardsData?.slice(indexOfFirstCard, indexOfLastCard);

  // Timer function for clearing errors
  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}?_page=${currentPage}&_limit=100`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error fetching data. Could not retrieve data');
      } else {
        const fetchedData = await response.json();
        setIsLoading(true);
        setCardsData(fetchedData);
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      const updatedCardsData = cardsData.filter((card) => card.id !== id);
      setCardsData(updatedCardsData);
      showToast('Card deleted successfully!');
      fetchData()
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
        const addedCard = await response.json();
        setCardsData((prevData) => [...prevData, addedCard]);
        showToast('Card added successfully!');
        fetchData()
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
        const editedCard = await response.json();
        setCardsData((prevData) =>
          prevData.map((card) => (card.id === id ? { ...card, editedCard } : card))
        );
        fetchData()
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
          throw new Error('Error searching cards. Could not perform the search');
        } else {
          const filteredCards = await response.json();
          setCardsData(filteredCards);
          fetchData()
        }
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <AddButton addCard={addCard} data={cardsData} />
          <a href="https://techstackmedia.com" target='_blank' rel='noreferrer'>
            <img src={logo} width={30} height={30} alt='techstack media logo' />
          </a>
          <Search handleSearch={handleSearch} />
        </header>
        {!isLoading ? (
          <Spinner />
        ) : (
          <main className='App-main'>
            {currentCards.length !== 0 ? (
              currentCards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  item={card}
                  removeCard={removeCard}
                  editCard={editCard}
                  cardEdit={editingCard}
                  editCardHandler={toggleEditCard}
                  showToast={showToast}
                />
              ))
            ) : (
              <div className='App-log'>
                <p className='App-empty'>
                  <span>No More Cards</span>
                </p>
              </div>
            )}
            {error ? (
              <div className='App-log'>
                <p className='App-error'>
                  <span>{error}</span>
                </p>
              </div>
            ) : null}
          </main>
        )}
      </div>
      <div className='App-pagination'>
        {[...Array(Math.ceil(cardsData.length / ITEMS_PER_PAGE))].map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}

        {toastMessage && (
          <div className={`toast ${toastMessage && 'show'}`}>
            <p>{toastMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}
