import React, { useEffect, useMemo, useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const SESSION_TAG_OPTIONS = [
  "Training",
  "Gym",
  "Recovery",
  "Match",
  "Skills",
  "Game Review",
  "Opposition Preview",
];
const ACCOUNTABILITY_ROLES = ["Coach", "Parent", "Manager"];
const READING_MINUTE_OPTIONS = ["15", "30", "45", "60"];

const SPORT_OPTIONS = {
  "Rugby Union": [
    "Loosehead Prop",
    "Hooker",
    "Tighthead Prop",
    "Lock",
    "Blindside Flanker",
    "Openside Flanker",
    "Number 8",
    "Scrumhalf",
    "Flyhalf",
    "Left Wing",
    "Inside Centre",
    "Outside Centre",
    "Right Wing",
    "Fullback",
  ],
  "Rugby League": [
    "Fullback",
    "Wing",
    "Centre",
    "Five-Eighth",
    "Halfback",
    "Prop",
    "Hooker",
    "Second Row",
    "Lock",
    "Utility",
  ],
  Cricket: [
    "Opening Batter",
    "Middle Order Batter",
    "Fast Bowler",
    "Spin Bowler",
    "All-Rounder",
    "Wicketkeeper",
  ],
  Netball: [
    "Goal Shooter",
    "Goal Attack",
    "Wing Attack",
    "Centre",
    "Wing Defence",
    "Goal Defence",
    "Goal Keeper",
  ],
};

const QUOTES = [
  {
    text: "It’s not whether you get knocked down; it’s whether you get up.",
    author: "Vince Lombardi",
    theme: "Mindset & Discipline",
  },
  {
    text: "Champions keep playing until they get it right.",
    author: "Billie Jean King",
    theme: "Mindset & Discipline",
  },
  {
    text: "Excellence is the gradual result of always striving to do better.",
    author: "Pat Riley",
    theme: "High Performance",
  },
  {
    text: "You don’t get what you wish for. You get what you work for.",
    author: "Daniel Milstein",
    theme: "Excellence",
  },
  {
    text: "Pressure is a privilege.",
    author: "Billie Jean King",
    theme: "Resilience",
  },
  {
    text: "Don’t count the days. Make the days count.",
    author: "Muhammad Ali",
    theme: "Focus",
  },
  {
    text: "Motivation gets you going. Discipline keeps you growing.",
    author: "John C. Maxwell",
    theme: "Discipline",
  },
  {
    text: "Confidence comes from preparation. Everything else is beyond your control.",
    author: "Joe Montana",
    theme: "Elite Mindset",
  },
  {
    text: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston",
    theme: "Commitment",
  },
  {
    text: "Leave the jersey in a better place.",
    author: "Rugby ethos",
    theme: "Culture",
  },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getWeekKey(dateInput = new Date()) {
  const current = new Date(dateInput);
  const jsDay = current.getDay();
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  current.setDate(current.getDate() + diffToMonday);
  current.setHours(0, 0, 0, 0);
  return current.toISOString().split("T")[0];
}

function getDayName(dateString) {
  const date = new Date(dateString);
  const jsDay = date.getDay();
  return DAYS[jsDay === 0 ? 6 : jsDay - 1];
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function createEmptyEntry(date = getTodayDate()) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date,
    day: getDayName(date),
    sessionTags: [],
    energyToday: "",
    mood: "",
    sleep: "",
    sessionRating: "",
    recovery: "No",
    wins: "",
    nextFocus: "",
    notes: "",
    readToday: "No",
    readDuration: "",
    progressUpdates: {},
    gameFocus: "",
    gameReviewWorked: "",
    gameReviewValue: "",
    gameReviewBestMoments: "",
    gameReviewImprove: "",
    gameReviewStruggles: "",
    gameReviewChanges: "",
    oppositionOpportunities: "",
    oppositionThreeThings: "",
    oppositionThreats: "",
    oppositionWeaknesses: "",
    oppositionNullify: "",
    oppositionPrepare: "",
    oppositionSimulate: "",
  };
}

function createEmptyProfile() {
  return {
    email: "",
    name: "",
    phone: "",
    height: "",
    weight: "",
    sport: "",
    positionPrimary: "",
    positionSecondary: "",
    image: "",
    northStars: [],
    yearlyGoals: [],
    yearlyGoalCompletion: {},
    accountabilityPeople: [],
  };
}

function createEmptyAccountabilityPerson() {
  return {
    name: "",
    role: "Coach",
    contact: "",
  };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [tab, setTab] = useState("home");
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [profile, setProfile] = useState(createEmptyProfile());
  const [northStarInput, setNorthStarInput] = useState("");
  const [yearGoalInput, setYearGoalInput] = useState("");
  const [accountabilityInput, setAccountabilityInput] = useState(
    createEmptyAccountabilityPerson()
  );

  const [weekKey, setWeekKey] = useState(getWeekKey());
  const [weekLocked, setWeekLocked] = useState(false);
  const [weeklyReading, setWeeklyReading] = useState({ book: "", target: "" });
  const [weeklyGoalInput, setWeeklyGoalInput] = useState({
    title: "",
    target: "",
  });
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [journalEntry, setJournalEntry] = useState(createEmptyEntry());
  const [entries, setEntries] = useState([]);
  const [pastWeeks, setPastWeeks] = useState([]);

  const [breathingActive, setBreathingActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [breathStep, setBreathStep] = useState("Inhale");

  const quote = QUOTES[quoteIndex % QUOTES.length];
  const availablePositions = SPORT_OPTIONS[profile.sport] || [];

  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBreathingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingActive]);

  useEffect(() => {
    if (!breathingActive) return;

    const steps = ["Inhale", "Hold", "Exhale", "Hold"];
    const cycle = setInterval(() => {
      setBreathStep((prev) => {
        const index = steps.indexOf(prev);
        return steps[(index + 1) % steps.length];
      });
    }, 4000);

    return () => clearInterval(cycle);
  }, [breathingActive]);

  const currentWeekEntries = useMemo(
    () => entries.filter((entry) => entry.weekKey === weekKey),
    [entries, weekKey]
  );

  const weeklyProgress = useMemo(() => {
    return weeklyGoals.map((goal) => ({
      ...goal,
      completed: currentWeekEntries.reduce(
        (sum, entry) => sum + Number(entry.progressUpdates?.[goal.id] || 0),
        0
      ),
    }));
  }, [weeklyGoals, currentWeekEntries]);

  const overallProgress = useMemo(() => {
    const taskTarget = weeklyProgress.reduce(
      (sum, goal) => sum + Number(goal.target || 0),
      0
    );
    const taskDone = weeklyProgress.reduce(
      (sum, goal) => sum + Number(goal.completed || 0),
      0
    );
    const readingTarget = Number(weeklyReading.target || 0);
    const readingDone = currentWeekEntries.reduce(
      (sum, entry) => sum + Number(entry.readDuration || 0),
      0
    );

    const totalTarget = taskTarget + readingTarget;
    const totalCompleted = taskDone + readingDone;
    const percentage = totalTarget
      ? Math.min(Math.round((totalCompleted / totalTarget) * 100), 100)
      : 0;

    return {
      totalTarget,
      totalCompleted,
      percentage,
      readingTarget,
      readingDone,
    };
  }, [weeklyProgress, weeklyReading, currentWeekEntries]);

  const stats = useMemo(() => {
    if (!currentWeekEntries.length) {
      return {
        totalEntries: 0,
        avgMood: "-",
        avgEnergy: "-",
        avgSleep: "-",
        avgSessionLoad: "-",
      };
    }

    const average = (key) =>
      (
        currentWeekEntries.reduce(
          (sum, item) => sum + Number(item[key] || 0),
          0
        ) / currentWeekEntries.length
      ).toFixed(1);

    return {
      totalEntries: currentWeekEntries.length,
      avgMood: average("mood"),
      avgEnergy: average("energyToday"),
      avgSleep: average("sleep"),
      avgSessionLoad: average("sessionRating"),
    };
  }, [currentWeekEntries]);

  const sessionReflectionSummary = useMemo(() => {
    const positives = currentWeekEntries
      .map((entry) => entry.wins)
      .filter(Boolean)
      .slice(0, 4);

    const focusItems = currentWeekEntries
      .map((entry) => entry.nextFocus)
      .filter(Boolean)
      .slice(0, 4);

    return { positives, focusItems };
  }, [currentWeekEntries]);

  const gameFocusPoints = useMemo(() => {
    return currentWeekEntries
      .flatMap((entry) => [entry.gameFocus, entry.nextFocus])
      .filter(Boolean)
      .slice(0, 6);
  }, [currentWeekEntries]);

  const preparationSummary = useMemo(() => {
    const reviewPoints = currentWeekEntries
      .flatMap((entry) => [
        entry.gameReviewWorked,
        entry.gameReviewValue,
        entry.gameReviewBestMoments,
        entry.gameReviewImprove,
        entry.gameReviewStruggles,
        entry.gameReviewChanges,
      ])
      .filter(Boolean)
      .slice(0, 8);

    const oppositionPoints = currentWeekEntries
      .flatMap((entry) => [
        entry.oppositionOpportunities,
        entry.oppositionThreeThings,
        entry.oppositionThreats,
        entry.oppositionWeaknesses,
        entry.oppositionNullify,
        entry.oppositionPrepare,
        entry.oppositionSimulate,
      ])
      .filter(Boolean)
      .slice(0, 10);

    return { reviewPoints, oppositionPoints };
  }, [currentWeekEntries]);

  const oppositionPreviewRecap = useMemo(() => {
    return currentWeekEntries
      .flatMap((entry) => [
        entry.oppositionOpportunities,
        entry.oppositionThreeThings,
        entry.oppositionThreats,
        entry.oppositionWeaknesses,
        entry.oppositionNullify,
        entry.oppositionPrepare,
        entry.oppositionSimulate,
      ])
      .filter(Boolean)
      .slice(0, 10);
  }, [currentWeekEntries]);

  const latestEntry = entries[0];

  const addNorthStar = () => {
    const value = northStarInput.trim();
    if (!value) return;
    setProfile((prev) => ({
      ...prev,
      northStars: [...prev.northStars, value],
    }));
    setNorthStarInput("");
  };

  const removeNorthStar = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      northStars: prev.northStars.filter((_, index) => index !== indexToRemove),
    }));
  };

  const addYearGoal = () => {
    const value = yearGoalInput.trim();
    if (!value) return;

    setProfile((prev) => ({
      ...prev,
      yearlyGoals: [...prev.yearlyGoals, value],
      yearlyGoalCompletion: {
        ...prev.yearlyGoalCompletion,
        [value]: false,
      },
    }));
    setYearGoalInput("");
  };

  const removeYearGoal = (indexToRemove) => {
    setProfile((prev) => {
      const goal = prev.yearlyGoals[indexToRemove];
      const nextCompletion = { ...prev.yearlyGoalCompletion };
      delete nextCompletion[goal];

      return {
        ...prev,
        yearlyGoals: prev.yearlyGoals.filter(
          (_, index) => index !== indexToRemove
        ),
        yearlyGoalCompletion: nextCompletion,
      };
    });
  };

  const toggleYearGoalComplete = (goal) => {
    setProfile((prev) => ({
      ...prev,
      yearlyGoalCompletion: {
        ...prev.yearlyGoalCompletion,
        [goal]: !prev.yearlyGoalCompletion[goal],
      },
    }));
  };

  const addAccountabilityPerson = () => {
    if (
      !accountabilityInput.name.trim() ||
      !accountabilityInput.contact.trim()
    ) {
      return;
    }

    setProfile((prev) => ({
      ...prev,
      accountabilityPeople: [
        ...prev.accountabilityPeople,
        {
          ...accountabilityInput,
          name: accountabilityInput.name.trim(),
          contact: accountabilityInput.contact.trim(),
        },
      ],
    }));

    setAccountabilityInput(createEmptyAccountabilityPerson());
  };

  const removeAccountabilityPerson = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      accountabilityPeople: prev.accountabilityPeople.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const addWeeklyGoal = () => {
    const title = weeklyGoalInput.title.trim();
    const target = Number(weeklyGoalInput.target);

    if (
      !title ||
      !weeklyGoalInput.target ||
      Number.isNaN(target) ||
      target <= 0
    ) {
      return;
    }

    const newGoal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      target,
    };

    setWeeklyGoals((prev) => [...prev, newGoal]);
    setWeeklyGoalInput({ title: "", target: "" });

    setJournalEntry((prev) => ({
      ...prev,
      progressUpdates: {
        ...prev.progressUpdates,
        [newGoal.id]: "",
      },
    }));
  };

  const deleteWeeklyGoal = (goalId) => {
    setWeeklyGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    setJournalEntry((prev) => {
      const nextUpdates = { ...prev.progressUpdates };
      delete nextUpdates[goalId];
      return {
        ...prev,
        progressUpdates: nextUpdates,
      };
    });
  };

  const toggleWeekLock = () => {
    setWeekLocked((prev) => !prev);
    if (!weekLocked) setTab("journal");
  };

  const updateProgressValue = (goalId, value) => {
    setJournalEntry((prev) => ({
      ...prev,
      progressUpdates: {
        ...prev.progressUpdates,
        [goalId]: value,
      },
    }));
  };

  const toggleSessionTag = (tag) => {
    setJournalEntry((prev) => {
      const exists = prev.sessionTags.includes(tag);
      return {
        ...prev,
        sessionTags: exists
          ? prev.sessionTags.filter((item) => item !== tag)
          : [...prev.sessionTags, tag],
      };
    });
  };

  const closeWeek = () => {
    setPastWeeks((prev) => [
      {
        weekKey,
        weeklyGoals,
        weeklyReading,
        entries: currentWeekEntries,
        overallProgress,
      },
      ...prev,
    ]);

    const nextWeekDate = new Date(weekKey);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);

    setWeekKey(getWeekKey(nextWeekDate));
    setWeekLocked(false);
    setWeeklyReading({ book: "", target: "" });
    setWeeklyGoals([]);
    setWeeklyGoalInput({ title: "", target: "" });
    setJournalEntry(createEmptyEntry());
    setBreathingActive(false);
    setTimeLeft(120);
    setBreathStep("Inhale");
    setTab("week");
  };

  const saveEntry = () => {
    const hasReflection =
      journalEntry.wins.trim() ||
      journalEntry.nextFocus.trim() ||
      journalEntry.notes.trim() ||
      journalEntry.gameFocus.trim() ||
      journalEntry.gameReviewWorked.trim() ||
      journalEntry.oppositionOpportunities.trim();

    if (
      !hasReflection &&
      !journalEntry.energyToday &&
      !journalEntry.mood &&
      !journalEntry.sleep &&
      !journalEntry.sessionRating
    ) {
      return;
    }

    setEntries((prev) => [{ ...journalEntry, weekKey }, ...prev]);

    const nextEntry = createEmptyEntry(getTodayDate());
    nextEntry.progressUpdates = weeklyGoals.reduce((acc, goal) => {
      acc[goal.id] = "";
      return acc;
    }, {});

    setJournalEntry(nextEntry);
    setBreathingActive(false);
    setTimeLeft(120);
    setBreathStep("Inhale");
    setQuoteIndex((prev) => prev + 1);
    setTab("progress");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfile((prev) => ({
          ...prev,
          image: reader.result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const renderCurrentTab = () => {
    if (!complete) {
      return (
        <OnboardingView
          step={step}
          setStep={setStep}
          profile={profile}
          setProfile={setProfile}
          northStarInput={northStarInput}
          setNorthStarInput={setNorthStarInput}
          yearGoalInput={yearGoalInput}
          setYearGoalInput={setYearGoalInput}
          accountabilityInput={accountabilityInput}
          setAccountabilityInput={setAccountabilityInput}
          availablePositions={availablePositions}
          addNorthStar={addNorthStar}
          removeNorthStar={removeNorthStar}
          addYearGoal={addYearGoal}
          removeYearGoal={removeYearGoal}
          addAccountabilityPerson={addAccountabilityPerson}
          removeAccountabilityPerson={removeAccountabilityPerson}
          handleImageUpload={handleImageUpload}
          onComplete={() => setComplete(true)}
        />
      );
    }

    switch (tab) {
      case "home":
        return (
          <HomeView
            profile={profile}
            weekKey={weekKey}
            stats={stats}
            latestEntry={latestEntry}
            quote={quote}
            nextQuote={() => setQuoteIndex((prev) => prev + 1)}
            weekLocked={weekLocked}
          />
        );
      case "week":
        return (
          <WeekView
            weekKey={weekKey}
            setWeekKey={setWeekKey}
            weekLocked={weekLocked}
            toggleWeekLock={toggleWeekLock}
            weeklyReading={weeklyReading}
            setWeeklyReading={setWeeklyReading}
            weeklyGoalInput={weeklyGoalInput}
            setWeeklyGoalInput={setWeeklyGoalInput}
            weeklyProgress={weeklyProgress}
            addWeeklyGoal={addWeeklyGoal}
            deleteWeeklyGoal={deleteWeeklyGoal}
          />
        );
      case "journal":
        return (
          <JournalView
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            weeklyReading={weeklyReading}
            weeklyGoals={weeklyGoals}
            updateProgressValue={updateProgressValue}
            saveEntry={saveEntry}
            weekLocked={weekLocked}
            toggleSessionTag={toggleSessionTag}
            breathingActive={breathingActive}
            setBreathingActive={setBreathingActive}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            breathStep={breathStep}
            setBreathStep={setBreathStep}
            oppositionPreviewRecap={oppositionPreviewRecap}
          />
        );
      case "progress":
        return (
          <ProgressView
            quote={quote}
            nextQuote={() => setQuoteIndex((prev) => prev + 1)}
            overallProgress={overallProgress}
            weeklyProgress={weeklyProgress}
            currentWeekEntries={currentWeekEntries}
            gameFocusPoints={gameFocusPoints}
            sessionReflectionSummary={sessionReflectionSummary}
            preparationSummary={preparationSummary}
            profile={profile}
            toggleYearGoalComplete={toggleYearGoalComplete}
            pastWeeks={pastWeeks}
            closeWeek={closeWeek}
          />
        );
      case "profile":
      default:
        return <ProfileView profile={profile} />;
    }
  };

  const navItems = [
    { key: "home", label: "Home" },
    { key: "week", label: "Week" },
    { key: "journal", label: "Journal" },
    { key: "progress", label: "Progress" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div style={styles.app}>
      <div style={styles.shell}>
        {renderCurrentTab()}

        {complete && (
          <div style={styles.navFive}>
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                style={{
                  ...styles.navBtn,
                  ...(tab === item.key ? styles.navBtnActive : {}),
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OnboardingView({
  step,
  setStep,
  profile,
  setProfile,
  northStarInput,
  setNorthStarInput,
  yearGoalInput,
  setYearGoalInput,
  accountabilityInput,
  setAccountabilityInput,
  availablePositions,
  addNorthStar,
  removeNorthStar,
  addYearGoal,
  removeYearGoal,
  addAccountabilityPerson,
  removeAccountabilityPerson,
  handleImageUpload,
  onComplete,
}) {
  return (
    <div style={styles.card}>
      <Logo />

      {step === 0 && (
        <>
          <h2 style={styles.heading}>Enter The System</h2>
          <p style={styles.subheading}>Start the athlete journey.</p>
          <input
            style={styles.input}
            placeholder="Email"
            value={profile.email}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <button type="button" style={styles.btn} onClick={() => setStep(1)}>
            Continue
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h2 style={styles.heading}>Build Profile</h2>
          <input
            style={styles.input}
            placeholder="Name"
            value={profile.name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            style={styles.input}
            placeholder="Mobile Number"
            value={profile.phone}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <NavButtons step={step} setStep={setStep} />
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={styles.heading}>Athlete Profile</h2>

          <LabeledField label="Profile Image">
            <div style={styles.uploadRow}>
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Athlete"
                  style={styles.profileThumb}
                />
              ) : (
                <div style={styles.profileThumbPlaceholder}>No Image</div>
              )}
              <label style={styles.uploadButton}>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </LabeledField>

          <LabeledField label="Height">
            <SuffixInput
              value={profile.height}
              placeholder="Enter height"
              suffix="cm"
              inputMode="numeric"
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  height: value.replace(/[^0-9]/g, ""),
                }))
              }
            />
          </LabeledField>

          <LabeledField label="Weight">
            <SuffixInput
              value={profile.weight}
              placeholder="Enter weight"
              suffix="kg"
              inputMode="numeric"
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  weight: value.replace(/[^0-9]/g, ""),
                }))
              }
            />
          </LabeledField>

          <LabeledField label="Sport">
            <ChipSelector
              options={Object.keys(SPORT_OPTIONS)}
              value={profile.sport}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  sport: value,
                  positionPrimary: "",
                  positionSecondary: "",
                }))
              }
            />
          </LabeledField>

          <LabeledField label="Primary Position">
            <ChipSelector
              options={availablePositions}
              value={profile.positionPrimary}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, positionPrimary: value }))
              }
              emptyText="Choose a sport first"
            />
          </LabeledField>

          <LabeledField label="Secondary Position">
            <ChipSelector
              options={availablePositions}
              value={profile.positionSecondary}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, positionSecondary: value }))
              }
              emptyText="Choose a sport first"
            />
          </LabeledField>

          <NavButtons step={step} setStep={setStep} />
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={styles.heading}>North Star</h2>
          <p style={styles.subheading}>Set the long-term identity goal.</p>
          <input
            style={styles.input}
            placeholder="Add North Star goal"
            value={northStarInput}
            onChange={(e) => setNorthStarInput(e.target.value)}
          />
          <div style={styles.actionSpacing}>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={addNorthStar}
            >
              Add Goal
            </button>
          </div>

          {profile.northStars.length ? (
            profile.northStars.map((goal, index) => (
              <GoalRow
                key={`${goal}-${index}`}
                text={goal}
                onDelete={() => removeNorthStar(index)}
              />
            ))
          ) : (
            <p style={styles.muted}>No North Star goals yet.</p>
          )}

          <NavButtons step={step} setStep={setStep} />
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={styles.heading}>Year Goals</h2>
          <p style={styles.subheading}>Set the standard for the year.</p>
          <input
            style={styles.input}
            placeholder="Add yearly goal"
            value={yearGoalInput}
            onChange={(e) => setYearGoalInput(e.target.value)}
          />
          <div style={styles.actionSpacing}>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={addYearGoal}
            >
              Add Goal
            </button>
          </div>

          {profile.yearlyGoals.length ? (
            profile.yearlyGoals.map((goal, index) => (
              <GoalRow
                key={`${goal}-${index}`}
                text={goal}
                onDelete={() => removeYearGoal(index)}
              />
            ))
          ) : (
            <p style={styles.muted}>No yearly goals yet.</p>
          )}

          <NavButtons step={step} setStep={setStep} />
        </>
      )}

      {step === 5 && (
        <>
          <h2 style={styles.heading}>Accountability</h2>
          <p style={styles.subheading}>
            Add someone to help oversee your weekly tasks and jobs.
          </p>
          <input
            style={styles.input}
            placeholder="Name"
            value={accountabilityInput.name}
            onChange={(e) =>
              setAccountabilityInput((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <LabeledField label="Role">
            <ChipSelector
              options={ACCOUNTABILITY_ROLES}
              value={accountabilityInput.role}
              onChange={(value) =>
                setAccountabilityInput((prev) => ({ ...prev, role: value }))
              }
            />
          </LabeledField>

          <input
            style={styles.input}
            placeholder="Email or mobile"
            value={accountabilityInput.contact}
            onChange={(e) =>
              setAccountabilityInput((prev) => ({
                ...prev,
                contact: e.target.value,
              }))
            }
          />

          <button
            type="button"
            style={{ ...styles.btnSecondary, marginBottom: 16 }}
            onClick={addAccountabilityPerson}
          >
            Add Person
          </button>

          {profile.accountabilityPeople.length ? (
            profile.accountabilityPeople.map((person, index) => (
              <div key={`${person.name}-${index}`} style={styles.targetRow}>
                <div style={styles.targetRowMain}>
                  <div style={styles.pill}>
                    <strong>{person.name}</strong>
                    <div style={styles.metaText}>
                      {person.role} · {person.contact}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  style={styles.deleteBtn}
                  onClick={() => removeAccountabilityPerson(index)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p style={styles.muted}>No accountability people added yet.</p>
          )}

          <div style={styles.row}>
            <button
              type="button"
              style={styles.btnGhost}
              onClick={() => setStep(4)}
            >
              Back
            </button>
            <button type="button" style={styles.btnHalf} onClick={onComplete}>
              Enter ATHLYT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function HomeView({
  profile,
  weekKey,
  stats,
  latestEntry,
  quote,
  nextQuote,
  weekLocked,
}) {
  return (
    <div style={styles.stack}>
      <div style={styles.cardHero}>
        <div style={styles.heroRow}>
          {profile.image ? (
            <img src={profile.image} alt="Athlete" style={styles.heroImage} />
          ) : (
            <div style={styles.heroImagePlaceholder}>ATHLYT</div>
          )}

          <div style={styles.heroTextWrap}>
            <Logo />
            <h2 style={styles.heroName}>{profile.name || "Athlete"}</h2>
            <p style={styles.heroMeta}>
              {profile.sport || "Sport"} ·{" "}
              {profile.positionPrimary || "Position"}
            </p>
            <div style={styles.heroBadge}>
              {weekLocked
                ? `Week Locked · ${weekKey}`
                : `Week Planning · ${weekKey}`}
            </div>
          </div>
        </div>
      </div>

      <QuoteCard quote={quote} onNext={nextQuote} />

      <div style={styles.grid}>
        <StatCard label="Sessions This Week" value={stats.totalEntries} />
        <StatCard label="Avg Energy" value={stats.avgEnergy} />
        <StatCard label="Avg Mood" value={stats.avgMood} />
        <StatCard label="Avg Sleep" value={stats.avgSleep} />
      </div>

      <div style={styles.card}>
        <SectionTitle>Identity Snapshot</SectionTitle>
        <p>
          <strong>North Star:</strong>{" "}
          {profile.northStars[0] || "Set your North Star"}
        </p>
        <p>
          <strong>Year Goal:</strong>{" "}
          {profile.yearlyGoals[0] || "Set your first year goal"}
        </p>
      </div>

      <div style={styles.card}>
        <SectionTitle>Latest Reflection</SectionTitle>
        {latestEntry ? (
          <>
            <p>
              <strong>Day:</strong> {latestEntry.day}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {latestEntry.sessionTags.length
                ? latestEntry.sessionTags.join(", ")
                : "-"}
            </p>
            <p>
              <strong>What did I do well?</strong> {latestEntry.wins || "-"}
            </p>
            <p>
              <strong>Next session focus:</strong>{" "}
              {latestEntry.nextFocus || "-"}
            </p>
          </>
        ) : (
          <p style={styles.muted}>No session entries yet.</p>
        )}
      </div>
    </div>
  );
}

function WeekView({
  weekKey,
  setWeekKey,
  weekLocked,
  toggleWeekLock,
  weeklyReading,
  setWeeklyReading,
  weeklyGoalInput,
  setWeeklyGoalInput,
  weeklyProgress,
  addWeeklyGoal,
  deleteWeeklyGoal,
}) {
  return (
    <div style={styles.stack}>
      <div style={styles.card}>
        <SectionTitle>Plan The Week</SectionTitle>
        <p style={styles.subheading}>
          Set the date for the week, lock your plan, then move into journal
          execution.
        </p>

        <input
          style={styles.input}
          type="date"
          value={weekKey}
          disabled={weekLocked}
          onChange={(e) => setWeekKey(getWeekKey(e.target.value))}
        />

        <div style={styles.lockRow}>
          <div style={styles.lockText}>
            {weekLocked
              ? "Week locked and ready to execute."
              : "Week not locked yet."}
          </div>
          <button
            type="button"
            style={styles.smallPrimaryBtn}
            onClick={toggleWeekLock}
          >
            {weekLocked ? "Unlock Week" : "Lock Week"}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <SectionTitle>Reading Plan</SectionTitle>

        <input
          style={styles.input}
          placeholder="Add your book"
          value={weeklyReading.book}
          disabled={weekLocked}
          onChange={(e) =>
            setWeeklyReading((prev) => ({ ...prev, book: e.target.value }))
          }
        />

        <LabeledField label="How much time will you read this week?">
          <ChipSelector
            options={READING_MINUTE_OPTIONS}
            value={weeklyReading.target}
            onChange={(value) =>
              setWeeklyReading((prev) => ({ ...prev, target: value }))
            }
            disabled={weekLocked}
          />
        </LabeledField>
      </div>

      <div style={styles.card}>
        <SectionTitle>Weekly Goals</SectionTitle>
        <input
          style={styles.input}
          placeholder="Action e.g. passing target"
          value={weeklyGoalInput.title}
          disabled={weekLocked}
          onChange={(e) =>
            setWeeklyGoalInput((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          style={styles.input}
          placeholder="Number"
          inputMode="numeric"
          value={weeklyGoalInput.target}
          disabled={weekLocked}
          onChange={(e) =>
            setWeeklyGoalInput((prev) => ({
              ...prev,
              target: e.target.value.replace(/[^0-9]/g, ""),
            }))
          }
        />
        <button
          type="button"
          style={styles.btn}
          onClick={addWeeklyGoal}
          disabled={weekLocked}
        >
          Add Weekly Goal
        </button>
      </div>

      <div style={styles.card}>
        <SectionTitle>Current Weekly Targets</SectionTitle>
        {weeklyProgress.length ? (
          weeklyProgress.map((goal) => (
            <div key={goal.id} style={styles.targetRow}>
              <div style={styles.targetRowMain}>
                <ProgressGoalCard goal={goal} />
              </div>
              {!weekLocked && (
                <button
                  type="button"
                  style={styles.deleteBtn}
                  onClick={() => deleteWeeklyGoal(goal.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No weekly targets yet.</p>
        )}
      </div>
    </div>
  );
}

function JournalView({
  journalEntry,
  setJournalEntry,
  weeklyReading,
  weeklyGoals,
  updateProgressValue,
  saveEntry,
  weekLocked,
  toggleSessionTag,
  breathingActive,
  setBreathingActive,
  timeLeft,
  setTimeLeft,
  breathStep,
  setBreathStep,
  oppositionPreviewRecap,
}) {
  const isMatchDay = journalEntry.sessionTags.includes("Match");
  const showGameReview = journalEntry.sessionTags.includes("Game Review");
  const showOppositionPreview =
    journalEntry.sessionTags.includes("Opposition Preview");

  const startBreathing = () => {
    setTimeLeft(120);
    setBreathStep("Inhale");
    setBreathingActive(true);
  };

  return (
    <div style={styles.stack}>
      {!weekLocked && (
        <div style={styles.cardWarning}>
          Lock your week first in the Week tab before journaling.
        </div>
      )}

      <div style={styles.card}>
        <SectionTitle>New Journal Block</SectionTitle>
        <div style={styles.dayBadge}>{journalEntry.day}</div>
        <p style={styles.subheading}>
          Daily wellbeing, session load, progress, and reflection.
        </p>

        <input
          style={styles.input}
          type="date"
          value={journalEntry.date}
          onChange={(e) => {
            const newDate = e.target.value;
            setJournalEntry((prev) => ({
              ...prev,
              date: newDate,
              day: getDayName(newDate),
            }));
          }}
        />

        <div style={styles.dayRowSingleLine}>
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setJournalEntry((prev) => ({ ...prev, day }))}
              style={{
                ...styles.dayChip,
                ...(journalEntry.day === day ? styles.dayChipActive : {}),
              }}
            >
              {day}
            </button>
          ))}
        </div>

        <LabeledField label="Session Tags">
          <ChipSelector
            options={SESSION_TAG_OPTIONS}
            value={journalEntry.sessionTags}
            onChange={toggleSessionTag}
            multi
          />
        </LabeledField>

        <SectionTitle>Wellbeing Check</SectionTitle>

        <RatingSelector
          label="Energy Today"
          value={journalEntry.energyToday}
          onChange={(value) =>
            setJournalEntry((prev) => ({ ...prev, energyToday: value }))
          }
          startLabel="1 Poor"
          endLabel="10 Excellent"
        />

        <RatingSelector
          label="Mood"
          value={journalEntry.mood}
          onChange={(value) =>
            setJournalEntry((prev) => ({ ...prev, mood: value }))
          }
          startLabel="1 Poor"
          endLabel="10 Excellent"
        />

        <RatingSelector
          label="How did I sleep last night?"
          value={journalEntry.sleep}
          onChange={(value) =>
            setJournalEntry((prev) => ({ ...prev, sleep: value }))
          }
          startLabel="1 Poor"
          endLabel="10 Excellent"
        />

        {!isMatchDay && (
          <>
            <RatingSelector
              label="Training Session Rating"
              value={journalEntry.sessionRating}
              onChange={(value) =>
                setJournalEntry((prev) => ({ ...prev, sessionRating: value }))
              }
              startLabel="1 Light"
              endLabel="10 Really Tough"
            />

            <ToggleSelector
              label="Did I do recovery today?"
              value={journalEntry.recovery}
              options={["Yes", "No"]}
              onChange={(value) =>
                setJournalEntry((prev) => ({ ...prev, recovery: value }))
              }
            />
          </>
        )}

        <ToggleSelector
          label="Did I read today?"
          value={journalEntry.readToday}
          options={["Yes", "No"]}
          onChange={(value) =>
            setJournalEntry((prev) => ({
              ...prev,
              readToday: value,
              readDuration: value === "No" ? "" : prev.readDuration,
            }))
          }
        />

        {journalEntry.readToday === "Yes" && (
          <LabeledField label="How long?">
            <ChipSelector
              options={READING_MINUTE_OPTIONS}
              value={
                journalEntry.readDuration
                  ? String(journalEntry.readDuration)
                  : ""
              }
              onChange={(value) =>
                setJournalEntry((prev) => ({ ...prev, readDuration: value }))
              }
            />
          </LabeledField>
        )}

        {weeklyReading.book && (
          <div style={styles.readingCard}>
            <div style={styles.readingLabel}>Book for this week</div>
            <div style={styles.readingBook}>{weeklyReading.book}</div>
          </div>
        )}
      </div>

      {isMatchDay && (
        <>
          <div style={styles.cardGameDay}>
            <SectionTitle>Calm & Focus</SectionTitle>
            <p style={styles.subheading}>
              Optional breathing and meditation reset before your game.
            </p>

            <div style={styles.breathingBox}>
              <div style={styles.timer}>{formatTime(timeLeft)}</div>
              <div style={styles.breathStep}>{breathStep}</div>
              <div style={styles.meditationNote}>
                Inhale 4s · Hold 4s · Exhale 4s · Hold 4s
              </div>
            </div>

            {!breathingActive ? (
              <button type="button" style={styles.btn} onClick={startBreathing}>
                Start 2-Minute Reset
              </button>
            ) : (
              <button
                type="button"
                style={styles.btnSecondary}
                onClick={() => setBreathingActive(false)}
              >
                Stop
              </button>
            )}

            <textarea
              style={styles.textareaTopSpacing}
              placeholder="Focus points for the game this weekend"
              value={journalEntry.gameFocus}
              onChange={(e) =>
                setJournalEntry((prev) => ({
                  ...prev,
                  gameFocus: e.target.value,
                }))
              }
            />
          </div>

          <div style={styles.card}>
            <SectionTitle>Opposition Preview</SectionTitle>
            {oppositionPreviewRecap.length ? (
              oppositionPreviewRecap.map((item, index) => (
                <div key={`${item}-${index}`} style={styles.pill}>
                  {item}
                </div>
              ))
            ) : (
              <p style={styles.muted}>
                No opposition preview points logged yet.
              </p>
            )}
          </div>
        </>
      )}

      {showGameReview && !isMatchDay && (
        <div style={styles.card}>
          <SectionTitle>Game Review</SectionTitle>

          <textarea
            style={styles.textarea}
            placeholder="What worked for you in last week’s game?"
            value={journalEntry.gameReviewWorked}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewWorked: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Where did I add value?"
            value={journalEntry.gameReviewValue}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewValue: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What actions or moments show you were at your best?"
            value={journalEntry.gameReviewBestMoments}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewBestMoments: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What do you need to do better?"
            value={journalEntry.gameReviewImprove}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewImprove: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What situations did I struggle in?"
            value={journalEntry.gameReviewStruggles}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewStruggles: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What decisions or skills would you change if you had that moment again?"
            value={journalEntry.gameReviewChanges}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                gameReviewChanges: e.target.value,
              }))
            }
          />
        </div>
      )}

      {showOppositionPreview && !isMatchDay && (
        <div style={styles.card}>
          <SectionTitle>Opposition Preview</SectionTitle>

          <textarea
            style={styles.textarea}
            placeholder="What opportunities do I see that I could expose in the opposition this week?"
            value={journalEntry.oppositionOpportunities}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionOpportunities: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Three key things I have identified in the game footage?"
            value={journalEntry.oppositionThreeThings}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionThreeThings: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What opposing players are a threat?"
            value={journalEntry.oppositionThreats}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionThreats: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What players are a weakness that I can target?"
            value={journalEntry.oppositionWeaknesses}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionWeaknesses: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="How will the opposition try to nullify my strengths this week?"
            value={journalEntry.oppositionNullify}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionNullify: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="How will I train and prepare for this? What situations do I need to simulate?"
            value={journalEntry.oppositionPrepare}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionPrepare: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What are the 3 key things I must simulate at training this week to ensure I bring them to the game?"
            value={journalEntry.oppositionSimulate}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                oppositionSimulate: e.target.value,
              }))
            }
          />
        </div>
      )}

      {!isMatchDay && weeklyGoals.length > 0 && (
        <div style={styles.card}>
          <SectionTitle>Track Progress This Session</SectionTitle>
          <p style={styles.subheading}>
            Log session-by-session progress toward the weekly target.
          </p>

          {weeklyGoals.map((goal) => (
            <div key={goal.id} style={styles.progressInputWrapSpacious}>
              <label style={styles.metricLabel}>
                {goal.title} · target {goal.target}
              </label>
              <input
                style={styles.inputTopSpacing}
                inputMode="numeric"
                placeholder="Enter completed amount this session"
                value={journalEntry.progressUpdates?.[goal.id] || ""}
                onChange={(e) =>
                  updateProgressValue(
                    goal.id,
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
              />
            </div>
          ))}
        </div>
      )}

      {!isMatchDay && (
        <div style={styles.card}>
          <SectionTitle>Reflection</SectionTitle>

          <textarea
            style={styles.textarea}
            placeholder="What did I do well in today’s session?"
            value={journalEntry.wins}
            onChange={(e) =>
              setJournalEntry((prev) => ({ ...prev, wins: e.target.value }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="What do I need to focus on in the next session?"
            value={journalEntry.nextFocus}
            onChange={(e) =>
              setJournalEntry((prev) => ({
                ...prev,
                nextFocus: e.target.value,
              }))
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Training notes"
            value={journalEntry.notes}
            onChange={(e) =>
              setJournalEntry((prev) => ({ ...prev, notes: e.target.value }))
            }
          />

          <button
            type="button"
            style={styles.btn}
            onClick={saveEntry}
            disabled={!weekLocked}
          >
            Save Entry
          </button>
        </div>
      )}

      {isMatchDay && (
        <button
          type="button"
          style={styles.btn}
          onClick={saveEntry}
          disabled={!weekLocked}
        >
          Save Match Day Entry
        </button>
      )}
    </div>
  );
}

function ProgressView({
  quote,
  nextQuote,
  overallProgress,
  weeklyProgress,
  currentWeekEntries,
  gameFocusPoints,
  sessionReflectionSummary,
  preparationSummary,
  profile,
  toggleYearGoalComplete,
  pastWeeks,
  closeWeek,
}) {
  const ready = overallProgress.percentage === 100;

  return (
    <div style={styles.stack}>
      <QuoteCard quote={quote} onNext={nextQuote} />

      <div style={styles.card}>
        <SectionTitle>Overall Weekly Progress</SectionTitle>
        <div style={styles.progressOverviewWrap}>
          <CircularProgress percentage={overallProgress.percentage} />
          <div style={styles.progressOverviewText}>
            <p>
              <strong>Total completed:</strong> {overallProgress.totalCompleted}
            </p>
            <p>
              <strong>Total target:</strong> {overallProgress.totalTarget}
            </p>
            <p>
              <strong>Reading:</strong> {overallProgress.readingDone} /{" "}
              {overallProgress.readingTarget} mins
            </p>
            <p style={styles.muted}>Build this to 100% by game day.</p>
          </div>
        </div>

        {ready && (
          <div style={styles.celebrationCard}>
            <div style={styles.celebrationTitle}>🔥 GAME READY 🔥</div>
            <div>You’ve made it. Let’s play.</div>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Progress Report</SectionTitle>
        <p style={styles.subheading}>
          Create weekly goals. Log progress each session. Track completion
          against the target.
        </p>

        {weeklyProgress.length ? (
          weeklyProgress.map((goal) => (
            <ProgressGoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <p style={styles.muted}>No progress targets set yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Focus Points for the Game This Weekend</SectionTitle>
        {gameFocusPoints.length ? (
          gameFocusPoints.map((item, index) => (
            <div key={`${item}-${index}`} style={styles.pill}>
              {item}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No focus points logged yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Session Reflections Summary</SectionTitle>

        <h4 style={styles.smallHeading}>What did I do well?</h4>
        {sessionReflectionSummary.positives.length ? (
          sessionReflectionSummary.positives.map((item, index) => (
            <div key={`${item}-${index}`} style={styles.pill}>
              {item}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No positive reflections yet.</p>
        )}

        <h4 style={styles.smallHeading}>What do I need to focus on next?</h4>
        {sessionReflectionSummary.focusItems.length ? (
          sessionReflectionSummary.focusItems.map((item, index) => (
            <div key={`${item}-${index}`} style={styles.pill}>
              {item}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No next-session focuses yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Game Preparation Review</SectionTitle>

        <h4 style={styles.smallHeading}>Game Review Key Points</h4>
        {preparationSummary.reviewPoints.length ? (
          preparationSummary.reviewPoints.map((item, index) => (
            <div key={`${item}-${index}`} style={styles.pill}>
              {item}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No game review points yet.</p>
        )}

        <h4 style={styles.smallHeading}>Opposition Preview Key Points</h4>
        {preparationSummary.oppositionPoints.length ? (
          preparationSummary.oppositionPoints.map((item, index) => (
            <div key={`${item}-${index}`} style={styles.pill}>
              {item}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No opposition preview points yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Weekly History</SectionTitle>
        {!currentWeekEntries.length ? (
          <p style={styles.muted}>No session history for this week yet.</p>
        ) : (
          currentWeekEntries.map((entry) => (
            <div key={entry.id} style={styles.historyCard}>
              <div style={styles.historyHeader}>
                <strong>{entry.day}</strong>
                <span style={styles.historyDate}>{entry.date}</span>
              </div>
              <p>
                <strong>Tags:</strong>{" "}
                {entry.sessionTags.length ? entry.sessionTags.join(", ") : "-"}
              </p>
              <p>
                <strong>Energy:</strong> {entry.energyToday || "-"} / 10
              </p>
              <p>
                <strong>Mood:</strong> {entry.mood || "-"} / 10
              </p>
              <p>
                <strong>Sleep:</strong> {entry.sleep || "-"} / 10
              </p>
              {!entry.sessionTags.includes("Match") && (
                <p>
                  <strong>Load:</strong> {entry.sessionRating || "-"} / 10
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Yearly Goals Progress</SectionTitle>
        {profile.yearlyGoals.length ? (
          profile.yearlyGoals.map((goal) => {
            const checked = !!profile.yearlyGoalCompletion[goal];
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleYearGoalComplete(goal)}
                style={{
                  ...styles.goalCheckRow,
                  ...(checked ? styles.goalCheckRowDone : {}),
                }}
              >
                <span
                  style={{
                    ...styles.goalCheckBox,
                    ...(checked ? styles.goalCheckBoxDone : {}),
                  }}
                >
                  {checked ? "✓" : ""}
                </span>
                <span style={checked ? styles.goalTextDone : {}}>{goal}</span>
              </button>
            );
          })
        ) : (
          <p style={styles.muted}>No yearly goals yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Past Weeks</SectionTitle>
        {pastWeeks.length ? (
          pastWeeks.map((week) => (
            <div key={week.weekKey} style={styles.historyCard}>
              <div style={styles.historyHeader}>
                <strong>Week of {week.weekKey}</strong>
                <span style={styles.historyDate}>
                  {week.overallProgress.percentage}%
                </span>
              </div>
              <p>
                <strong>Total:</strong> {week.overallProgress.totalCompleted} /{" "}
                {week.overallProgress.totalTarget}
              </p>
              <p>
                <strong>Entries:</strong> {week.entries.length}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.muted}>No closed weeks yet.</p>
        )}
      </div>

      <button type="button" style={styles.closeWeekBtn} onClick={closeWeek}>
        Close Week
      </button>
    </div>
  );
}

function ProfileView({ profile }) {
  return (
    <div style={styles.stack}>
      <div style={styles.cardHeroProfile}>
        <div style={styles.profileHeroRow}>
          {profile.image ? (
            <img
              src={profile.image}
              alt="Athlete"
              style={styles.profileHeroImage}
            />
          ) : (
            <div style={styles.profileHeroPlaceholder}>ATHLYT</div>
          )}

          <div style={styles.profileHeroText}>
            <div style={styles.profileHeroName}>
              {profile.name || "Athlete"}
            </div>
            <div style={styles.profileHeroMeta}>
              {profile.sport || "Sport"} ·{" "}
              {profile.positionPrimary || "Position"}
            </div>
            <div style={styles.profileHeroTag}>Identity Driven</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <SectionTitle>Identity</SectionTitle>
        <div style={styles.identityBox}>
          {profile.northStars[0] || "Define your North Star"}
        </div>
      </div>

      <div style={styles.card}>
        <SectionTitle>Profile</SectionTitle>
        <p>
          <strong>Email:</strong> {profile.email || "-"}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone || "-"}
        </p>
        <p>
          <strong>Height:</strong>{" "}
          {profile.height ? `${profile.height} cm` : "-"}
        </p>
        <p>
          <strong>Weight:</strong>{" "}
          {profile.weight ? `${profile.weight} kg` : "-"}
        </p>
        <p>
          <strong>Primary Position:</strong> {profile.positionPrimary || "-"}
        </p>
        <p>
          <strong>Secondary Position:</strong>{" "}
          {profile.positionSecondary || "-"}
        </p>
      </div>

      <div style={styles.card}>
        <SectionTitle>Year Goals</SectionTitle>
        {profile.yearlyGoals.length ? (
          profile.yearlyGoals.map((goal, index) => (
            <div key={`${goal}-${index}`} style={styles.pill}>
              {goal}
            </div>
          ))
        ) : (
          <p style={styles.muted}>No yearly goals yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <SectionTitle>Accountability Team</SectionTitle>
        {profile.accountabilityPeople.length ? (
          profile.accountabilityPeople.map((person, index) => (
            <div
              key={`${person.name}-${index}`}
              style={styles.accountabilityCard}
            >
              <div style={styles.accountabilityRole}>{person.role}</div>
              <div style={styles.accountabilityName}>{person.name}</div>
              <div style={styles.metaText}>{person.contact}</div>
            </div>
          ))
        ) : (
          <p style={styles.muted}>No accountability people added yet.</p>
        )}
      </div>
    </div>
  );
}

function GoalRow({ text, onDelete }) {
  return (
    <div style={styles.targetRow}>
      <div style={styles.targetRowMain}>
        <div style={styles.pill}>{text}</div>
      </div>
      <button type="button" style={styles.deleteBtn} onClick={onDelete}>
        ×
      </button>
    </div>
  );
}

function Logo() {
  return (
    <div style={styles.logoWrap}>
      <div style={styles.logoIcon} />
      <div style={styles.logoText}>ATHLYT</div>
    </div>
  );
}

function NavButtons({ step, setStep }) {
  return (
    <div style={styles.row}>
      <button
        type="button"
        style={styles.btnGhost}
        onClick={() => setStep(Math.max(0, step - 1))}
      >
        Back
      </button>
      <button
        type="button"
        style={styles.btnHalf}
        onClick={() => setStep(step + 1)}
      >
        Continue
      </button>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 style={styles.sectionTitle}>{children}</h3>;
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function QuoteCard({ quote, onNext }) {
  return (
    <div style={styles.quoteCard}>
      <div style={styles.quoteTag}>{quote.theme}</div>
      <p style={styles.quoteText}>“{quote.text}”</p>
      <p style={styles.quoteAuthor}>— {quote.author}</p>
      <button type="button" style={styles.quoteBtn} onClick={onNext}>
        Next Quote
      </button>
    </div>
  );
}

function RatingSelector({ label, value, onChange, startLabel, endLabel }) {
  return (
    <div style={styles.metricBlock}>
      <div style={styles.metricHeader}>
        <span style={styles.metricLabel}>{label}</span>
        <span style={styles.metricValue}>
          {value ? `${value}/10` : "Select"}
        </span>
      </div>
      <div style={styles.ratingLabels}>
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
      <div style={styles.ratingGrid}>
        {Array.from({ length: 10 }, (_, index) => {
          const number = index + 1;
          const active = Number(value) === number;
          return (
            <button
              key={number}
              type="button"
              onClick={() => onChange(number)}
              style={{
                ...styles.ratingBtn,
                ...(active ? styles.ratingBtnActive : {}),
              }}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleSelector({ label, value, options, onChange }) {
  return (
    <div style={styles.recoveryRow}>
      <span style={styles.metricLabel}>{label}</span>
      <div style={styles.toggleRow}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              ...styles.toggleBtn,
              ...(value === option ? styles.toggleBtnActive : {}),
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressGoalCard({ goal }) {
  const percentage = goal.target
    ? Math.min((goal.completed / goal.target) * 100, 100)
    : 0;

  return (
    <div style={styles.progressCard}>
      <div style={styles.progressTopRow}>
        <strong>{goal.title}</strong>
        <span>
          {goal.completed} / {goal.target}
        </span>
      </div>
      <div style={styles.progressBarWrap}>
        <div style={{ ...styles.progressBar, width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function CircularProgress({ percentage }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={styles.circleWrap}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#2f8cff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div style={styles.circleCenter}>{percentage}%</div>
    </div>
  );
}

function LabeledField({ label, children }) {
  return (
    <div style={styles.fieldBlock}>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

function SuffixInput({
  value,
  onChange,
  placeholder,
  suffix,
  inputMode = "text",
}) {
  return (
    <div style={styles.suffixWrap}>
      <input
        style={styles.suffixInput}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
      />
      <span style={styles.suffixText}>{suffix}</span>
    </div>
  );
}

function ChipSelector({
  options,
  value,
  onChange,
  emptyText = "No options available",
  disabled = false,
  multi = false,
}) {
  if (!options.length) {
    return <div style={styles.emptySelector}>{emptyText}</div>;
  }

  const isActive = (option) =>
    multi ? Array.isArray(value) && value.includes(option) : value === option;

  return (
    <div style={styles.selectorGrid}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          style={{
            ...styles.selectorChip,
            ...(isActive(option) ? styles.selectorChipActive : {}),
            ...(disabled ? styles.selectorChipDisabled : {}),
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

const styles = {
  app: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: "linear-gradient(180deg, #07101d 0%, #050914 100%)",
    minHeight: "100vh",
    padding: 16,
    color: "#ffffff",
  },
  shell: {
    maxWidth: 580,
    margin: "0 auto",
  },
  stack: {
    display: "grid",
    gap: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  card: {
    background: "rgba(17, 24, 39, 0.94)",
    padding: 20,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
  },
  cardHero: {
    background:
      "linear-gradient(135deg, rgba(47,140,255,0.22), rgba(29,78,216,0.32))",
    padding: 22,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
  },
  cardHeroProfile: {
    background:
      "linear-gradient(135deg, rgba(47,140,255,0.24), rgba(14,165,233,0.15))",
    padding: 22,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
  },
  cardWarning: {
    background: "rgba(153, 27, 27, 0.22)",
    border: "1px solid rgba(239, 68, 68, 0.32)",
    color: "#fecaca",
    padding: 16,
    borderRadius: 16,
    fontWeight: 700,
  },
  cardGameDay: {
    background:
      "linear-gradient(135deg, rgba(47,140,255,0.22), rgba(124,58,237,0.18))",
    padding: 20,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
  },
  heading: {
    margin: "8px 0 6px",
    fontSize: 24,
    fontWeight: 800,
  },
  heroName: {
    fontSize: 28,
    fontWeight: 800,
    margin: "8px 0 6px",
  },
  heroMeta: {
    color: "#dbeafe",
    margin: 0,
  },
  heroBadge: {
    marginTop: 10,
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 700,
  },
  heroRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  heroTextWrap: {
    flex: 1,
  },
  heroImage: {
    width: 92,
    height: 92,
    borderRadius: 22,
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.12)",
  },
  heroImagePlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    border: "2px solid rgba(255,255,255,0.12)",
    fontWeight: 800,
  },
  subheading: {
    marginTop: 0,
    marginBottom: 12,
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 1.5,
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 18,
    fontSize: 18,
    fontWeight: 700,
  },
  smallHeading: {
    marginBottom: 8,
    marginTop: 14,
    fontSize: 15,
  },
  input: {
    width: "100%",
    display: "block",
    padding: 12,
    marginBottom: 16,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 14,
    color: "#fff",
    boxSizing: "border-box",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    outline: "none",
  },
  inputTopSpacing: {
    width: "100%",
    display: "block",
    padding: 12,
    marginTop: 10,
    marginBottom: 16,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 14,
    color: "#fff",
    boxSizing: "border-box",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    display: "block",
    padding: 14,
    marginBottom: 16,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 14,
    color: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    lineHeight: 1.5,
    outline: "none",
  },
  textareaTopSpacing: {
    width: "100%",
    minHeight: 96,
    display: "block",
    padding: 14,
    marginTop: 16,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 14,
    color: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    lineHeight: 1.5,
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: 14,
    background: "linear-gradient(135deg, #2f8cff, #2563eb)",
    border: "none",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(47,140,255,0.22)",
  },
  btnSecondary: {
    width: "100%",
    padding: 12,
    background: "transparent",
    border: "1px solid #2f8cff",
    color: "#2f8cff",
    borderRadius: 14,
    marginTop: 0,
    cursor: "pointer",
  },
  btnGhost: {
    flex: 1,
    padding: 12,
    background: "#1f2937",
    border: "1px solid #374151",
    color: "#fff",
    borderRadius: 14,
    cursor: "pointer",
  },
  btnHalf: {
    flex: 1,
    padding: 12,
    background: "linear-gradient(135deg, #2f8cff, #2563eb)",
    border: "none",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  smallPrimaryBtn: {
    padding: "10px 14px",
    background: "linear-gradient(135deg, #2f8cff, #2563eb)",
    border: "none",
    color: "#fff",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  closeWeekBtn: {
    width: "100%",
    padding: 16,
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none",
    color: "#fff",
    borderRadius: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(16,185,129,0.22)",
  },
  row: {
    display: "flex",
    gap: 10,
  },
  actionSpacing: {
    marginTop: 6,
    marginBottom: 12,
  },
  lockRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  lockText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  navFive: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 8,
    marginTop: 16,
    background: "rgba(9, 17, 31, 0.96)",
    padding: 10,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  navBtn: {
    padding: "10px 6px",
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  navBtnActive: {
    background: "#111827",
    color: "#ffffff",
    border: "1px solid #2f8cff",
  },
  logoWrap: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  logoIcon: {
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderBottom: "14px solid #2f8cff",
  },
  logoText: {
    letterSpacing: 4,
    fontWeight: 800,
    fontSize: 14,
  },
  pill: {
    background: "#1f2937",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    border: "1px solid rgba(255,255,255,0.04)",
  },
  muted: {
    color: "#9ca3af",
  },
  metaText: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  statCard: {
    background: "#111827",
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 6,
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },
  historyCard: {
    padding: 14,
    background: "#0f172a",
    borderRadius: 14,
    marginBottom: 12,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  historyDate: {
    color: "#9ca3af",
    fontSize: 12,
  },
  dayRowSingleLine: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
    scrollbarWidth: "none",
    whiteSpace: "nowrap",
    marginBottom: 12,
  },
  dayChip: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #374151",
    background: "#111827",
    color: "#d1d5db",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  dayChipActive: {
    background: "#2f8cff",
    color: "#fff",
    border: "1px solid #2f8cff",
  },
  targetRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  targetRowMain: {
    flex: 1,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1px solid #7f1d1d",
    background: "rgba(127, 29, 29, 0.18)",
    color: "#fecaca",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
    flexShrink: 0,
  },
  dayBadge: {
    display: "inline-block",
    marginBottom: 14,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(47,140,255,0.15)",
    border: "1px solid rgba(47,140,255,0.35)",
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 700,
  },
  metricBlock: {
    marginBottom: 22,
  },
  metricHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: 700,
  },
  metricValue: {
    fontSize: 13,
    color: "#9ca3af",
  },
  ratingLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 10,
  },
  ratingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 8,
  },
  ratingBtn: {
    padding: "12px 0",
    borderRadius: 12,
    border: "1px solid #374151",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  ratingBtnActive: {
    background: "#2f8cff",
    border: "1px solid #2f8cff",
  },
  recoveryRow: {
    marginBottom: 14,
  },
  toggleRow: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #374151",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  toggleBtnActive: {
    background: "#2f8cff",
    border: "1px solid #2f8cff",
  },
  progressInputWrapSpacious: {
    marginBottom: 18,
  },
  progressCard: {
    padding: 14,
    background: "#0f172a",
    borderRadius: 14,
    marginBottom: 12,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  progressTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  progressBarWrap: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    background: "#1f2937",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 999,
    background: "#2f8cff",
  },
  progressOverviewWrap: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  },
  progressOverviewText: {
    flex: 1,
    minWidth: 180,
  },
  circleWrap: {
    position: "relative",
    width: 120,
    height: 120,
    flexShrink: 0,
  },
  circleCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 800,
  },
  celebrationCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(47,140,255,0.24))",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
  },
  celebrationTitle: {
    fontWeight: 800,
    fontSize: 22,
    marginBottom: 6,
  },
  quoteCard: {
    background:
      "linear-gradient(135deg, rgba(47,140,255,0.18), rgba(124,58,237,0.16))",
    padding: 20,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  quoteTag: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 1.45,
    margin: "0 0 10px",
    fontWeight: 700,
  },
  quoteAuthor: {
    color: "#cbd5e1",
    marginTop: 0,
    marginBottom: 14,
  },
  quoteBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#cbd5e1",
    marginBottom: 8,
    fontWeight: 700,
  },
  suffixWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 12,
    padding: "0 12px",
    marginBottom: 14,
  },
  suffixInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#fff",
    padding: 14,
    outline: "none",
    fontSize: 14,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  suffixText: {
    color: "#9ca3af",
    fontWeight: 700,
    fontSize: 13,
  },
  selectorGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  selectorChip: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #374151",
    background: "#111827",
    color: "#d1d5db",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
  },
  selectorChipActive: {
    background: "linear-gradient(135deg, #2f8cff, #2563eb)",
    border: "1px solid #2f8cff",
    color: "#ffffff",
    boxShadow: "0 0 0 2px rgba(47,140,255,0.15)",
  },
  selectorChipDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  emptySelector: {
    padding: 12,
    borderRadius: 12,
    background: "#111827",
    border: "1px solid #374151",
    color: "#9ca3af",
    fontSize: 13,
  },
  goalCheckRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginBottom: 10,
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: 14,
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },
  goalCheckRowDone: {
    opacity: 0.8,
  },
  goalCheckBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "1px solid #4b5563",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  goalCheckBoxDone: {
    background: "#2f8cff",
    border: "1px solid #2f8cff",
  },
  goalTextDone: {
    textDecoration: "line-through",
    color: "#9ca3af",
  },
  uploadRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  uploadButton: {
    padding: "12px 14px",
    background: "rgba(47,140,255,0.12)",
    border: "1px solid rgba(47,140,255,0.4)",
    borderRadius: 14,
    color: "#dbeafe",
    fontWeight: 700,
    cursor: "pointer",
  },
  profileThumb: {
    width: 72,
    height: 72,
    borderRadius: 18,
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  profileThumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111827",
    border: "1px solid #374151",
    color: "#9ca3af",
    fontSize: 12,
  },
  readingCard: {
    padding: 14,
    borderRadius: 16,
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  readingLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  },
  readingBook: {
    fontWeight: 700,
    color: "#fff",
  },
  breathingBox: {
    textAlign: "center",
    padding: 20,
    background: "#1f2937",
    borderRadius: 16,
    marginBottom: 12,
  },
  timer: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 8,
  },
  breathStep: {
    fontSize: 18,
    color: "#2f8cff",
    fontWeight: 700,
  },
  meditationNote: {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 13,
  },
  profileHeroRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  profileHeroImage: {
    width: 120,
    height: 120,
    borderRadius: 28,
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.12)",
  },
  profileHeroPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    border: "2px solid rgba(255,255,255,0.12)",
    fontWeight: 800,
  },
  profileHeroText: {
    flex: 1,
    minWidth: 180,
  },
  profileHeroName: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 6,
  },
  profileHeroMeta: {
    color: "#dbeafe",
    marginBottom: 10,
  },
  profileHeroTag: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 700,
  },
  identityBox: {
    padding: 18,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, rgba(47,140,255,0.16), rgba(124,58,237,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.4,
  },
  accountabilityCard: {
    padding: 14,
    borderRadius: 16,
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  accountabilityRole: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(47,140,255,0.14)",
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  accountabilityName: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
};
