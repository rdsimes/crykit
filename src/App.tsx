import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { createTeams, simulateFirstInnings, simulateDelivery, OverSummary, DeliveryResult, Player } from './Game';
import  Over  from './Over';
import Team from './Team';
import Batter from './Batter';
import BatterControls from './BatterControls';

const game = createTeams();
const result = simulateFirstInnings(game.team1, game.team2);
let battingTeam = game.team2;
let bowlingTeam = game.team1;

let wickets = 0;
let overs = 1;
let runs = 0;
let balls = 0;
let overSummaries: OverSummary[] = [];
let deliveries: DeliveryResult[] = [];
let batters = [...battingTeam.players]

function App() {

  const [currentOver, setCurrentOver] = useState<DeliveryResult[]>([]);
  const [lastWicket, setLastWicket] = useState<Player>();
  const [chasingWickets, setChasingWickets] = useState<number>(0);
  
 
  //const 
  function playNext(){

    if (overs <= 20 && wickets < 10) {
      const batsmanIndex = (overs - 1 + runs) % 2;
      const bowlerIndex = overs % 5;
      const batsman = batters[batsmanIndex];
      const bowler = bowlingTeam.players[bowlerIndex];

      const deliveryResult = simulateDelivery(bowler, batsman);
      console.log(overs, balls, deliveries, currentOver, deliveryResult);
      deliveries.push({ball: balls, bowler: bowler.name, batter: batsman.name, result: deliveryResult});
      setCurrentOver([...deliveries]);
      if (deliveryResult === 'OUT') {
        setLastWicket(batsman);
        batters.splice(batsmanIndex, 1);
        wickets++;
      } else {
        batsman.runs += deliveryResult;
        runs += deliveryResult;
      }

      if (balls % 6 === 5) {
        overSummaries.push({
          bowler: bowler.name, 
          runs: deliveries.map(d => d.result === "OUT" ? 0 : d.result).reduce((sum, runs) => sum+runs),
          deliveries: deliveries,
          inningsRuns: runs,
          inningsWickets: wickets,
          over: overs
        });
        deliveries = [];
        overs++;
      }
  
      balls++;
      console.log(balls);
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
            <td>{result.runs}/{result.wickets}</td>
            <td>{result.overs.length}</td>
          </tr>
          <tr>
            <td>{game.team2.name}</td>
            <td>{runs}/{wickets}</td>
            <td>{overs}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="col-md-8">
      <h4>Match Status</h4>
      <p>Overs: {overs}.{currentOver.length}</p>
      <p>Target: {(result.runs+1)}</p>
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
        <button onClick={playNext}>Next ball</button>
      </div>
      <div className='row'>
      <div className="col-md-8">
        <Over over={overs} deliveries={currentOver}></Over>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {result.overs.map((over) => (
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
            <Team team={game.team1} />
            <Team team={game.team2} />
          </div>
        </div>
      </div>
     
    </>
  );
}

export default App;
