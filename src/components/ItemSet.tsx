import React from 'react';
import ItemIcon from './ItemIcon';
import './components.css';


function ItemSet({ items }: { items: number[] }) {

  const [inventoryItems, backpackItems, neutralItem] = [
    items.slice(0, 6),   // First six are inventory items
    items.slice(6, 9),   // Next three are backpack items
    items[9],            // Last one is the neutral item
  ];

  return (
    <div className='itemContainer'>
      <div className="item-set">
        <div className="item-grid">
          {inventoryItems.map((item, index) => (
            <ItemIcon key={index} itemCode={item} />
          ))}
        </div>
        <div className="backpack-grid">
          {backpackItems.map((item, index) => (
            <ItemIcon key={index + 6} itemCode={item} />
          ))}
        </div>

      </div>
      <div className="neutral-item">
        <ItemIcon itemCode={neutralItem} />
      </div>
    </div>
  );
}

export default ItemSet;