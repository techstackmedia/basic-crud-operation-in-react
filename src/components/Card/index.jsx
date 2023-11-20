import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import { useEffect, useState } from 'react';
import deleteIcon from '../../images/delete-icon.png';
import editIcon from '../../images/edit-icon.png';

const Card = ({ item, removeCard, id, cardEdit, showToast, editCardHandler }) => {
  const [postContent, setPostContent] = useState(item.body ?? '');

  useEffect(() => {
    if (cardEdit.isEditing === true && cardEdit.card.id === id) {
      setPostContent(cardEdit.card.body);
      showToast('Card body editing mode!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardEdit, id, setPostContent]);

  const handleTextareaChange = (e) => {
    setPostContent(e.target.value)
  }

  const handleSaveClick = () => {
    editCardHandler({ ...item, body: postContent });
    showToast('Card edited successfully');
  }

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
        item={item}
        cardEdit={cardEdit}
        editCardHandler={editCardHandler}
        id={id}
        editIcon={
          editIcon ??
          'https://img.icons8.com/material-rounded/24/create-new.png'
        }
      >
        {cardEdit.isEditing === true && cardEdit.card.id === id ? (
          <>
            <textarea
              value={postContent}
              onChange={handleTextareaChange}
            />
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
