import EditButton from '../../shared/EditButton';
import bodyModule from './Body.module.css';

const Body = ({ children, editCard, id, editIcon }) => {
  return (
    <section className={bodyModule.body}>
      <EditButton id={id} editCard={editCard}>
        <img src={editIcon} width={16} height={16} alt='edit icon' />
      </EditButton>
      <p>{children}</p>
    </section>
  );
};

Body.defaultProps = {
  removeCard: null,
};

export default Body;
