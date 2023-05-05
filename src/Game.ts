export interface Player {
    name: string;
    battingAverage: number;
    strikeRate: number;
    bowlingStrikeRate: number;
    matchesPlayed: number;
    bowlingAverage: number;
    wickets: number;
    economy: number;
    runs: number;
    ballsFaced: number;
    ballsBowled: number;
    caution: number;
    inningsStrikeRate: number;
    singles: SinglesPreference;
  }
  
  export type SinglesPreference = "Normal" | "Avoid" | "Prefer";

  export interface Team {
    name: string;
    players: Player[];
  }
   

  function generatePlayer(): Player {
    const name = makeName(); // generate a random name for the player
    const battingAverage = Math.round((Math.random() * 60 + 10)*100)/100; // generate a random batting average between 10 and 70
    const strikeRate = Math.round((Math.random() * 100 + 50)*100)/100; // generate a random strike rate between 50 and 150
    const bowlingStrikeRate = Math.round((Math.random() * 100)*100)/100; // generate a random strike rate between 50 and 150
    const matchesPlayed = Math.floor(Math.random() * 100); // generate a random number of matches played between 0 and 99
    const bowlingAverage = Math.random() * 60 + 20; // generate a random bowling average between 20 and 80
    const wickets = Math.floor(Math.random() * 100); // generate a random number of wickets taken between 0 and 99
    const economy = Math.random() * 10 + 3; // generate a random economy rate between 3 and 13
  
    return {
      name,
      battingAverage,
      strikeRate,
      bowlingStrikeRate,
      matchesPlayed,
      bowlingAverage,
      wickets,
      economy,
      runs: 0,
      ballsFaced: 0,
      ballsBowled: 0,
      caution: 50,
      inningsStrikeRate: 0,
      singles: "Normal"
    };
  }
  
  function generateTeam(name: string, size: number): Team {
    const players: Player[] = [];
  
    for (let i = 0; i < size; i++) {
      players.push(generatePlayer());
    }
  
      // sort the players in descending order based on their batting average
    players.sort((a, b) => b.battingAverage - a.battingAverage);

    return {
      name,
      players,
    };
  }
  
  function makeName(): string {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = [
      'b',
      'c',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'm',
      'n',
      'p',
      'q',
      'r',
      's',
      't',
      'v',
      'w',
      'x',
      'y',
      'z',
    ];
    const nameLength = Math.floor(Math.random() * 3 + 6); // generate a name between 6 and 10 characters long
    let name = '';
  
    for (let i = 0; i < nameLength; i++) {
      if (i % 2 === 0) {
        // add a consonant
        const index = Math.floor(Math.random() * consonants.length);
        name += consonants[index];
      } else {
        // add a vowel
        const index = Math.floor(Math.random() * vowels.length);
        name += vowels[index];
      }
    }
  
    return name.charAt(0).toUpperCase() + name.slice(1); // capitalize the first letter of the name
  }
  
  export function createTeams(){
    const team1: Team = generateTeam(makeName(), 11);
    const team2: Team = generateTeam(makeName(), 11);
    return { team1, team2 }
  }

  type ScoreMap = { [key: number]: number };


  function weightedRand(spec: ScoreMap) {
    var i, j, table: number[] =[];
    for (i in spec) {
      // The constant 10 below should be computed based on the
      // weights in the spec for a correct and optimal table size.
      // E.g. the spec {0:0.999, 1:0.001} will break this impl.
      for (j=0; j<spec[i]*10; j++) {
        table.push(parseInt(i));
      }
    }
    return function() {
      return table[Math.floor(Math.random() * table.length)];
    }
  }
  var rand012 = weightedRand({0:0.3, 1:0.2, 2:0.2, 3:0.1, 4:0.3, 6:0.1});

  export type Outcome = 0 | 1 | 2 | 3 | 4 | 6 | 'out';

  function getDeliveryOutcomeProbabilities(batsman: Player, bowler: Player): Record<Outcome, number> {
    const outcomeProbabilities: Record<Outcome, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 6: 0, out: 0 };
  
    // Calculate the probability of the batsman getting out
    const outProbability = Math.max(0, Math.min(1, (1 - batsman.inningsStrikeRate) + (batsman.battingAverage / 100) - (bowler.strikeRate / 100)));
    outcomeProbabilities.out = outProbability;
  
    // Calculate the probabilities of the other outcomes based on the batsman's and bowler's stats
    const nonOutProbabilitiesTotal = 1 - outProbability;
    const averageScoreProbability = batsman.battingAverage / 100;
    const strikeRateBonus = batsman.strikeRate / 100 - bowler.bowlingStrikeRate / 100;
    const higherScoringProbability = Math.min(1, Math.max(0, averageScoreProbability + (strikeRateBonus / 2)));
  
    outcomeProbabilities[0] = nonOutProbabilitiesTotal * (1 - higherScoringProbability);
    outcomeProbabilities[1] = nonOutProbabilitiesTotal * (higherScoringProbability * 0.4);
    outcomeProbabilities[2] = nonOutProbabilitiesTotal * (higherScoringProbability * 0.3);
    outcomeProbabilities[3] = nonOutProbabilitiesTotal * (higherScoringProbability * 0.2);
    outcomeProbabilities[4] = nonOutProbabilitiesTotal * (higherScoringProbability * 0.1);
    outcomeProbabilities[6] = nonOutProbabilitiesTotal * (higherScoringProbability * 0.05);
  
    return outcomeProbabilities;
  }

  export function simulateDelivery(batsman: Player, bowler: Player): Outcome {
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    const randomOutcome = Math.random();
  
    let probabilitySum = 0;
    for (const [outcome, probability] of Object.entries(outcomeProbabilities)) {
      probabilitySum += probability;
      if (randomOutcome <= probabilitySum) {
        return outcome as Outcome;
      }
    }
  
    throw new Error('Could not determine delivery outcome');
  }
  
  export function simulateDeliveryOld(bowlingPlayer: Player, battingPlayer: Player): number | 'OUT' {
    const totalScore = rand012(); //Math.floor(Math.random() * 7); // generate a random integer between 0 and 6

    bowlingPlayer.ballsBowled++;
    battingPlayer.ballsFaced++;
      
    if (totalScore === 0) {
      return totalScore;
    }
  
    const battingAverageFactor = battingPlayer.battingAverage / bowlingPlayer.bowlingAverage;
    const strikeRateFactor = battingPlayer.strikeRate / bowlingPlayer.economy;
    const probabilityOfScoring = (battingAverageFactor + strikeRateFactor) / 15;

    if (Math.random() > probabilityOfScoring) {
      return 'OUT';
    }
  
    return totalScore;
  }

  export type GameResult = {
    winner: Team | null;
    margin: number;
    deliveries: DeliveryResult[]
  };

  export type DeliveryResult = {
    ball: number,
    batter: string,
    bowler: string,
    result: Outcome
  }

  type FirstInningsResult = {
    runs: number,
    wickets: number,
    overs: OverSummary[]
  };

  export type OverSummary = {
    runs: number,
    bowler: string,
    over: number,
    inningsRuns: number,
    inningsWickets: number,
    deliveries: DeliveryResult[]
  }
  
  
  export function simulateFirstInnings(team: Team, team2: Team): FirstInningsResult {
    let wickets = 0;
    let overs = 1;
    let runs = 0;
    let balls = 0;
    let overSummaries: OverSummary[] = [];
    let deliveries: DeliveryResult[] = [];
    let batters = [...team.players]
  
    while (overs <= 20 && wickets < 10) {
      const batsmanIndex = (overs - 1 + runs) % 2;
      const bowlerIndex = overs % 5;
      const batsman = batters[batsmanIndex];
      const bowler = team2.players[bowlerIndex];

      const deliveryResult = simulateDelivery(bowler, batsman);
      deliveries.push({ball: balls, bowler: bowler.name, batter: batsman.name, result: deliveryResult});
   
      if (deliveryResult === 'out') {
        batters.splice(batsmanIndex, 1);
        wickets++;
      } else {
        batsman.runs += Number(deliveryResult);
        runs += Number(deliveryResult);
      }

      if (balls % 6 === 5) {
        overSummaries.push({
          bowler: bowler.name, 
          runs: deliveries.map(d => d.result === "out" ? 0 : Number(d.result)).reduce((sum, runs) => sum+runs),
          deliveries: deliveries,
          inningsRuns: runs,
          inningsWickets: wickets,
          over: overs
        });
        deliveries = [];
        overs++;
      }
  
      balls++;
    }
  
    return {
      runs,
      wickets,
      overs: overSummaries
    };
  } 
  