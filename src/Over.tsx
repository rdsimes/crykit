import React from 'react';
import { DeliveryResult } from './Game';
import Delivery from './Delivery';

interface OverProps {
  over: number,
  deliveries: DeliveryResult[];
}

const Over: React.FC<OverProps> = ({ over, deliveries }) => {
    return (
        <ul className='list-group'>
          {deliveries.slice().reverse().map((delivery, index) => (
            <li key={index} className='list-group-item d-flex justify-content-between align-items-center'>
              <span>{Math.floor(delivery.ball/6)}.{delivery.ball%6+1} </span>
                <Delivery delivery={delivery} />              
            </li>
          ))}
        </ul>
      );
};

export default Over;
