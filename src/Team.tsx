import React from 'react';
import { Team, Player } from './Game';

interface TeamProps {
  team: Team;
  inningsComplete: boolean;
  batter1?: Player;
  batter2?: Player;
  movePlayerUp?: (index: number) => void;
}

const TeamComponent: React.FC<TeamProps> = ({ team, inningsComplete, batter1, batter2, movePlayerUp }) => {

 
  return (
    <div>
      <h2>{team.name}</h2>
      <ul>
        {team.players.map((player, index) => {
          const isCurrentPlayer = player === batter1 || player === batter2;
          const shouldRenderMoveUpLink =
            !inningsComplete &&
            !player.wicket &&
            !isCurrentPlayer &&
            index >= 3; // Updated index check to start from the fourth player (index 3)

          return (
            <li
              key={index}
              className={`${player.wicket ? 'out' : ''} ${isCurrentPlayer ? 'current' : ''}`}
            >
              <span style={player.wicket ? { fontWeight: 'bold' } : {}}>
                {isCurrentPlayer ? (
                  <em>{player.name}</em>
                ) : (
                  player.name
                )}
              </span>{' '}
              - {player.runs}
              {player.wicket ? (
                <span>{player.wicket.description}</span>
              ) : (
                ''
              )}
              <br />
              SR: {player.strikeRate}, Avg: {player.battingAverage}
              {shouldRenderMoveUpLink && (
                <button onClick={() => movePlayerUp && movePlayerUp(index)}>Move Up</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamComponent;