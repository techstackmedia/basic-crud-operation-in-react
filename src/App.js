import { useState } from 'react';
import Card from './components/Card';
import './App.css';
import cardData from './data';
import AddButton from './components/AddButton';
import Search from './components/Search';
import logo from './logo.svg';

const ITEMS_PER_PAGE = 6;

export default function App() {
  const [originalData, setOriginalData] = useState(cardData);
  const [data, setData] = useState(originalData);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
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

    if (cardEdit.isEditable) {
      editCard(item.id, { body: item.body });
    }
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const removeCard = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const addCard = (newData) => {
    setOriginalData((prevData) => [...prevData, newData]);
    setData((prevData) => [...prevData, newData]);
  };
  const editCard = (id, updateItem) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, ...updateItem } : item
      )
    );
  };
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setData(originalData);
    } else {
      const filteredCards = originalData.filter((item) =>
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setData(filteredCards);
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
            <>
              <p className='App-para'>No More Card</p>
            </>
          )}
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
