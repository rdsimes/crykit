describe('getDeliveryOutcomeProbabilities', () => {
  const batsman: Player = {
    name: 'Sachin Tendulkar',
    average: 53.78,
    strikeRate: 86.23,
    confidence: 0.8,
  };

  const bowler: Player = {
    name: 'Glenn McGrath',
    bowlingStrikeRate: 22.02,
  };

  it('returns probabilities for different outcomes of the delivery', () => {
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    expect(outcomeProbabilities).toHaveProperty('0', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('1', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('2', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('3', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('4', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('6', expect.any(Number));
    expect(outcomeProbabilities).toHaveProperty('out', expect.any(Number));
  });

  it('returns higher probabilities for higher-scoring outcomes', () => {
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, bowler);
    expect(outcomeProbabilities['6']).toBeGreaterThan(outcomeProbabilities['4']);
    expect(outcomeProbabilities['4']).toBeGreaterThan(outcomeProbabilities['3']);
    expect(outcomeProbabilities['3']).toBeGreaterThan(outcomeProbabilities['2']);
    expect(outcomeProbabilities['2']).toBeGreaterThan(outcomeProbabilities['1']);
    expect(outcomeProbabilities['1']).toBeGreaterThan(outcomeProbabilities['0']);
  });

  it('returns lower probabilities for batsmen with lower averages and confidence', () => {
    const lowAverageBatsman: Player = { ...batsman, average: 20 };
    const lowConfidenceBatsman: Player = { ...batsman, confidence: 0.2 };
    const lowAverageLowConfidenceBatsman: Player = { ...batsman, average: 20, confidence: 0.2 };
    const outcomeProbabilities1 = getDeliveryOutcomeProbabilities(lowAverageBatsman, bowler);
    const outcomeProbabilities2 = getDeliveryOutcomeProbabilities(lowConfidenceBatsman, bowler);
    const outcomeProbabilities3 = getDeliveryOutcomeProbabilities(lowAverageLowConfidenceBatsman, bowler);
    expect(outcomeProbabilities1['0']).toBeGreaterThan(outcomeProbabilities1['1']);
    expect(outcomeProbabilities2['0']).toBeGreaterThan(outcomeProbabilities2['1']);
    expect(outcomeProbabilities3['0']).toBeGreaterThan(outcomeProbabilities3['1']);
    expect(outcomeProbabilities3['0']).toBeGreaterThan(outcomeProbabilities1['0']);
  });

  it('returns lower probabilities for bowlers with lower bowling strike rates', () => {
    const lowStrikeRateBowler: Player = { ...bowler, bowlingStrikeRate: 40 };
    const outcomeProbabilities = getDeliveryOutcomeProbabilities(batsman, lowStrikeRateBowler);
    expect(outcomeProbabilities['0']).toBeGreaterThan(outcomeProbabilities['1']);
  });
});
