import React, { useState } from 'react';
import { Player, SinglesPreference } from './Game';

interface BatterProps {
  batter: Player;
}

const BatterControls: React.FC<BatterProps> = ({ batter }) => {
  const [caution, setCaution] = useState<number>(50);
  const [singlesPreference, setSinglesPreference] = useState<SinglesPreference>("Normal");

  const addCaution = (increment: number) => {
    let newCaution = batter.caution + increment;
    if (newCaution > 100){
      newCaution = 100;
    }

    if (newCaution < 0){
      newCaution = 0;
    }
    batter.caution = newCaution;
    setCaution(newCaution);
  };
  const handleIncrement = () => addCaution(1);
  const handleDecrement = () => addCaution(-1);


  const handleSinglesPreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSinglesPreference(event.target.value as SinglesPreference);
  };
    return (
        <>
           <div> Caution {batter.caution} 
           <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
           Confidence {batter.confidence} Singles 
           
           <label>
          <input type="radio" value="Normal" checked={singlesPreference === "Normal"} onChange={handleSinglesPreferenceChange} />
          Normal
        </label>
        <label>
          <input type="radio" value="Avoid" checked={singlesPreference === "Avoid"} onChange={handleSinglesPreferenceChange} />
          Avoid
        </label>
        <label>
          <input type="radio" value="Prefer" checked={singlesPreference === "Prefer"} onChange={handleSinglesPreferenceChange} />
          Prefer
        </label>
         </div>
        
       
        </>
    );
}

export default BatterControls;