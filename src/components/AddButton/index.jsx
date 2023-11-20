import addIcon from '../../images/add-icon.png';

const AddButton = ({ data, addCard }) => {
  const sortedData = data.sort((a, b) => {
    return a.id - b.id;
  });
  const item = sortedData[sortedData.length - 1];
  const findId = () => {
    return data.find((item, index) => {
      return item.id !== index + 1;
    });
  };
  const omittedData = findId();
  const oldData = {
    id: omittedData?.id - 1,
    body: `This is body ${omittedData?.id - 1}`,
    footer: `#${omittedData?.id - 1}`,
  };
  const newData = {
    id: item?.id + 1 || -1,
    body: item?.body?.replace(`${item.id}`, `${item.id + 1}`),
    footer: item?.footer?.replace(`${item.id}`, `${item.id + 1}`),
  };
  const handleClick = () => {
    data.includes(oldData) === false && omittedData?.id !== undefined
      ? addCard(oldData)
      : addCard(newData);
  };

  return (
    <button className='addButton' onClick={handleClick}>
      <span>Add</span>
      <img
        src={addIcon ?? 'https://img.icons8.com/color/ios/50/add--v1.png'}
        width={16}
        height={16}
        alt='add icon'
      />
    </button>
  );
};

export default AddButton;