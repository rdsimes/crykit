import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { createTeams, simulateFirstInnings, simulateDelivery, OverSummary, DeliveryResult, Player, setWicket, InningsResult } from './Game';
import  Over  from './Over';
import Team from './Team';
import Batter from './Batter';
import BatterControls from './BatterControls';
import GameResult from './GameResult';

const game = createTeams();
const firstInnings = simulateFirstInnings(game.team1, game.team2);
let secondInnings: InningsResult = {runs:0, wickets: 0, overs:[], balls: 0};
let battingTeam = game.team2;
let bowlingTeam = game.team1;

let overs = 1;

let deliveries: DeliveryResult[] = [];
let batters = [...battingTeam.players]

function App() {

  const [currentOver, setCurrentOver] = useState<DeliveryResult[]>([]);
  const [lastWicket, setLastWicket] = useState<Player>();
  const [gameOver, setGameOver] = useState(false);
  const movePlayerUp = (index:number) => {
    [batters[index - 1], batters[index]] = [batters[index], batters[index - 1]];
    console.log(batters, index);
  }
  
 
  //const 
  function playNext(){

    if (overs <= 20 && secondInnings.wickets < 10) {
      const batsmanIndex = (overs - 1 + secondInnings.runs) % 2;
      const bowlerIndex = overs % 5;
      const batsman = batters[batsmanIndex];
      const bowler = bowlingTeam.players[bowlerIndex];
      
      const deliveryResult = simulateDelivery(bowler, batsman);
      deliveries.push({ball: secondInnings.balls, bowler: bowler.name, batter: batsman.name, result: deliveryResult});
      setCurrentOver([...deliveries]);
 
      if (deliveryResult === 'out') {
        setLastWicket(batsman);
        setWicket(batsman, bowler);
        batters.splice(batsmanIndex, 1);
        secondInnings.wickets++;
      } else {
        batsman.runs += Number(deliveryResult);
        
        secondInnings.runs += Number(deliveryResult);
      }

      batsman.ballsFaced++;
      batsman.inningsStrikeRate = (batsman.runs / batsman.ballsFaced)*100;

      secondInnings.balls++;
      if (secondInnings.runs > firstInnings.runs || secondInnings.balls >= 20*6 || secondInnings.wickets >= 10){
        setGameOver(true);
      }

      if (secondInnings.balls % 6 === 0 || gameOver) {
        secondInnings.overs.push({
          bowler: bowler.name, 
          runs: deliveries.map(d => d.result === "out" ? 0 : Number(d.result)).reduce((sum, runs) => sum+runs),
          deliveries: deliveries,
          inningsRuns: secondInnings.runs,
          inningsWickets: secondInnings.wickets,
          over: overs
        });
        deliveries = [];
        overs++;
      }
    }
  }

  return (
    <>
<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <a className="navbar-brand" href="#">Live Cricket Score</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <a className="nav-link" href="#">Live Score</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Commentary</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Highlights</a>
      </li>
    </ul>
  </div>
</nav>
<div className="container mt-5">
  <div className="row">
    <div className="col-md-4">
      <h4>Scoreboard</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Batting</th>
            <th>Runs</th>
            <th>Overs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{game.team1.name}</td>
            <td>{firstInnings.runs}/{firstInnings.wickets}</td>
            <td>{firstInnings.overs.length}</td>
          </tr>
          <tr>
            <td><strong>{game.team2.name}</strong></td>
            <td>{secondInnings.runs}/{secondInnings.wickets}</td>
            <td>{overs}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="col-md-8">
      <h4>Match Status</h4>
      <p>Overs: {overs}.{currentOver.length}</p>
      <p>Target: {(firstInnings.runs+1)}</p>
      {lastWicket?(
      <p>Last Wicket: <Batter batter={lastWicket}/></p>
      ):null}
      <div><h4>Current batters:</h4> 
        <Batter batter={batters[0]} />  <BatterControls batter={batters[0]} /> 
        <Batter batter={batters[1]} /> <BatterControls batter={batters[1]} />
        </div>
    </div>
  </div>
</div>
    <div className="container mt-5">
      <div className='row'>
        {gameOver?(
          <GameResult firstInnings = {firstInnings} secondInnings = {secondInnings} />
        ):(
          <button onClick={playNext}>Next ball</button>
        )}
        
      </div>
      <div className='row'>
      <div className="col-md-8">
        <Over over={overs} deliveries={currentOver}></Over>
        {secondInnings.overs.reverse().map((over) => (
            <div>  
            <h4> Over {over.over}</h4>
            <div className="row mb-2">
              <div className="col-md-2 font-weight-bold">Bowler: {over.bowler}</div>
              <div className="col-md-2 font-weight-bold">Runs: {over.runs}</div>
              <div className="col-md-2 font-weight-bold">Wickets</div>
            </div>   
            <Over over={over.over} deliveries={over.deliveries} />   
            </div>
          ))}
       </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {firstInnings.overs.slice().reverse().map((over) => (
          <div>  
            <h4> Over {over.over}</h4>
            <div className="row mb-2">
              <div className="col-md-2 font-weight-bold">Bowler: {over.bowler}</div>
              <div className="col-md-2 font-weight-bold">Runs: {over.runs}</div>
              <div className="col-md-2 font-weight-bold">Wickets</div>
            </div>   
            <Over over={over.over} deliveries={over.deliveries} />   
            </div>
           ))}
          </div>
          <div className="col-md-4">
            <h1>Teams</h1>
            <Team team={game.team1} inningsComplete={true} />
            <Team team={game.team2} inningsComplete={false} batter1={batters[0]} batter2={batters[1]} movePlayerUp = {movePlayerUp}/>
          </div>
        </div>
      </div>
     
    </>
  );
}

export default App;
