import EditButton from '../../shared/EditButton';
import bodyModule from './index.module.css';

const Body = ({
  children,
  editIcon,
  editCardHandler,
  item,
}) => {
  return (
    <section className={bodyModule.body}>
      <EditButton
        editCardHandler={editCardHandler}
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
