import { useEffect, useState } from 'react';
import AddButton from './components/AddButton';
import Card from './components/Card';
import Search from './components/Search';
import './App.css';
import logo from './logo.svg';

// Constants
const ITEMS_PER_PAGE = 6;
const BASE_URL = 'http://localhost:5000/cardData';

export default function App() {
  // Effect Hook for initial data fetch
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State Hooks
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [cardEdit, setCardEdit] = useState({
    item: {},
    isEditable: false,
  });

  // Toggle Edit Card function
  const toggleEditCard = (item) => {
    setCardEdit((prev) => {
      return {
        ...prev,
        item,
        isEditable: !prev.isEditable,
      };
    });

    editCard(item.id, { body: item.body });
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Derived pagination values
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Timer function for clearing errors
  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  // Fetch data function
  const fetchAllData = async () => {
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
        const dataList = await response.json();
        setData(dataList);
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Remove Card function
  const removeCard = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting card. Could not delete the card');
      }
      const dataRemove = data.filter((item) => item.id !== id);
      setData(dataRemove);
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Add Card function
  const addCard = async (newData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error('Error adding card. Could not add the card');
      } else {
        const dataAdd = await response.json();
        setData((prevData) => [...prevData, dataAdd]);
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };

  // Edit Card function
  const editCard = async (id, updateItem) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateItem),
      });
      if (!response.ok) {
        throw new Error('Error editing card. Could not edit the card');
      } else {
        const dataEdit = await response.json();
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, ...dataEdit } : item
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
        fetchAllData();
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
          setData(filteredCards);
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
          <AddButton addCard={addCard} data={data} />
          <img src={logo} width={30} height={30} alt='techstack media logo' />
          <Search handleSearch={handleSearch} />
        </header>
        <main className='App-main'>
          {currentItems.length !== 0 ? (
            currentItems.map((item) => {
              return (
                <Card
                  key={item.id}
                  id={item.id}
                  item={item}
                  removeCard={removeCard}
                  editCard={editCard}
                  cardEdit={cardEdit}
                  editCardHandler={toggleEditCard}
                />
              );
            })
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
      </div>
      <div className='App-pagination'>
        {[...Array(Math.ceil(data.length / ITEMS_PER_PAGE))].map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
