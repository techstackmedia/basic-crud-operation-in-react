const EditButton = ({
  children,
  editCardHandler,
  item,
}) => {
  const handleClick = () => {
    editCardHandler(item);
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default EditButton;
