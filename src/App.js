import React, { useState, useEffect, useMemo } from 'react';
import { getDefaultState, currentMonthId } from './constants';
import { calcTotalIncome, calcInvestables, buildSnapshot } from './utils';
import Header from './components/Header';
import IncomeBar from './components/IncomeBar';
import TabBar from './components/TabBar';
import Overview from './components/Overview';
import PriorityBills from './components/PriorityBills';
import InvestScore from './components/InvestScore';
import WhatIfSimulator from './components/WhatIfSimulator';
import ForecastTab from './components/ForecastTab';
import HistoryTab from './components/HistoryTab';
import RatioChecker from './components/RatioChecker';
import AlertBanner from './components/AlertBanner';

const PRIMARY_KEY = 'budgetfq_v1';
const HISTORY_KEY = 'budgetfq_history_v1';

function loadStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
}

export default function App() {
  const [storageAvailable, setStorageAvailable] = useState(true);
  const defaultState = getDefaultState();

  const [incomeSources, setIncomeSources] = useState(defaultState.incomeSources);
  const [primaryCurrency, setPrimaryCurrency] = useState(defaultState.primaryCurrency);
  const [allocations, setAllocations] = useState(defaultState.allocations);
  const [bills, setBills] = useState(defaultState.bills);
  const [customCategories, setCustomCategories] = useState(defaultState.customCategories);
  const [investProfile, setInvestProfile] = useState(defaultState.investProfile);
  const [salaryDay, setSalaryDay] = useState(defaultState.salaryDay);
  const [lastOpenedMonth, setLastOpenedMonth] = useState(defaultState.lastOpenedMonth);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [initialized, setInitialized] = useState(false);

  const totalIncome = useMemo(() => calcTotalIncome(incomeSources, primaryCurrency), [incomeSources, primaryCurrency]);
  const { unallocated } = useMemo(() => calcInvestables(allocations, totalIncome), [allocations, totalIncome]);

  const state = useMemo(() => ({
    incomeSources, primaryCurrency, allocations, bills,
    customCategories, investProfile, salaryDay, lastOpenedMonth, totalIncome,
  }), [incomeSources, primaryCurrency, allocations, bills, customCategories, investProfile, salaryDay, lastOpenedMonth, totalIncome]);

  useEffect(() => {
    try { localStorage.setItem('_test', '1'); localStorage.removeItem('_test'); }
    catch { setStorageAvailable(false); }

    const saved = loadStore(PRIMARY_KEY, null);
    const savedHistory = loadStore(HISTORY_KEY, []);

    if (saved) {
      if (saved.incomeSources) setIncomeSources(saved.incomeSources);
      if (saved.primaryCurrency) setPrimaryCurrency(saved.primaryCurrency);
      if (saved.allocations) setAllocations(saved.allocations);
      if (saved.customCategories) setCustomCategories(saved.customCategories);
      if (saved.investProfile !== undefined) setInvestProfile(saved.investProfile);
      if (saved.salaryDay) setSalaryDay(saved.salaryDay);

      if (saved.bills) {
        const thisMonth = currentMonthId();
        const isNewMonth = saved.lastOpenedMonth && saved.lastOpenedMonth !== thisMonth;
        let newHistory = savedHistory;

        if (isNewMonth && savedHistory.length > 0) {
          const alreadySaved = savedHistory.some(s => s.id === thisMonth && s.trigger === 'auto');
          if (!alreadySaved) {
            const snapState = { ...saved, totalIncome: calcTotalIncome(saved.incomeSources || defaultState.incomeSources, saved.primaryCurrency || '€') };
            newHistory = [buildSnapshot(snapState, 'auto'), ...savedHistory];
            saveStore(HISTORY_KEY, newHistory);
          }
        }
        setHistory(newHistory);
        setBills(isNewMonth ? saved.bills.map(b => ({ ...b, paid: false })) : saved.bills);
      } else {
        setHistory(savedHistory);
      }
    } else {
      setHistory(savedHistory);
    }

    setLastOpenedMonth(currentMonthId());
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialized) return;
    saveStore(PRIMARY_KEY, { incomeSources, primaryCurrency, allocations, bills, customCategories, investProfile, salaryDay, lastOpenedMonth: currentMonthId() });
  }, [initialized, incomeSources, primaryCurrency, allocations, bills, customCategories, investProfile, salaryDay]);

  useEffect(() => {
    if (!initialized) return;
    saveStore(HISTORY_KEY, history);
  }, [initialized, history]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header primaryCurrency={primaryCurrency} setPrimaryCurrency={setPrimaryCurrency} state={state} totalIncome={totalIncome} />
      <IncomeBar incomeSources={incomeSources} setIncomeSources={setIncomeSources} primaryCurrency={primaryCurrency} totalIncome={totalIncome} unallocated={unallocated} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
        {!storageAvailable && (
          <AlertBanner variant="warning" style={{ marginBottom: 16 }}>
            Data will not be saved in this session. localStorage is unavailable.
          </AlertBanner>
        )}
        {activeTab === 'overview' && <Overview allocations={allocations} setAllocations={setAllocations} customCategories={customCategories} setCustomCategories={setCustomCategories} totalIncome={totalIncome} primaryCurrency={primaryCurrency} />}
        {activeTab === 'bills' && <PriorityBills bills={bills} setBills={setBills} primaryCurrency={primaryCurrency} />}
        {activeTab === 'invest' && <InvestScore allocations={allocations} totalIncome={totalIncome} primaryCurrency={primaryCurrency} investProfile={investProfile} setInvestProfile={setInvestProfile} />}
        {activeTab === 'whatif' && <WhatIfSimulator totalIncome={totalIncome} primaryCurrency={primaryCurrency} />}
        {activeTab === 'forecast' && <ForecastTab allocations={allocations} totalIncome={totalIncome} primaryCurrency={primaryCurrency} bills={bills} salaryDay={salaryDay} setSalaryDay={setSalaryDay} />}
        {activeTab === 'history' && <HistoryTab history={history} setHistory={setHistory} state={state} />}
        {activeTab === 'ratio' && <RatioChecker allocations={allocations} />}
      </main>
    </div>
  );
}
