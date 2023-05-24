import React from 'react';
import { Team } from './Game';

interface TeamProps {
  team: Team;
}

const TeamComponent: React.FC<TeamProps> = ({ team }) => {
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
