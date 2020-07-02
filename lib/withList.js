import React from 'react';
import utilStyles from '../styles/utils.module.css'

const withList = (ItemComponent) => {
  const WithListHOC = (props) => {
    const listItems = props.list.map(item => (
      <li key={item.id}>
        <ItemComponent {...item} />
      </li>
    ));
    return (
      <ul className={utilStyles.list}>
        {listItems}
      </ul>
    );
  };
  WithListHOC.displayName = `WithList(${ItemComponent.name})`;

  return WithListHOC;
};

export default withList;
