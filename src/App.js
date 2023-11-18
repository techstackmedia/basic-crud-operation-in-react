import { useEffect, useState } from 'react';
import Card from './components/Card';
import './App.css';
import cardData from './data';
import AddButton from './components/AddButton';
import Search from './components/Search';
import logo from './logo.svg';

const ITEMS_PER_PAGE = 6;
const BASE_URL = 'http://localhost:5000/cardData';

export default function App() {
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [originalData, setOriginalData] = useState(cardData);
  const [data, setData] = useState(originalData);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const [error, setError] = useState(null);
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const clearErrorTimer = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };
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
        throw new Error('Error In Getting Data');
      } else {
        const dataList = await response.json();
        setData(dataList);
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };
  const [cardEdit, setCardEdit] = useState({
    item: {},
    isEditable: false,
  });
  const editCartHandler = (item) => {
    setCardEdit((prev) => {
      return {
        ...prev,
        item,
        isEditable: !prev.isEditable,
      };
    });

    editCard(item.id, { body: item.body });
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const removeCard = async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    setData(data.filter((item) => item.id !== id));
  };
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
        throw new Error("Can't Add Card");
      } else {
        const dataAdd = await response.json();
        setOriginalData((prevData) => [...prevData, dataAdd]);
        setData((prevData) => [...prevData, dataAdd]);
      }
    } catch (e) {
      setError(e.message);
      clearErrorTimer();
    }
  };
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
        throw new Error('Can Not Edit Card');
      } else {
        const dataEdit = await response.json();
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, ...dataEdit } : item
          )
        );
      }
    } catch (e) {
      setError(e.messaage);
      clearErrorTimer();
    }
  };
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
          throw new Error('Error Searching Cards');
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
                  editCartHandler={editCartHandler}
                />
              );
            })
          ) : (
            <div className='App-log'>
              <p className='App-empty'>
                <span>No More Card</span>
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
