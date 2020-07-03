import React from 'react';

const withList = (ItemComponent) => {
  const WithListHOC = ({ list, className }) => {
    const listItems = list.map(item => (
      <li key={item.id}>
        <ItemComponent {...item} />
      </li>
    ));
    return (
      <ul className={className}>
        {listItems}
      </ul>
    );
  };
  WithListHOC.displayName = `WithList(${ItemComponent.name})`;

  return WithListHOC;
};

export default withList;
