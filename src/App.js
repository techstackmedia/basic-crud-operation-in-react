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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const removeCard = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const addCard = (newData) => {
    setOriginalData((prevData) => [...prevData, newData]);
    setData((prevData) => [...prevData, newData]);
  };
  const editCard = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isBlur: !item.isBlur } : item
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
          {currentItems.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              item={item}
              removeCard={removeCard}
              editCard={editCard}
              isBlur={item.isBlur}
            />
          ))}
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
