const RemoveButton = ({ children, id, removeCard }) => {
    const handleClick = () => {
      removeCard(id);
    };
  
    return <button onClick={handleClick}>{children}</button>;
  };
  
  export default RemoveButton;