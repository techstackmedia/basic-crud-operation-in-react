const EditButton = ({
  children,
  editCartHandler,
  item,
}) => {
  const handleClick = () => {
    editCartHandler(item);
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default EditButton;
