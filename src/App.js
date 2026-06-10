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
import ProfileSidebar from './components/ProfileSidebar';

const PRIMARY_KEY   = 'budgetfq_v1';
const HISTORY_KEY   = 'budgetfq_history_v1';
const PROFILE_KEY   = 'budgetfq_profile_v1';
const DATA_VERSION  = 2;

function loadStore(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const OLD_DEFAULTS = { savings:20, loans:10, rent:30, food:12, transport:8, leisure:8, bills:7 };
function isOldDefault(alloc) {
  return Object.entries(OLD_DEFAULTS).every(([k,v]) => (parseFloat(alloc[k])||0) === v);
}

const DEFAULT_PROFILE = {
  name: '', avatar: '👤', country: '', language: 'en',
  notifyBills: true, notifyOverspend: true, notifySnapshot: false,
};

export default function App() {
  const [storageOk, setStorageOk]         = useState(true);
  const [profileOpen, setProfileOpen]     = useState(false);
  const def = getDefaultState();

  // ── Core state ──────────────────────────────────────────
  const [incomeSources,    setIncomeSources]    = useState(def.incomeSources);
  const [primaryCurrency,  setPrimaryCurrency]  = useState(def.primaryCurrency);
  const [allocations,      setAllocations]      = useState(def.allocations);
  const [bills,            setBills]            = useState(def.bills);
  const [customCategories, setCustomCategories] = useState(def.customCategories);
  const [deletedCoreKeys,  setDeletedCoreKeys]  = useState([]);
  const [investProfile,    setInvestProfile]    = useState(def.investProfile);
  const [salaryDay,        setSalaryDay]        = useState(def.salaryDay);
  const [lastOpenedMonth,  setLastOpenedMonth]  = useState(def.lastOpenedMonth);
  const [history,          setHistory]          = useState([]);
  const [profile,          setProfile]          = useState(DEFAULT_PROFILE);
  const [activeTab,        setActiveTab]        = useState('overview');
  const [initialized,      setInitialized]      = useState(false);

  // ── Derived ─────────────────────────────────────────────
  const totalIncome = useMemo(
    () => calcTotalIncome(incomeSources, primaryCurrency),
    [incomeSources, primaryCurrency]
  );
  const { unallocated } = useMemo(
    () => calcInvestables(allocations, totalIncome),
    [allocations, totalIncome]
  );
  const state = useMemo(() => ({
    incomeSources, primaryCurrency, allocations, bills,
    customCategories, investProfile, salaryDay, lastOpenedMonth, totalIncome,
  }), [incomeSources, primaryCurrency, allocations, bills,
      customCategories, investProfile, salaryDay, lastOpenedMonth, totalIncome]);

  // ── Load ────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); }
    catch { setStorageOk(false); }

    const saved        = loadStore(PRIMARY_KEY, null);
    const savedHistory = loadStore(HISTORY_KEY, []);
    const savedProfile = loadStore(PROFILE_KEY, null);
    const savedVersion = loadStore('budgetfq_version', 1);

    if (savedProfile) setProfile({ ...DEFAULT_PROFILE, ...savedProfile });

    if (saved) {
      if (saved.incomeSources)   setIncomeSources(saved.incomeSources);
      if (saved.primaryCurrency) setPrimaryCurrency(saved.primaryCurrency);
      if (saved.customCategories)setCustomCategories(saved.customCategories);
      if (saved.deletedCoreKeys) setDeletedCoreKeys(saved.deletedCoreKeys);
      if (saved.investProfile !== undefined) setInvestProfile(saved.investProfile);
      if (saved.salaryDay)       setSalaryDay(saved.salaryDay);

      // Migration: reset old pre-filled allocations to zero
      if (saved.allocations) {
        setAllocations(
          savedVersion < DATA_VERSION && isOldDefault(saved.allocations)
            ? def.allocations
            : saved.allocations
        );
      }

      if (saved.bills) {
        const thisMonth  = currentMonthId();
        const isNewMonth = saved.lastOpenedMonth && saved.lastOpenedMonth !== thisMonth;
        let newHistory   = savedHistory;

        if (isNewMonth && savedHistory.length > 0) {
          const alreadySaved = savedHistory.some(s => s.id === thisMonth && s.trigger === 'auto');
          if (!alreadySaved) {
            const snapState = {
              ...saved,
              totalIncome: calcTotalIncome(
                saved.incomeSources || def.incomeSources,
                saved.primaryCurrency || '€'
              ),
            };
            newHistory = [buildSnapshot(snapState, 'auto'), ...savedHistory];
            saveStore(HISTORY_KEY, newHistory);
          }
        }
        setHistory(newHistory);

        let loadedBills = isNewMonth
          ? saved.bills.map(b => ({ ...b, paid: false }))
          : saved.bills;

        // Migration v2: reset old sample bill amounts to zero
        if (savedVersion < DATA_VERSION) {
          loadedBills = loadedBills.map(b =>
            b.amount > 0 && [80, 45, 30, 35].includes(b.amount)
              ? { ...b, amount: 0 }
              : b
          );
        }
        setBills(loadedBills);
      } else {
        setHistory(savedHistory);
      }

      saveStore('budgetfq_version', DATA_VERSION);
    } else {
      setHistory(savedHistory);
    }

    setLastOpenedMonth(currentMonthId());
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist ─────────────────────────────────────────────
  useEffect(() => {
    if (!initialized) return;
    saveStore(PRIMARY_KEY, {
      incomeSources, primaryCurrency, allocations, bills,
      customCategories, deletedCoreKeys, investProfile, salaryDay,
      lastOpenedMonth: currentMonthId(),
    });
  }, [initialized, incomeSources, primaryCurrency, allocations, bills,
      customCategories, deletedCoreKeys, investProfile, salaryDay]);

  useEffect(() => {
    if (!initialized) return;
    saveStore(HISTORY_KEY, history);
  }, [initialized, history]);

  useEffect(() => {
    if (!initialized) return;
    saveStore(PROFILE_KEY, profile);
  }, [initialized, profile]);

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header
        primaryCurrency={primaryCurrency}
        setPrimaryCurrency={setPrimaryCurrency}
        state={state}
        totalIncome={totalIncome}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <IncomeBar
        incomeSources={incomeSources}
        setIncomeSources={setIncomeSources}
        primaryCurrency={primaryCurrency}
        totalIncome={totalIncome}
        unallocated={unallocated}
      />

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ padding: 'clamp(12px, 4vw, 24px)', maxWidth: 880, margin: '0 auto' }}>
        {!storageOk && (
          <AlertBanner variant="warning" style={{ marginBottom: 16 }}>
            Data will not be saved in this session. localStorage is unavailable.
          </AlertBanner>
        )}

        {activeTab === 'overview' && (
          <Overview
            allocations={allocations} setAllocations={setAllocations}
            customCategories={customCategories} setCustomCategories={setCustomCategories}
            deletedCoreKeys={deletedCoreKeys} setDeletedCoreKeys={setDeletedCoreKeys}
            totalIncome={totalIncome} primaryCurrency={primaryCurrency}
          />
        )}
        {activeTab === 'bills' && (
          <PriorityBills bills={bills} setBills={setBills} primaryCurrency={primaryCurrency} />
        )}
        {activeTab === 'invest' && (
          <InvestScore
            allocations={allocations} totalIncome={totalIncome}
            primaryCurrency={primaryCurrency}
            investProfile={investProfile} setInvestProfile={setInvestProfile}
          />
        )}
        {activeTab === 'whatif' && (
          <WhatIfSimulator totalIncome={totalIncome} primaryCurrency={primaryCurrency} />
        )}
        {activeTab === 'forecast' && (
          <ForecastTab
            allocations={allocations} totalIncome={totalIncome}
            primaryCurrency={primaryCurrency} bills={bills}
            salaryDay={salaryDay} setSalaryDay={setSalaryDay}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab history={history} setHistory={setHistory} state={state} />
        )}
        {activeTab === 'ratio' && (
          <RatioChecker allocations={allocations} />
        )}
      </main>

      {/* Profile sidebar — slides in from left */}
      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        setProfile={setProfile}
        primaryCurrency={primaryCurrency}
        setPrimaryCurrency={setPrimaryCurrency}
      />
    </div>
  );
}
