import RemoveButton from '../../shared/RemoveButton.jsx';
import HeaderModule from './Header.module.css';
const Header = ({ removeCard, id, deleteIcon }) => {
  return (
    <header className={HeaderModule.header}>
      <nav>
        <div>
          <RemoveButton id={id} removeCard={removeCard}>
            <img
              src={deleteIcon}
              width={16}
              height={16}
              alt='delete or trash icon'
            />
          </RemoveButton>
        </div>
      </nav>
    </header>
  );
};

export default Header;
