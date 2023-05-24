import React from 'react';
import { Team, Player } from './Game';

interface TeamProps {
  team: Team;
 /* batter1: Player;
  batter2: Player;*/
}

const TeamComponent: React.FC<TeamProps> = ({ team/*, batter1, batter2*/ }) => {
  return (
    <div>
      <h2>{team.name}</h2>
      <ul>
        {team.players.map((player, index) => (
          <li key={index} className={player.wicket? 'out' : ''}>
            {player.name} - {player.runs}
            {player.wicket? 
            <><span>{player.wicket.description}</span></>
            :''}
            <br />SR: {player.strikeRate}, Avg: {player.battingAverage}, 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamComponent;
