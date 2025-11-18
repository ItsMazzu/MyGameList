import React from 'react';
import styles from '../../styles/components/ui/SearchBar.module.scss';

const SearchBar = ({ placeholder = "Search for a game...", onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {/* Botão de busca, opcional se a busca for por Enter */}
      {/* <button className={styles.searchButton} onClick={handleSearchClick}>
        🔍
      </button> */}
    </div>
  );
};

export default SearchBar;