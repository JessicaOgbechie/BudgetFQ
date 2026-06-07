import { assignProfile } from '../../utils';

describe('assignProfile', () => {
  test('returns cautious for short horizon, panic seller, no experience', () => {
    const answers = {
      q1: 'Under 1 year',
      q2: 'Sell immediately',
      q3: 'Emergency cushion',
      q4: 'Not yet',
      q5: 'No — I\'m just starting',
    };
    expect(assignProfile(answers)).toBe('cautious');
  });

  test('returns growth for long horizon, comfortable with drops, experienced', () => {
    const answers = {
      q1: '10+ years',
      q2: 'Feel completely fine',
      q3: 'Grow wealth',
      q4: 'Yes',
      q5: 'Yes',
    };
    expect(assignProfile(answers)).toBe('growth');
  });

  test('returns balanced for mid-range answers', () => {
    const answers = {
      q1: '3–10 years',
      q2: 'Feel uncomfortable but hold',
      q3: 'Specific purchase',
      q4: 'Yes',
      q5: 'No — I\'m just starting',
    };
    expect(assignProfile(answers)).toBe('balanced');
  });

  test('retirement goal adds 1 point toward growth', () => {
    const base = {
      q1: '1–3 years', q2: 'Sell immediately',
      q4: 'Not yet', q5: 'No — I\'m just starting',
    };
    const withRetirement = { ...base, q3: 'Retirement' };
    const withCushion = { ...base, q3: 'Emergency cushion' };
    // retirement should score higher
    const retirementProfile = assignProfile(withRetirement);
    const cushionProfile = assignProfile(withCushion);
    // Both may be cautious/balanced, but retirement >= cushion in score
    const order = ['cautious', 'balanced', 'growth'];
    expect(order.indexOf(retirementProfile)).toBeGreaterThanOrEqual(order.indexOf(cushionProfile));
  });

  test('always returns one of the three valid profile strings', () => {
    const validProfiles = ['cautious', 'balanced', 'growth'];
    const answers = {
      q1: '10+ years', q2: 'Feel completely fine',
      q3: 'Grow wealth', q4: 'Yes', q5: 'Yes',
    };
    expect(validProfiles).toContain(assignProfile(answers));
  });

  test('score boundary: score of 3 returns balanced not cautious', () => {
    // q1='1–3 years' (+1), q4='Yes' (+1), q5='Yes' (+1) = score 3 → balanced
    const answers = {
      q1: '1–3 years',
      q2: 'Sell immediately',
      q3: 'Emergency cushion',
      q4: 'Yes',
      q5: 'Yes',
    };
    expect(assignProfile(answers)).toBe('balanced');
  });

  test('score boundary: score of 6 returns growth not balanced', () => {
    // q1='10+ years' (+2), q2='Feel completely fine' (+2), q3='Grow wealth' (+1), q4='Yes' (+1) = 6 → growth
    const answers = {
      q1: '10+ years',
      q2: 'Feel completely fine',
      q3: 'Grow wealth',
      q4: 'Yes',
      q5: 'No — I\'m just starting',
    };
    expect(assignProfile(answers)).toBe('growth');
  });
});
