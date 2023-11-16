import EditButton from '../../shared/EditButton';
import bodyModule from './Body.module.css';

const Body = ({
  children,
  editIcon,
  editCartHandler,
  item,
}) => {
  return (
    <section className={bodyModule.body}>
      <EditButton
        editCartHandler={editCartHandler}
        item={item}
      >
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
