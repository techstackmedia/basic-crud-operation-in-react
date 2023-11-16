import { useState } from 'react';

const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <input
      type='search'
      placeholder='Search cards...'
      value={searchTerm}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    />
  );
};

export default Search;
