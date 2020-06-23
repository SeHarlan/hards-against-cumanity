import React from 'react';

//Text Only Arrays
const withList = (ItemComponent) => {
  const WithListHOC = ({ list }) => {
    const listItems = list.map(item => (
      <li key={item.substring(7)}>
        <ItemComponent text={item} />
      </li>
    ));
    return (
      <ul>
        {listItems}
      </ul>
    )
  }
  WithListHOC.displayName = `WithList(${ItemComponent.name})`;
  return WithListHOC
}

export default withList