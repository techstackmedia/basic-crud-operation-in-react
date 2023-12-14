import AddButton from './components/AddButton';
import CardList from './components/Card';
import Search from './components/Search';
import './App.css';
import logo from './logo.svg';
import Spinner from './components/Spinner';
import CreateCardContext from './context';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';

export default function Cards() {
  const {
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
  } = useContext(CreateCardContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get('page') || 1;

  // Derived pagination values
  const indexOfLastCard = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - ITEMS_PER_PAGE;
  const currentCards = cardsData?.slice(indexOfFirstCard, indexOfLastCard);

  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(page);
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <AddButton addCard={addCard} data={cardsData} />
          <a href='https://techstackmedia.com' target='_blank' rel='noreferrer'>
            <img src={logo} width={30} height={30} alt='techstack media logo' />
          </a>
          <Search handleSearch={handleSearch} />
        </header>
        {isLoading ? (
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
        {[...Array(Math.ceil(cardsData.length / ITEMS_PER_PAGE))].map(
          (_, index) => (
            <button
              key={index}
              onClick={() => handleClick(`/?page=${index + 1}`)}
            >
              {index + 1}
            </button>
          )
        )}

        {toastMessage && (
          <div className={`toast ${toastMessage && 'show'}`}>
            <p>{toastMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}
