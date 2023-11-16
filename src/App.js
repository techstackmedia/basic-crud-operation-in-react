import { useState } from "react";
import Card from "./components/Card";
import "./App.css";
import cardData from "./data";
import AddButton from "./components/AddButton";
import Search from "./components/Search";
import logo from './logo.svg'

export default function App() {
  const [data, setData] = useState(cardData);
  const removeCard = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const addCard = (newData) => {
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
    if (searchTerm.trim() === "") {
      setData(cardData);
    } else {
      const filteredCards = data.filter((item) =>
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setData(filteredCards);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <AddButton addCard={addCard} data={data} />
        <img src={logo} width={30} height={30} alt="techstack media logo" />
        <Search handleSearch={handleSearch} />
      </header>
      <main className="App-main">
        {data.map((item) => (
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
  );
}
