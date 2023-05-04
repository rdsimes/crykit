import React from 'react';
import { Player } from './Game';

interface BatterProps {
  batter: Player;
}

let sr = (batter: Player) => Math.round(batter.runs / Math.max(batter.ballsFaced, 1) * 10000)/100;

const Batter: React.FC<BatterProps> = ({ batter }) => {
    return (
        <>
           <div> {batter.name} - {batter.runs} ({batter.ballsFaced}) SR:{sr(batter)} </div>
        
       
        </>
    );
}

export default Batter;