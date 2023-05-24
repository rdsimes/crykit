
import { getDeliveryOutcomeProbabilities, setWicket, Player, getOutProbability } from './Game';


const defaultPlayer: Player = {
  name: "",
  battingAverage: 0,
  strikeRate: 0,
  bowlingStrikeRate: 0,
  matchesPlayed: 0,
  bowlingAverage: 0,
  wickets: 0,
  economy: 0,
  runs: 0,
  ballsFaced: 0,
  ballsBowled: 0,
  caution: 0,
  inningsStrikeRate: 0,
  singles: "Normal",
};

function createPlayer(player: Partial<Player>): Player {
  return { ...defaultPlayer, ...player };
}

describe('getOutProbability', () => {
  const batsman: Player = createPlayer({
    name: 'Sachin Tendulkar',
    battingAverage: 53.78,
    inningsStrikeRate: 86.23,
    strikeRate: 86.23
    
  });

  const bowler: Player = createPlayer({
    name: 'Glenn McGrath',
    bowlingStrikeRate: 22.02,
  });

  it('returns a probabillity close to 0', () => {
    const outProbability = getOutProbability(batsman, bowler);
    expect(outProbability).toBeCloseTo(0, 1);
    expect(outProbability).toBeGreaterThan(0);
   
  });
});

describe('setWicket', () => {
  const batter: Player = createPlayer({
    name: 'Sachin Tendulkar',
    battingAverage: 53.78,
    inningsStrikeRate: 86.23,
    strikeRate: 86.23
    
  });
  
  const bowler: Player = createPlayer({
    name: 'Glenn McGrath',
    bowlingStrikeRate: 22.02,
  });
  setWicket(batter, bowler);
  expect(batter.wicket?.bowler).toBe(bowler);
});
describe('getDeliveryOutcomeProbabilities', () => {
  const batsman: Player = createPlayer({
    name: 'Sachin Tendulkar',
    battingAverage: 53.78,
    inningsStrikeRate: 86.23,
    strikeRate: 80
  });

  const bowler: Player = createPlayer({
    name: 'Glenn McGrath',
    bowlingStrikeRate: 22.02,
  });

  it('returns probabilities for different outcomes of the delivery', () => {
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    expect(outcomeProbabilities).toHaveProperty('0', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('1', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('2', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('3', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('4', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('6', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('out', expect.any(Number));
    const sum = Object.values(outcomeProbabilities).reduce((acc, cur) => acc + cur, 0);
    expect(sum).toBeCloseTo(1);
    console.log(outcomeProbabilities);
   
  });

  it('returns lower probabilities for higher-scoring outcomes', () => {
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    expect(outcomeProbabilities['6']).toBeLessThan(outcomeProbabilities['4']);
    expect(outcomeProbabilities['4']).toBeLessThan(outcomeProbabilities['3']);
    expect(outcomeProbabilities['3']).toBeLessThan(outcomeProbabilities['2']);
    expect(outcomeProbabilities['2']).toBeLessThan(outcomeProbabilities['1']);
    expect(outcomeProbabilities['1']).toBeLessThan(outcomeProbabilities['0']);
  });

  

  it('returns lower probabilities for batsmen with lower averages and confidence', () => {
    const lowAverageBatsman: Player = createPlayer({ ...batsman, battingAverage: 20 });
    const outcomeProbabilitiesLow = getDeliveryOutcomeProbabilities(lowAverageBatsman, bowler);
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    expect(outcomeProbabilitiesLow['out']).toBeGreaterThan(outcomeProbabilities['out']);
    expect(outcomeProbabilitiesLow['6']).toBeLessThan(outcomeProbabilities['6']);
 
  });

  it('returns lower probabilities for bowlers with lower bowling strike rates', () => {
    const lowStrikeRateBowler: Player = { ...bowler, bowlingStrikeRate: 40 };
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, lowStrikeRateBowler);
    expect(outcomeProbabilities['0']).toBeGreaterThan(outcomeProbabilities['1']);
  });
});
