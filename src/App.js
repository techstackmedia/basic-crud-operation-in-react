import { useEffect, useState } from 'react';
import AddButton from './components/AddButton';
import CardList from './components/Card';
import Search from './components/Search';
import './App.css';
import logo from './logo.svg';

// Constants
const ITEMS_PER_PAGE = 6;
const BASE_KEY = 'cardsData'; // Key for localStorage

export default function Cards() {
    // State Hooks
    const [cardsData, setCardsData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCard, setEditingCard] = useState({
        card: {},
        isEditing: false,
    });
    const [currentPage, setCurrentPage] = useState(1); // State to manage the current page

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

    // Derived pagination values
    const indexOfLastCard = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstCard = indexOfLastCard - ITEMS_PER_PAGE;
    const currentCards = cardsData?.slice(indexOfFirstCard, indexOfLastCard);

    // Effect Hook for initial data fetch
    useEffect(() => {
        // Function to provide default data
        const provideDefaultData = () => {
            const defaultData = [
                { id: 1, body: 'This is body 1', footer: '#1' },
                { id: 2, body: 'This is body 2', footer: '#2' },
            ];

            localStorage.setItem(BASE_KEY, JSON.stringify(defaultData));
            setCardsData(defaultData);
        };

        setIsLoading(false);

        try {
            const storedData = localStorage.getItem(BASE_KEY);
            const fetchedData = storedData ? JSON.parse(storedData) : [];

            // Check if there is no data in local storage
            if (fetchedData.length === 0) {
                provideDefaultData();
            } else {
                setCardsData(fetchedData);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Timer function for clearing errors
    const clearErrorTimer = () => {
        setTimeout(() => {
            setError(null);
        }, 3000);
    };

    // Fetch data function
    const fetchData = (forceFetch = false) => {
        setIsLoading(false);

        try {
            // Check if data fetching is needed (either forced or not loaded)
            if (forceFetch || !isLoading) {
                const storedData = localStorage.getItem(BASE_KEY);
                const fetchedData = storedData ? JSON.parse(storedData) : [];

                setCardsData(fetchedData);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(true);
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
    const removeCard = (id) => {
        try {
            const updatedCardsData = cardsData.filter((card) => card.id !== id);
            setCardsData(updatedCardsData);
            localStorage.setItem(BASE_KEY, JSON.stringify(updatedCardsData));
            showToast('Card deleted successfully!');
        } catch (e) {
            setError(e.message);
            clearErrorTimer();
        }
    };

    // Add Card function
    const addCard = (newCard) => {
        try {
            const addedCard = { ...newCard, id: cardsData.length + 1 };
            const updatedData = [...cardsData, addedCard];
            setCardsData(updatedData);
            localStorage.setItem(BASE_KEY, JSON.stringify(updatedData));
            showToast('Card added successfully!');
        } catch (e) {
            setError(e.message);
            clearErrorTimer();
        }
    };

    // Edit Card function
    const editCard = (id, updatedCard) => {
        try {
            const editedCardIndex = cardsData.findIndex((card) => card.id === id);
            const updatedData = [...cardsData];
            updatedData[editedCardIndex] = { ...cardsData[editedCardIndex], ...updatedCard };

            setCardsData(updatedData);
            localStorage.setItem(BASE_KEY, JSON.stringify(updatedData));
            showToast('Card edited successfully!');
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
                const filteredCards = cardsData.filter((card) => card.body.includes(searchTerm));
                setCardsData(filteredCards);
                localStorage.setItem(BASE_KEY, JSON.stringify(filteredCards));
            }
        } catch (e) {
            setError(e.message);
            clearErrorTimer();
        }
    };

    // Function to handle dynamic navigation
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
            </div>
            <div className='App-pagination'>
                {[...Array(Math.ceil(cardsData.length / ITEMS_PER_PAGE))].map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>
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
