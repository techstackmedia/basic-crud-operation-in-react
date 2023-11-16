const EditButton = ({ children, id, editCard }) => {
  const handleClick = () => {
    editCard(id);
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default EditButton;
