const EditButton = ({ children, item, editCardHandler }) => {
  const handleClick = () => {
    editCardHandler(item);
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default EditButton;
