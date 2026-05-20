import React, { useState } from 'react';
import { INVEST_CARDS } from '../constants';
import { calcInvestables } from '../utils';

const QUIZ_QUESTIONS = [
  { id: 'q1', question: 'How long can you leave this money untouched?', options: ['Under 1 year', '1–3 years', '3–10 years', '10+ years'] },
  { id: 'q2', question: 'If your investment dropped 20% temporarily, you would…', options: ['Sell immediately', 'Feel uncomfortable but hold', 'Feel completely fine'] },
  { id: 'q3', question: 'Your primary goal is…', options: ['Emergency cushion', 'Grow wealth', 'Retirement', 'Specific purchase'] },
  { id: 'q4', question: 'Do you have 3 months of expenses already saved?', options: ['Yes', 'Not yet'] },
  { id: 'q5', question: 'Have you invested before?', options: ['Yes', 'No — I\'m just starting'] },
];

function RiskDots({ level }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= level ? 'var(--accent)' : 'var(--border-mid)', display: 'inline-block' }} />
      ))}
    </div>
  );
}

function PathwayCard({ card }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${card.icon}`} aria-hidden="true" style={{ fontSize: 17, color: 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{card.title}</div>
          <RiskDots level={card.risk} />
        </div>
        <a href={card.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Learn more →</a>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 10 }}>{card.description}</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[['Return', card.returns], ['Minimum', card.minimum], ['Horizon', card.horizon]].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        ℹ This is educational information, not financial advice. Consult a qualified adviser before investing.
      </div>
    </div>
  );
}

export default function InvestScore({ allocations, totalIncome, primaryCurrency, investProfile, setInvestProfile }) {
  const { investablePct, investableAmount, score } = calcInvestables(allocations, totalIncome);
  const savingsPct = parseFloat(allocations.savings) || 0;
  const loansPct = parseFloat(allocations.loans) || 0;
  const [quizAnswers, setQuizAnswers] = useState({});
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [lastQ, setLastQ] = useState('');

  const allAnswered = QUIZ_QUESTIONS.every(q => quizAnswers[q.id]);

  const handleCompleteQuiz = () => {
    const { assignProfile } = require('../utils');
    setInvestProfile({ profile: assignProfile(quizAnswers), answers: quizAnswers });
  };

  const handleAsk = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true); setAiError(''); setAiAnswer(''); setLastQ(aiQuestion);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 600,
          system: `You are a financial literacy assistant for BudgetFQ. Help users understand personal finance concepts. Do NOT give specific investment recommendations or regulated financial advice. Explain concepts using the user's actual budget numbers. Keep answers under 200 words. Plain language only.\n\nUser's budget:\n- Monthly income: ${primaryCurrency}${Math.round(totalIncome)}\n- Investable: ${primaryCurrency}${Math.round(investableAmount)}/month\n- Profile: ${investProfile?.profile || 'Not assessed'}\n- Savings: ${savingsPct}%\n- Loans: ${loansPct}%\n- Emergency fund: ${investProfile?.answers?.q4 === 'Yes' ? 'Yes' : 'Not yet'}`,
          messages: [{ role: 'user', content: aiQuestion }]
        })
      });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      setAiAnswer(text || ''); setAiQuestion('');
    } catch (e) {
      setAiError(e.message === 'api' ? '⚠ The AI adviser is temporarily unavailable.' : '⚠ Could not reach the AI. Check your connection.');
    } finally { setAiLoading(false); }
  };

  const monthsToEmergency = investProfile?.answers?.q4 === 'Not yet' && totalIncome > 0
    ? Math.ceil(((totalIncome * (100 - savingsPct) / 100) * 3) / Math.max(1, (totalIncome * savingsPct / 100)))
    : null;

  return (
    <div>
      {/* Score hero */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `conic-gradient(var(--accent) ${score * 3.6}deg, var(--border) 0deg)`, transition: 'background 0.4s ease' }}>
          <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 1 }}>/100</div>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)', lineHeight: 1 }}>
            {totalIncome ? primaryCurrency + Math.round(investableAmount).toLocaleString() : '—'}
            <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-faint)' }}> /month</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 5 }}>{investablePct.toFixed(1)}% of income safely investable</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
            background: score >= 70 ? 'var(--accent-light)' : score >= 30 ? 'var(--amber-light)' : 'var(--red-light)',
            border: `1px solid ${score >= 70 ? 'var(--accent-border)' : score >= 30 ? 'var(--amber-border)' : 'var(--red-border)'}`,
            color: score >= 70 ? 'var(--accent-text)' : score >= 30 ? 'var(--amber-text)' : 'var(--red-text)',
          }}>
            {score >= 70 ? '✓ Strong position' : score >= 30 ? '~ Moderate position' : '⚠ Tight budget'}
          </div>
        </div>
      </div>

      {/* Projections */}
      {totalIncome > 0 && investableAmount > 0 ? (
        <>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>Projected growth · 7% avg/yr compounded</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {[1, 5, 10, 20].map(yr => {
              const r = 0.07 / 12; const n = yr * 12;
              const fv = r > 0 ? investableAmount * ((Math.pow(1 + r, n) - 1) / r) : investableAmount * n;
              return (
                <div key={yr} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5 }}>{yr} year{yr > 1 ? 's' : ''}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--accent)' }}>{primaryCurrency}{Math.round(fv).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Add more income or reduce allocations to unlock projections.
        </div>
      )}

      {/* Tips */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 12 }}>How to improve your score</div>
        {['Increasing your savings allocation directly raises this score','Paying off loans has the highest per-percentage impact','A 5% emergency buffer is already factored into your score','Unallocated income counts toward your investable pool'].map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-body)', alignItems: 'flex-start', marginBottom: i < 3 ? 10 : 0 }}>
            <i className="ti ti-arrow-up-right" aria-hidden="true" style={{ fontSize: 14, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />{tip}
          </div>
        ))}
      </div>

      {/* Profile quiz or pathway cards */}
      {!investProfile ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Investment Profile Quiz</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Answer 5 quick questions to see investment options matched to your situation.</div>
          {QUIZ_QUESTIONS.map(q => (
            <div key={q.id} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-body)', marginBottom: 8 }}>{q.question}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {q.options.map(opt => (
                  <button key={opt} onClick={() => setQuizAnswers(a => ({ ...a, [q.id]: opt }))}
                    style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${quizAnswers[q.id] === opt ? 'var(--accent)' : 'var(--border)'}`, background: quizAnswers[q.id] === opt ? 'var(--accent-light)' : 'var(--bg-input)', color: quizAnswers[q.id] === opt ? 'var(--accent-text)' : 'var(--text-body)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', fontWeight: quizAnswers[q.id] === opt ? 600 : 400, transition: 'all 0.15s' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {allAnswered && <button onClick={handleCompleteQuiz} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>Complete profile →</button>}
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Investment options · </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textTransform: 'capitalize' }}>{investProfile.profile} profile</span>
            </div>
            <button onClick={() => setInvestProfile(null)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>Retake quiz</button>
          </div>

          {investProfile.answers?.q4 === 'Not yet' && totalIncome > 0 && (
            <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber-border)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--amber-text)', marginBottom: 4 }}>🛡 Build your emergency fund first</div>
              <div style={{ fontSize: 13, color: 'var(--amber-text)', lineHeight: 1.6 }}>
                Before investing, financial experts recommend saving 3 months of expenses. At your current savings rate of {primaryCurrency}{Math.round(totalIncome * savingsPct / 100)}/month, you'll reach your target in approximately {monthsToEmergency} months. This protects you from selling investments at the wrong time.
              </div>
            </div>
          )}

          {investableAmount < 20 && totalIncome > 0 && (
            <div style={{ background: 'var(--blue-light)', border: '1px solid #BFDBFE', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#1e40af' }}>
              Your current investable amount is {primaryCurrency}{Math.round(investableAmount)}/month. Many platforms accept as little as €10. Start small and increase as your budget allows.
            </div>
          )}

          {(INVEST_CARDS[investProfile.profile] || []).map((card, i) => <PathwayCard key={i} card={card} />)}
        </div>
      )}

      {/* AI Explainer */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Ask the AI adviser</div>
        {lastQ && aiAnswer && (
          <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Q: {lastQ}</div>
            <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.7 }}>{aiAnswer}</div>
          </div>
        )}
        {aiError && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{aiError}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything — e.g. Should I pay off my loan or start investing?" aria-label="Ask the AI investment adviser"
            style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
          <button onClick={handleAsk} disabled={aiLoading || !aiQuestion.trim()} aria-label="Ask AI adviser"
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: aiLoading ? 'wait' : 'pointer', opacity: aiLoading || !aiQuestion.trim() ? 0.6 : 1 }}>
            {aiLoading ? '...' : 'Ask'}
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 12, lineHeight: 1.5 }}>
          ℹ BudgetFQ's AI adviser provides general financial education only. It is not a licensed financial adviser. Always consult a qualified professional before making investment decisions.
        </div>
      </div>
    </div>
  );
}
