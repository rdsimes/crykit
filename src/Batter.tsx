import React from 'react';
import { Player } from './Game';

interface BatterProps {
  batter: Player;
}

const Batter: React.FC<BatterProps> = ({ batter }) => {
  const formattedStrikeRate = batter.inningsStrikeRate.toFixed(2);

  return (
    <>
      <div>
        {batter.name} - {batter.runs} ({batter.ballsFaced}) SR: {formattedStrikeRate}
      </div>
    </>
  );
};

export default Batter;