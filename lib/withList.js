import React from 'react';

const withList = (ItemComponent) => {
  const WithListHOC = (props) => {
    const listItems = props.list.map(item => (
      <li key={item.id}>
        <ItemComponent {...item} />
      </li>
    ));
    return (
      <ul>
        {listItems}
      </ul>
    );
  };
  WithListHOC.displayName = `WithList(${ItemComponent.name})`;

  return WithListHOC;
};

export default withList;
