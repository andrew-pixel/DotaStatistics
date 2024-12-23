
import React from 'react';
import './components.css';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';


function ItemIcon({ itemCode } : {itemCode:number}) {
  const { icons = [], loading, error } = useSelector((state: RootState) => state.itemIcons);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const itemIcon = icons.find(icon => itemCode === icon.itemid )?.url
  return (
    <div className="item-icon">
      <img src={itemIcon} />
    </div>
  );
}

export default ItemIcon;