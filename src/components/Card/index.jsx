import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import deleteIcon from '../../images/delete-icon.png';
import editIcon from '../../images/edit-icon.png';

const Card = ({
  item,
  removeCard,
  id,
  editCardHandler,
  cardEdit,
  showToast
}) => {
  const [postContent, setPostContent] = useState(item.body ?? '');

  // Optionally Manage Side Effect Hook
  // UseEffect to synchronize post content with the edited card's body when editing is active
  useEffect(() => {
    if (cardEdit.isEditing === true) {
      setPostContent(cardEdit.card.body);
      showToast('Card body editing mode!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardEdit, id, setPostContent]);

  const handleTextareaChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleSaveClick = () => {
    editCardHandler({ ...item, body: postContent });
    showToast('Card edited successfully!')
  };

  return (
    <div className='card'>
      <Header
        removeCard={removeCard}
        id={id}
        deleteIcon={
          deleteIcon ?? 'https://img.icons8.com/sf-regular/48/delete.png'
        }
      />
      <Body
        editCardHandler={editCardHandler}
        item={item}
        editIcon={
          editIcon ??
          'https://img.icons8.com/material-rounded/24/create-new.png'
        }
      >
        {cardEdit.isEditing === true && cardEdit.card.id === id ? (
          <>
            <textarea value={postContent} onChange={handleTextareaChange} />
            <button className='saveButton' onClick={handleSaveClick}>
              Save
            </button>
          </>
        ) : (
          postContent
        )}
      </Body>
      <Footer>{item.footer}</Footer>
    </div>
  );
};

export default Card;
