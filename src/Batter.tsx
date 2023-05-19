import React from 'react';
import { Player } from './Game';

interface BatterProps {
  batter: Player;
}

const Batter: React.FC<BatterProps> = ({ batter }) => {
    return (
        <>
           <div> {batter.name} - {batter.runs} ({batter.ballsFaced}) SR:{batter.inningsStrikeRate} </div>
        
       
        </>
    );
}

export default Batter;