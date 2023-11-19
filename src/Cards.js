import { useEffect, useState } from 'react';
import AddButton from './components/AddButton';
import CardList from './components/Card';
import Search from './components/Search';
import './App.css';
import logo from './logo.svg';
import Spinner from './components/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';

// Constants
const ITEMS_PER_PAGE = 6;
const BASE_URL = 'http://localhost:5000/cardsData';

export default function Cards() {
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get('page') || 1;

  const navigate = useNavigate()

  const handleClick = (link) => {
    navigate(link)
  }

  // Derived pagination values
  const indexOfLastCard = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - ITEMS_PER_PAGE;
  const currentCards = cardsData?.slice(indexOfFirstCard, indexOfLastCard);

  // Effect Hook for initial data fetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Timer function for clearing errors
  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Fetch data function
  const fetchData = async (forceFetch = false) => {
    setIsLoading(false)
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
    } finally {
      setIsLoading(true)
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
        //fetchData()

        const editedCard = await response.json();
        setCardsData((prevData) =>
          prevData.map((card) => (card.id === id ? { ...card, editedCard } : card))
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
          throw new Error('Error searching cards. Could not perform the search');
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
                <CardList
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
          <button key={index} onClick={() => handleClick(`/?page=${index + 1}`)}>
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
