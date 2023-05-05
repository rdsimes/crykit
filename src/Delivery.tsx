import React from 'react';
import { DeliveryResult } from './Game';

interface DeliveryProps {
  delivery: DeliveryResult;
}

const Delivery: React.FC<DeliveryProps> = ({ delivery }) => {
    return (
        <>
           <span className="badge badge-primary badge-pill">14</span>
{delivery.result === 'out' ? <div className='out'>OUT</div> : 
<div> {delivery.result} </div>}
        
        {delivery.bowler} to {delivery.batter}
        </>
    );
}

export default Delivery;