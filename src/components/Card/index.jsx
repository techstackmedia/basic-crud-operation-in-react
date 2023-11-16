import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import { useEffect, useState } from 'react';
import deleteIcon from '../../images/delete-icon.png';
import editIcon from '../../images/edit-icon.png';

const Card = ({ item, removeCard, id, editCard, editCartHandler, cardEdit }) => {
  const [postContent, setPostContent] = useState(item.body ?? '');
  useEffect(() => {
    if (cardEdit.isEditable === true && cardEdit.item.id === id) {
      setPostContent(cardEdit.item.body);
    }
  }, [cardEdit, id, setPostContent])

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
        editCard={editCard}
        editCartHandler={editCartHandler}
        item={item}
        editIcon={
          editIcon ??
          'https://img.icons8.com/material-rounded/24/create-new.png'
        }
      >
        {cardEdit.isEditable === true && cardEdit.item.id === id ? (
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        ) : (
          postContent
        )}
      </Body>
      <Footer>{item.footer}</Footer>
    </div>
  );
};

export default Card;
