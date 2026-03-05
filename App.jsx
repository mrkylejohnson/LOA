import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

const B = {
  red: "#8B1A1A", darkRed: "#5C0E0E", black: "#0A0A0A", char: "#1A1A1A",
  steel: "#2A2A2A", silver: "#B0B0B0", white: "#F5F0EB", gold: "#D4A853",
  accent: "#C62828", green: "#4CAF50",
};

const STEPS = [
  { letter: "W", title: "WELCOME", tagline: "First impressions set the tone — even through a car window.",
    script: "Hi, welcome to Nellis Auction, let's get you checked in!",
    why: "Customers are sitting in their car, possibly anxious about pickup. A warm, confident greeting through the window immediately puts them at ease and signals the process is smooth and professional.",
    tips: ["Approach the vehicle with a smile and wave", "Use an upbeat, natural tone — not robotic", "If they're on the phone, give a friendly wave and wait a beat"],
    doEx: '"Hey there! Welcome to Nellis Auction — let\'s get you checked in!"', dontEx: '*Walks up silently* "...Name?"' },
  { letter: "I", title: "IDENTIFY", tagline: "Know who you're helping.",
    script: "May I have your phone # or name?",
    why: "Identification bridges greeting and service. It shows the customer you're organized and ready to help them specifically — not just processing cars in a line.",
    tips: ["Ask clearly — road noise can make it hard to hear", "Be ready to spell-check or confirm", "If using a tablet, angle the screen so they can verify"],
    doEx: '"Can I grab your phone number or name to pull up your order?"', dontEx: '"Number." *no eye contact*' },
  { letter: "N", title: "NAME & NUMBER", tagline: "Confirm their first name and number of items.",
    script: "(First Name), picking up 5 items? ~Confirm~",
    why: "Confirming the customer's name and the number of items prevents loading errors, builds trust, and makes the customer feel seen. Using their first name adds a personal touch that separates good service from great.",
    tips: ["Always use the customer's FIRST NAME", "State the NUMBER of items clearly", "Pause briefly to let them confirm or correct"],
    doEx: '"Sarah, looks like you\'ve got 5 items today — does that sound right?"', dontEx: '"Okay, 5 items." *already walking away*' },
  { letter: "N", title: "NEXT STEPS", tagline: "Set expectations clearly.",
    script: "We have your order ready. Should be just a couple of minutes.",
    scriptAlt: "They are still picking your order, we will be out as soon as possible.",
    why: "Customers sitting in their car hate uncertainty. Telling them what happens next — whether it's great news or requires patience — keeps them calm and shows you respect their time.",
    tips: ["For CONSOLIDATED: Let them know it's ready + time estimate", "For NOT-CONSOLIDATED: Be honest, give reassurance", "Never leave them sitting and guessing"],
    doEx: '"Great news — your order\'s all set! Give us just a couple minutes."', dontEx: '"Just wait here." *walks away*', hasAlt: true },
  { letter: "E", title: "ENSURE", tagline: "Catch issues before they drive off.",
    script: "Do you have any returns today?",
    why: "Once a customer drives away, a missed return becomes a much bigger problem. Proactively asking prevents callbacks, re-visits, and frustration for everyone.",
    tips: ["Ask EVERY customer, even regulars", "Keep the tone casual, not accusatory", "If they do have a return, handle it smoothly on the spot"],
    doEx: '"Before we wrap up — do you have any returns with you today?"', dontEx: '*Skips step — customer drives back 20 minutes later, frustrated*' },
  { letter: "R", title: "RECOGNIZE", tagline: "End on a high note.",
    script: "Thanks for winning with us!",
    why: "The last thing a customer hears as they drive off sticks with them. 'Thanks for winning with us' reinforces the excitement of the auction experience and keeps them coming back.",
    tips: ["Say it with genuine energy", "Make eye contact one more time", "Add a personal touch: 'Enjoy that new TV!'"],
    doEx: '"Thanks for winning with us, Sarah! Enjoy your haul!"', dontEx: '"Next!" *already walking to next car*' },
];

const QUIZ = [
  { q: "A customer pulls into the lot. What is your FIRST action?", opts: ["Ask for their phone number", "Greet them warmly and welcome them", "Start looking up their order", "Ask if they have returns"], correct: 1, exp: "W = WELCOME comes first." },
  { q: "What does the 'I' in W.I.N.N.E.R. stand for?", opts: ["Instruct", "Identify", "Inform", "Inspect"], correct: 1, exp: "I = IDENTIFY. Ask for their phone number or name." },
  { q: "During the Name & Number step, what should you ALWAYS include?", opts: ["Their order number only", "Their last name", "Their first name and number of items", "Just the item count"], correct: 2, exp: "First name personalizes it. Confirming the number of items prevents loading errors." },
  { q: "Order is NOT consolidated. What do you say?", opts: ['"Just wait here."', '"I don\'t know when it\'ll be ready."', '"They are still picking your order, we will be out as soon as possible."', '"Come back later."'], correct: 2, exp: "Be honest and reassuring. Set expectations clearly." },
  { q: "Why is ENSURE critical for curbside?", opts: ["To upsell items", "To ask about returns before they drive off", "To confirm payment", "To check their ID"], correct: 1, exp: "Once they drive away, a missed return is a much bigger problem." },
  { q: "What is the closing phrase?", opts: ['"Have a good day!"', '"See you next time!"', '"Thanks for winning with us!"', '"Goodbye!"'], correct: 2, exp: '"Thanks for winning with us!" reinforces the auction excitement.' },
  { q: "Correct step order?", opts: ["Welcome → Identify → Name & Number → Next Steps → Ensure → Recognize", "Identify → Welcome → Name & Number → Next Steps → Recognize → Ensure", "Welcome → Name & Number → Identify → Next Steps → Ensure → Recognize", "Welcome → Identify → Next Steps → Name & Number → Ensure → Recognize"], correct: 0, exp: "W-I-N-N-E-R in order: Welcome, Identify, Name & Number, Next Steps, Ensure, Recognize." },
  { q: "Customer seems impatient in their car. Best approach?", opts: ["Ignore them", "Apologize and give a clear update on timing", "Tell them to come back tomorrow", "Blame the warehouse"], correct: 1, exp: "A quick, honest update reduces anxiety." },
];

const SCENARIOS = [
  { title: "The Regular in the Truck", setup: "Mike pulls up in his truck. He's been here dozens of times and looks in a hurry. He has 3 items.", steps: [
    { prompt: "Mike just pulled up. What first?", tag: "W — WELCOME", opts: [{ text: '"Hi, welcome to Nellis Auction, let\'s get you checked in!"', correct: true, fb: "Perfect WELCOME!" }, { text: '"The usual, Mike?"', correct: false, fb: "Too casual. Full W.I.N.N.E.R. every time." }, { text: '"Phone number?"', correct: false, fb: "Skipped welcome." }] },
    { prompt: "Good greeting! Next?", tag: "I — IDENTIFY", opts: [{ text: '"Can I grab your phone number or name?"', correct: true, fb: "Perfect IDENTIFY." }, { text: '"What are you picking up?"', correct: false, fb: "Skipped IDENTIFY." }, { text: '"How many items?"', correct: false, fb: "Jumping ahead." }] },
    { prompt: "3 items pulled up. What do you say?", tag: "N — NAME & NUMBER", opts: [{ text: '"Mike, picking up 3 items — does that look right?"', correct: true, fb: "Name + count + confirm." }, { text: '"3 items. Okay."', correct: false, fb: "No personalization." }, { text: '"Looks like you\'ve got some stuff."', correct: false, fb: "Too vague." }] },
    { prompt: "Order is consolidated. What now?", tag: "N — NEXT STEPS", opts: [{ text: '"Your order\'s all ready — just a couple minutes!"', correct: true, fb: "Perfect NEXT STEPS." }, { text: '"They\'re still working on it."', correct: false, fb: "Wrong script!" }, { text: '"Follow me." *walks away*', correct: false, fb: "Set expectations first." }] },
    { prompt: "What do you ask before finishing?", tag: "E — ENSURE", opts: [{ text: '"Any returns today?"', correct: true, fb: "ENSURE — ask every time." }, { text: '"Thanks for winning with us!"', correct: false, fb: "Skipped ENSURE!" }, { text: '"Everything good?"', correct: false, fb: "Too vague." }] },
    { prompt: "No returns. Close it out!", tag: "R — RECOGNIZE", opts: [{ text: '"Thanks for winning with us, Mike!"', correct: true, fb: "Perfect RECOGNIZE!" }, { text: '"Bye."', correct: false, fb: "Missed opportunity." }, { text: '"Next!"', correct: false, fb: "Never dismiss a customer." }] },
  ] },
  { title: "The Nervous First-Timer", setup: "A woman pulls up slowly, looking uncertain. First time here. She won 1 item — a vintage lamp.", steps: [
    { prompt: "She parks, looks uncertain. What do you do?", tag: "W — WELCOME", opts: [{ text: '"Welcome to Nellis Auction! Super easy — let\'s get you checked in!"', correct: true, fb: "Great reassurance." }, { text: '"Phone number?"', correct: false, fb: "No welcome!" }, { text: '"Have you been here before?"', correct: false, fb: "Welcome first." }] },
    { prompt: "She relaxes. What's next?", tag: "I — IDENTIFY", opts: [{ text: '"Can I get your phone number or name on the order?"', correct: true, fb: "Clean IDENTIFY." }, { text: '"What did you win?"', correct: false, fb: "Identify first." }, { text: '"Do you have your receipt?"', correct: false, fb: "Not IDENTIFY." }] },
    { prompt: "Lisa, 1 item. Confirm it.", tag: "N — NAME & NUMBER", opts: [{ text: '"Lisa, 1 item for you today — sound right?"', correct: true, fb: "Perfect CONFIRM." }, { text: '"One lamp, got it."', correct: false, fb: "Use her name!" }, { text: '"Yep, you\'re in the system."', correct: false, fb: "Not a confirmation." }] },
    { prompt: "NOT consolidated. What do you say?", tag: "N — NEXT STEPS", opts: [{ text: '"They\'re still getting it together — we\'ll bring it out ASAP!"', correct: true, fb: "Honest and reassuring." }, { text: '"Your order\'s ready!"', correct: false, fb: "Don't lie." }, { text: '"It\'s gonna be a while."', correct: false, fb: "Too negative." }] },
    { prompt: "Lamp loaded. What do you check?", tag: "E — ENSURE", opts: [{ text: '"Any returns today?"', correct: true, fb: "ENSURE — clear and casual." }, { text: '"You\'re all set!"', correct: false, fb: "Skipped ENSURE!" }, { text: '"Is the lamp okay?"', correct: false, fb: "ENSURE = returns." }] },
    { prompt: "No returns. Send her off!", tag: "R — RECOGNIZE", opts: [{ text: '"Thanks for winning with us, Lisa! Enjoy the lamp!"', correct: true, fb: "Name + item!" }, { text: '"Bye, have a good one."', correct: false, fb: "Use the phrase!" }, { text: '"Thanks." *turns away*', correct: false, fb: "Proper sendoff." }] },
  ] },
];

const VIDEO_PHASES = [
  { id: "bad", label: "THE BAD EXPERIENCE", subtitle: "Watch how NOT to check in a customer", color: B.accent,
    url: "https://youtu.be/bzC94Wgm6tU", thumbId: "bzC94Wgm6tU",
    intro: "This video shows a rushed, careless check-in. The employee skips steps, avoids eye contact, seems annoyed, and has to come back when the customer calls him out. Watch closely — you'll be asked what went wrong.",
    questions: [
      { q: "What was missing right at the start of the interaction?", opts: ["A warm welcome/greeting", "A handshake", "Asking for payment", "Checking their trunk"], correct: 0, exp: "The employee skipped the WELCOME entirely — no greeting, no warmth, no 'let's get you checked in.'" },
      { q: "How would you describe the employee's body language?", opts: ["Engaged and attentive", "Rushing, no eye contact, visibly annoyed", "Nervous but trying", "Professional and calm"], correct: 1, exp: "The employee rushed through, avoided eye contact, and seemed annoyed — the customer feels all of that." },
      { q: "What critical step did the employee skip that forced him to come back?", opts: ["Welcome", "Identify", "Ensure (asking about returns)", "Recognize"], correct: 2, exp: "He didn't ask about returns (ENSURE). The customer had to call him back — frustration for both sides." },
      { q: "How do you think the customer felt after this experience?", opts: ["Valued and appreciated", "Rushed, unimportant, and frustrated", "Neutral — they got their items", "Excited to come back"], correct: 1, exp: "Even though they got their items, the experience felt dismissive. Far less likely to feel good about Nellis Auction." },
    ] },
  { id: "good", label: "THE W.I.N.N.E.R. WAY", subtitle: "Watch the correct approach in action", color: B.green,
    url: "https://youtu.be/jrazX865yjg", thumbId: "jrazX865yjg",
    intro: "Now watch how the W.I.N.N.E.R. framework looks in real life. Notice the greeting, the eye contact, the confirmation, and how naturally the employee handles everything — including a customer return.",
    questions: [
      { q: "What did the employee do before anything else?", opts: ["Asked for the phone number", "Gave a warm welcome and offered to check them in", "Started loading items", "Asked about returns"], correct: 1, exp: "They led with WELCOME — a friendly, confident greeting that set the entire tone." },
      { q: "How did the employee handle the customer's return?", opts: ["Told them to come back another day", "Got frustrated", "Asked proactively (ENSURE) and handled it smoothly", "Ignored it"], correct: 2, exp: "The ENSURE step caught the return before they drove off. Handled on the spot — no callbacks." },
      { q: "What W.I.N.N.E.R. steps can you identify in this video?", opts: ["Only Welcome and Recognize", "Welcome, Identify, and Next Steps", "All 6: Welcome, Identify, Confirm, Next Steps, Ensure, Recognize", "Just Identify and Confirm"], correct: 2, exp: "All 6 steps were followed in order. That's the framework in action." },
      { q: "How did the interaction end?", opts: ["Employee walked away silently", "'Thanks for winning with us!' with a smile", "'Bye.'", "Already helping the next car"], correct: 1, exp: "RECOGNIZE — a personalized, energetic sendoff. The last impression they take home." },
    ] },
  { id: "compare", label: "SAME TIME, DIFFERENT IMPACT", subtitle: "The good experience was actually 3 seconds shorter", color: B.gold,
    url: "https://youtu.be/nYFNaHyFqGM", thumbId: "nYFNaHyFqGM",
    intro: "Here's the moment that changes everything: the good experience and the bad experience take the same amount of time. In fact, the W.I.N.N.E.R. approach was 3 seconds shorter. There is zero excuse to skip steps.",
    questions: [
      { q: "Which check-in experience took longer?", opts: ["The good W.I.N.N.E.R. approach", "The bad rushed approach", "They were about the same — the bad one was actually longer!", "The video doesn't compare time"], correct: 2, exp: "The bad experience was actually LONGER! Skipping steps doesn't save time — it creates problems." },
      { q: "Why does the bad approach sometimes take MORE time?", opts: ["The employee walks slower", "Skipping steps causes callbacks, confusion, and re-work", "The customer talks more", "It's random"], correct: 1, exp: "Skip ENSURE → customer calls you back. Skip CONFIRM → wrong items loaded. Cutting corners = more work." },
      { q: "What's the #1 takeaway from this comparison?", opts: ["Speed is all that matters", "Doing it right takes the same time — no reason NOT to follow W.I.N.N.E.R.", "The framework is optional when busy", "Customers don't notice"], correct: 1, exp: "The core truth: W.I.N.N.E.R. costs ZERO extra time but creates a dramatically better experience." },
    ],
    finalPrompt: true },
];

// ── Supabase Storage ──
async function saveResult(record) {
  try {
    const { error } = await supabase.from("training_results").insert([{
      employee_name: record.name,
      completed_at: record.date,
      quiz_score: record.quizScore,
      quiz_total: record.quizTotal,
      scenario_score: record.scenarioScore,
      scenario_total: record.scenarioTotal,
      passed: record.passed,
      minutes: record.minutes,
    }]);
    if (error) { console.error("Save error:", error); return false; }
    return true;
  } catch (e) { console.error("Save error:", e); return false; }
}
async function loadAllResults() {
  try {
    const { data, error } = await supabase
      .from("training_results")
      .select("*")
      .order("completed_at", { ascending: false });
    if (error) { console.error("Load error:", error); return []; }
    return (data || []).map(row => ({
      name: row.employee_name,
      date: row.completed_at,
      quizScore: row.quiz_score,
      quizTotal: row.quiz_total,
      scenarioScore: row.scenario_score,
      scenarioTotal: row.scenario_total,
      passed: row.passed,
      minutes: row.minutes,
    }));
  } catch (e) { console.error("Load error:", e); return []; }
}

// ── Shared UI ──
const Btn = ({ children, primary, gold, disabled, onClick, style }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "16px 32px", borderRadius: 10, border: primary || gold ? "none" : `1px solid ${B.steel}`, background: gold ? B.gold : primary ? B.accent : "transparent", color: gold ? B.black : disabled ? B.steel : primary ? B.white : B.silver, cursor: disabled ? "default" : "pointer", fontSize: 17, fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: 2, textTransform: "uppercase", transition: "all 0.2s", width: "100%", ...style }}>{children}</button>
);
const Bar = ({ total, current }) => (
  <div style={{ display: "flex", gap: 4, margin: "0 0 28px" }}>
    {Array.from({ length: total }).map((_, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= current ? B.gold : B.steel, transition: "background 0.4s" }} />)}
  </div>
);
const ScoreCircle = ({ score, total, size = 140 }) => {
  const pct = total > 0 ? (score / total) * 100 : 0; const c = 2 * Math.PI * 38;
  const col = pct >= 80 ? B.green : pct >= 60 ? B.gold : B.accent;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke={B.steel} strokeWidth="6" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: B.white, fontFamily: "'Oswald'" }}>{Math.round(pct)}%</span>
      </div>
    </div>
  );
};

// ── LOGIN ──
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 16, letterSpacing: 6, color: B.silver, margin: "0 0 10px", fontFamily: "'Oswald'", textTransform: "uppercase" }}>Nellis Auction Resources</div>
      <h1 style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: 900, color: B.white, fontFamily: "'Oswald'", lineHeight: 1, margin: "0 0 6px" }}>W.I.N.N.E.R.</h1>
      <div style={{ fontSize: "clamp(15px, 3vw, 20px)", color: B.gold, fontFamily: "'Oswald'", letterSpacing: 4, textTransform: "uppercase", marginBottom: 40 }}>Curbside CX Training</div>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <label style={{ display: "block", textAlign: "left", fontSize: 14, color: B.gold, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 8 }}>ENTER YOUR FULL NAME</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && name.trim()) onLogin(name.trim()); }}
          placeholder="e.g. John Smith" style={{ width: "100%", padding: "16px 20px", borderRadius: 10, border: `1px solid ${B.steel}`, background: B.char, color: B.white, fontSize: 18, marginBottom: 20, outline: "none", fontFamily: "inherit" }} />
        <Btn primary disabled={!name.trim()} onClick={() => onLogin(name.trim())}>Start Training</Btn>
      </div>
    </div>
  );
}

// ── HOME ──
function Home({ onNav, progress, employeeName, onLogout }) {
  const [popup, setPopup] = useState(null);
  const allDone = progress.videos && progress.lessons && progress.quiz && progress.scenarios;
  const nextStep = !progress.videos ? "videos" : !progress.lessons ? "lessons" : !progress.quiz ? "quiz" : !progress.scenarios ? "scenarios" : null;
  const nextLabel = !progress.videos ? "Begin Training" : !progress.lessons ? "Continue to Lessons" : !progress.quiz ? "Continue to Quiz" : !progress.scenarios ? "Continue to Scenarios" : "Review Training";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ background: B.char, borderRadius: 10, padding: "10px 20px", marginBottom: 20, border: `1px solid ${B.steel}`, display: "inline-flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: B.silver, fontSize: 15 }}>Signed in as</span>
        <span style={{ color: B.gold, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald'" }}>{employeeName}</span>
        <button onClick={onLogout} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Switch</button>
      </div>
      <div style={{ fontSize: 16, letterSpacing: 6, color: B.silver, margin: "0 0 10px", fontFamily: "'Oswald'", textTransform: "uppercase" }}>Nellis Auction Resources</div>
      <h1 style={{ fontSize: "clamp(52px, 12vw, 88px)", fontWeight: 900, color: B.white, fontFamily: "'Oswald'", lineHeight: 1, margin: "0 0 4px" }}>W.I.N.N.E.R.</h1>
      <div style={{ fontSize: "clamp(15px, 3vw, 20px)", color: B.gold, fontFamily: "'Oswald'", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Lot Attendant — Curbside CX Framework</div>
      <p style={{ color: B.silver, fontSize: 17, maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}>
        Master the 6-step curbside script. <strong style={{ color: B.gold }}>Tap any letter</strong> to preview.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {["W","I","N","N","E","R"].map((l, i) => (
          <button key={i} onClick={() => setPopup(popup === i ? null : i)} style={{ width: 66, height: 66, borderRadius: "50%", border: `3px solid ${popup === i ? B.white : B.gold}`, background: popup === i ? B.gold : "transparent", color: popup === i ? B.black : B.gold, fontSize: 30, fontWeight: 800, fontFamily: "'Oswald'", cursor: "pointer", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</button>
        ))}
      </div>
      {popup !== null && (
        <div style={{ background: B.char, border: `1px solid ${B.gold}`, borderRadius: 14, padding: "22px 26px", maxWidth: 540, width: "100%", marginBottom: 28, textAlign: "left", position: "relative", animation: "fadeIn 0.3s ease" }}>
          <button onClick={() => setPopup(null)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: B.silver, fontSize: 22, cursor: "pointer" }}>✕</button>
          <div style={{ fontSize: 14, letterSpacing: 3, color: B.gold, fontFamily: "'Oswald'", marginBottom: 8 }}>{STEPS[popup].letter} — {STEPS[popup].title}</div>
          <div style={{ background: B.steel, borderRadius: 10, padding: 18, borderLeft: `4px solid ${B.gold}` }}>
            <p style={{ color: B.white, fontSize: 19, fontWeight: 600, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>"{STEPS[popup].script}"</p>
            {STEPS[popup].hasAlt && <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${B.char}` }}><div style={{ fontSize: 12, color: B.silver, letterSpacing: 1, marginBottom: 4 }}>IF NOT CONSOLIDATED:</div><p style={{ color: B.silver, fontSize: 17, fontWeight: 600, margin: 0, fontStyle: "italic" }}>"{STEPS[popup].scriptAlt}"</p></div>}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, maxWidth: 560, width: "100%", marginBottom: 36 }}>
        {[{ icon: "🎬", label: "Videos", done: progress.videos }, { icon: "📖", label: "Lessons", done: progress.lessons }, { icon: "✅", label: "Quiz", done: progress.quiz }, { icon: "🎭", label: "Scenarios", done: progress.scenarios }].map((x, i) => (
          <div key={i} style={{ background: B.char, borderRadius: 12, padding: "16px 10px", border: `1px solid ${x.done ? B.gold : B.steel}` }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{x.icon}</div>
            <div style={{ fontSize: 14, color: x.done ? B.gold : B.silver, fontWeight: 700, fontFamily: "'Oswald'", letterSpacing: 1 }}>{x.label}</div>
            <div style={{ fontSize: 12, color: x.done ? B.green : B.silver, marginTop: 4 }}>{x.done ? "DONE" : "—"}</div>
          </div>
        ))}
      </div>
      {allDone && <div style={{ background: `linear-gradient(135deg, ${B.darkRed}, ${B.red})`, borderRadius: 14, padding: "22px 32px", marginBottom: 28, border: `1px solid ${B.gold}` }}><div style={{ fontSize: 24, fontWeight: 700, color: B.gold, fontFamily: "'Oswald'" }}>🏆 TRAINING COMPLETE</div><div style={{ fontSize: 16, color: B.white, marginTop: 6 }}>Great job, {employeeName}! Results saved.</div></div>}
      <div style={{ maxWidth: 360, width: "100%" }}><Btn primary onClick={() => onNav(nextStep || "videos")}>{nextLabel}</Btn></div>
    </div>
  );
}

// ── VIDEOS ──
function VideosPage({ onDone, onBack }) {
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState("watch");
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);

  const p = VIDEO_PHASES[phase];
  const q = p.questions[qIdx];
  const pick = (i) => { if (show) return; setSel(i); setShow(true); if (i === q.correct) setScore(s => s + 1); };
  const nextQ = () => {
    if (qIdx < p.questions.length - 1) { setQIdx(qIdx + 1); setSel(null); setShow(false); }
    else if (p.finalPrompt) { setMode("final"); }
    else if (phase < VIDEO_PHASES.length - 1) { setPhase(phase + 1); setMode("watch"); setQIdx(0); setSel(null); setShow(false); }
    else { onDone(score); }
  };

  if (mode === "final") {
    return (
      <div style={{ minHeight: "100vh", padding: "48px 20px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⏱️</div>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: B.gold, fontFamily: "'Oswald'", margin: "0 0 16px" }}>SAME TIME. BETTER EXPERIENCE.</h2>
        <p style={{ color: B.silver, fontSize: 19, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 28px" }}>
          You just saw it: the W.I.N.N.E.R. framework takes <strong style={{ color: B.white }}>the same amount of time</strong> — actually <strong style={{ color: B.green }}>3 seconds less</strong> — than a rushed, careless check-in.
        </p>
        <div style={{ background: B.char, borderRadius: 14, padding: "24px 28px", textAlign: "left", marginBottom: 28, border: `1px solid ${B.gold}` }}>
          <div style={{ fontSize: 15, letterSpacing: 2, color: B.gold, fontFamily: "'Oswald'", marginBottom: 12 }}>THE BOTTOM LINE</div>
          <p style={{ color: B.white, fontSize: 18, lineHeight: 1.7, margin: "0 0 12px" }}>There is <strong>no reason</strong> to skip steps. No reason to rush. No reason to cut corners.</p>
          <p style={{ color: B.silver, fontSize: 17, lineHeight: 1.7, margin: 0 }}>Following W.I.N.N.E.R. doesn't slow you down — it just makes every customer feel like they matter. And that's what brings them back.</p>
        </div>
        <div style={{ maxWidth: 360, margin: "0 auto" }}><Btn gold onClick={() => onDone(score)}>I'm Ready — Continue to Lessons →</Btn></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", maxWidth: 680, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 16, marginBottom: 22, fontFamily: "'Oswald'", letterSpacing: 1 }}>← BACK TO HOME</button>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {VIDEO_PHASES.map((vp, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= phase ? vp.color : B.steel, transition: "background 0.4s" }} />)}
      </div>
      <div style={{ fontSize: 14, letterSpacing: 3, color: p.color, fontFamily: "'Oswald'", marginBottom: 6 }}>VIDEO {phase + 1} OF {VIDEO_PHASES.length}</div>
      <h2 style={{ fontSize: 30, fontWeight: 800, color: B.white, margin: "0 0 6px", fontFamily: "'Oswald'" }}>{p.label}</h2>
      <p style={{ color: B.silver, fontSize: 17, marginBottom: 20 }}>{p.subtitle}</p>

      {mode === "watch" && (
        <>
          <div style={{ background: B.char, borderRadius: 14, padding: "20px 24px", marginBottom: 24, borderLeft: `4px solid ${p.color}` }}>
            <p style={{ color: B.silver, fontSize: 17, lineHeight: 1.7, margin: 0 }}>{p.intro}</p>
          </div>

          {/* YouTube embed — works on deployed sites; may be restricted in preview */}
          <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 8, background: B.steel, aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${p.thumbId}?rel=0&modestbranding=1`}
              title={p.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <p style={{ color: B.silver, fontSize: 13, textAlign: "center", marginBottom: 20 }}>
            Video not loading? <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: B.gold, textDecoration: "underline" }}>Watch on YouTube ↗</a>
          </p>

          <Btn primary onClick={() => { setMode("questions"); setQIdx(0); setSel(null); setShow(false); }}>
            I've Watched It — Answer Questions →
          </Btn>
        </>
      )}

      {mode === "questions" && (
        <>
          <Bar total={p.questions.length} current={qIdx} />
          <div style={{ fontSize: 14, letterSpacing: 3, color: B.gold, marginBottom: 10, fontFamily: "'Oswald'" }}>QUESTION {qIdx + 1} OF {p.questions.length}</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: B.white, margin: "0 0 24px", lineHeight: 1.4 }}>{q.q}</h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
            {q.opts.map((o, i) => {
              let bg = B.char, bor = B.steel;
              if (show && i === q.correct) { bg = "rgba(76,175,80,0.15)"; bor = B.green; }
              else if (show && i === sel) { bg = "rgba(198,40,40,0.15)"; bor = B.accent; }
              return (
                <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${bor}`, borderRadius: 10, padding: "18px 22px", textAlign: "left", cursor: show ? "default" : "pointer", color: B.white, fontSize: 17, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, background: show && i === q.correct ? B.green : show && i === sel ? B.accent : B.steel, color: B.white }}>
                    {show && i === q.correct ? "✓" : show && i === sel && i !== q.correct ? "✗" : String.fromCharCode(65 + i)}
                  </span>{o}
                </button>
              );
            })}
          </div>
          {show && <div style={{ background: sel === q.correct ? "rgba(76,175,80,0.1)" : "rgba(198,40,40,0.1)", borderRadius: 10, padding: 22, marginBottom: 22, borderLeft: `4px solid ${sel === q.correct ? B.green : B.accent}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: sel === q.correct ? B.green : B.accent }}>{sel === q.correct ? "CORRECT!" : "INCORRECT"}</div>
            <p style={{ color: B.silver, margin: 0, fontSize: 17, lineHeight: 1.6 }}>{q.exp}</p>
          </div>}
          {show && <Btn primary onClick={nextQ}>{qIdx === p.questions.length - 1 ? (p.finalPrompt ? "See the Takeaway →" : phase < VIDEO_PHASES.length - 1 ? "Next Video →" : "Complete Videos ✓") : "Next Question →"}</Btn>}
        </>
      )}
    </div>
  );
}

// ── LESSONS ──
function Lessons({ onDone, onBack }) {
  const [step, setStep] = useState(0); const [open, setOpen] = useState("script"); const s = STEPS[step];
  const Section = ({ id, icon, label, children }) => (
    <div style={{ background: B.char, borderRadius: 12, padding: "22px 24px", marginBottom: 14, border: `1px solid ${B.steel}`, cursor: "pointer" }} onClick={() => setOpen(open === id ? null : id)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 15, letterSpacing: 2, color: B.gold, fontFamily: "'Oswald'" }}>{icon} {label}</div><span style={{ color: B.silver, fontSize: 22 }}>{open === id ? "−" : "+"}</span></div>
      {open === id && <div style={{ marginTop: 18 }}>{children}</div>}
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 16, marginBottom: 22, fontFamily: "'Oswald'", letterSpacing: 1 }}>← BACK TO HOME</button>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
        {STEPS.map((x, i) => <button key={i} onClick={() => { setStep(i); setOpen("script"); }} style={{ width: 54, height: 54, borderRadius: "50%", border: `2px solid ${i < step ? B.gold : i === step ? B.accent : B.steel}`, background: i < step ? B.gold : i === step ? B.accent : "transparent", color: i <= step ? B.black : B.silver, fontSize: 23, fontWeight: 800, cursor: "pointer", fontFamily: "'Oswald'", display: "flex", alignItems: "center", justifyContent: "center" }}>{i < step ? "✓" : x.letter}</button>)}
      </div>
      <Bar total={STEPS.length} current={step} />
      <div style={{ background: `linear-gradient(135deg, ${B.darkRed}, ${B.red})`, borderRadius: 16, padding: "34px 28px", marginBottom: 22 }}>
        <div style={{ fontSize: 76, fontWeight: 900, color: "rgba(255,255,255,0.08)", fontFamily: "'Oswald'", lineHeight: 1, marginBottom: -24 }}>{s.letter}</div>
        <div style={{ fontSize: 14, letterSpacing: 4, color: B.gold, fontFamily: "'Oswald'" }}>STEP {step + 1} OF {STEPS.length}</div>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: B.white, margin: "6px 0 10px", fontFamily: "'Oswald'" }}>{s.title}</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", margin: 0, fontStyle: "italic" }}>{s.tagline}</p>
      </div>
      <Section id="script" icon="📋" label="YOUR SCRIPT"><div style={{ background: B.steel, borderRadius: 10, padding: 20, borderLeft: `4px solid ${B.gold}` }}><p style={{ color: B.white, fontSize: 20, fontWeight: 600, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>"{s.script}"</p></div>
        {s.hasAlt && <div style={{ background: B.steel, borderRadius: 10, padding: 20, marginTop: 10, borderLeft: `4px solid ${B.silver}` }}><div style={{ fontSize: 13, color: B.silver, marginBottom: 6, letterSpacing: 1 }}>ALT (NOT-CONSOLIDATED):</div><p style={{ color: B.white, fontSize: 18, fontWeight: 600, margin: 0, fontStyle: "italic" }}>"{s.scriptAlt}"</p></div>}
      </Section>
      <Section id="why" icon="💡" label="WHY IT MATTERS"><p style={{ color: B.silver, fontSize: 18, lineHeight: 1.7, margin: 0 }}>{s.why}</p></Section>
      <Section id="tips" icon="🎯" label="PRO TIPS">{s.tips.map((t, i) => <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}><span style={{ color: B.gold, fontWeight: 700, fontSize: 17, minWidth: 24 }}>{i + 1}.</span><span style={{ color: B.silver, fontSize: 17, lineHeight: 1.6 }}>{t}</span></div>)}</Section>
      <Section id="ex" icon="✅" label="DO vs ❌ DON'T">
        <div style={{ background: "rgba(76,175,80,0.1)", borderRadius: 10, padding: 18, borderLeft: `4px solid ${B.green}`, marginBottom: 10 }}><div style={{ fontSize: 13, color: B.green, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>DO THIS</div><p style={{ color: B.white, margin: 0, fontSize: 17, lineHeight: 1.5 }}>{s.doEx}</p></div>
        <div style={{ background: "rgba(198,40,40,0.1)", borderRadius: 10, padding: 18, borderLeft: `4px solid ${B.accent}` }}><div style={{ fontSize: 13, color: B.accent, fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>NOT THIS</div><p style={{ color: B.silver, margin: 0, fontSize: 17, lineHeight: 1.5 }}>{s.dontEx}</p></div>
      </Section>
      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        <Btn disabled={step === 0} onClick={() => { setStep(step - 1); setOpen("script"); }} style={{ flex: 1 }}>← Prev</Btn>
        <Btn primary={step < STEPS.length - 1} gold={step === STEPS.length - 1} onClick={() => { if (step < STEPS.length - 1) { setStep(step + 1); setOpen("script"); } else onDone(); }} style={{ flex: 1 }}>{step === STEPS.length - 1 ? "Complete Lessons ✓" : "Next →"}</Btn>
      </div>
    </div>
  );
}

// ── QUIZ ──
function QuizPage({ onDone, onBack }) {
  const [idx, setIdx] = useState(0); const [sel, setSel] = useState(null); const [show, setShow] = useState(false); const [score, setScore] = useState(0); const [done, setDone] = useState(false);
  const q = QUIZ[idx]; const pick = (i) => { if (show) return; setSel(i); setShow(true); if (i === q.correct) setScore(s => s + 1); };
  const next = () => { if (idx < QUIZ.length - 1) { setIdx(idx + 1); setSel(null); setShow(false); } else setDone(true); };
  const retry = () => { setIdx(0); setSel(null); setShow(false); setScore(0); setDone(false); };
  const passed = score >= Math.ceil(QUIZ.length * 0.75);
  if (done) return (
    <div style={{ minHeight: "100vh", padding: "48px 20px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
      <ScoreCircle score={score} total={QUIZ.length} />
      <h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Oswald'", color: passed ? B.gold : B.accent, margin: "24px 0 12px" }}>{passed ? "YOU PASSED!" : "NOT QUITE"}</h2>
      <p style={{ color: B.silver, fontSize: 19, marginBottom: 6 }}>{score} of {QUIZ.length} correct</p>
      <p style={{ color: B.silver, fontSize: 16, marginBottom: 36 }}>{passed ? "Solid W.I.N.N.E.R. knowledge." : `Need ${Math.ceil(QUIZ.length * 0.75)} to pass.`}</p>
      <div style={{ maxWidth: 320, margin: "0 auto" }}>{passed ? <Btn gold onClick={() => onDone(score)}>Continue →</Btn> : <><Btn primary onClick={retry}>Retry Quiz</Btn><div style={{ height: 12 }} /><Btn onClick={onBack}>Review Lessons</Btn></>}</div>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", maxWidth: 640, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 16, marginBottom: 22, fontFamily: "'Oswald'", letterSpacing: 1 }}>← BACK TO HOME</button>
      <Bar total={QUIZ.length} current={idx} />
      <div style={{ fontSize: 14, letterSpacing: 3, color: B.gold, marginBottom: 10, fontFamily: "'Oswald'" }}>QUESTION {idx + 1} OF {QUIZ.length}</div>
      <h3 style={{ fontSize: 24, fontWeight: 700, color: B.white, margin: "0 0 26px", lineHeight: 1.4 }}>{q.q}</h3>
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {q.opts.map((o, i) => { let bg = B.char, bor = B.steel; if (show && i === q.correct) { bg = "rgba(76,175,80,0.15)"; bor = B.green; } else if (show && i === sel) { bg = "rgba(198,40,40,0.15)"; bor = B.accent; }
          return <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${bor}`, borderRadius: 10, padding: "18px 22px", textAlign: "left", cursor: show ? "default" : "pointer", color: B.white, fontSize: 17, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, background: show && i === q.correct ? B.green : show && i === sel ? B.accent : B.steel, color: B.white }}>{show && i === q.correct ? "✓" : show && i === sel && i !== q.correct ? "✗" : String.fromCharCode(65 + i)}</span>{o}</button>;
        })}
      </div>
      {show && <div style={{ background: sel === q.correct ? "rgba(76,175,80,0.1)" : "rgba(198,40,40,0.1)", borderRadius: 10, padding: 22, marginBottom: 22, borderLeft: `4px solid ${sel === q.correct ? B.green : B.accent}` }}><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: sel === q.correct ? B.green : B.accent }}>{sel === q.correct ? "CORRECT!" : "INCORRECT"}</div><p style={{ color: B.silver, margin: 0, fontSize: 17, lineHeight: 1.6 }}>{q.exp}</p></div>}
      {show && <Btn primary onClick={next}>{idx === QUIZ.length - 1 ? "See Results" : "Next Question →"}</Btn>}
    </div>
  );
}

// ── SCENARIOS ──
function ScenarioPage({ onDone, onBack }) {
  const [si, setSi] = useState(0); const [sti, setSti] = useState(0); const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false); const [scores, setScores] = useState([]); const [cur, setCur] = useState(0); const [fin, setFin] = useState(false);
  const sc = SCENARIOS[si]; const st = sc?.steps[sti];
  const pick = (i) => { if (show) return; setSel(i); setShow(true); if (st.opts[i].correct) setCur(c => c + 1); };
  const next = () => { if (sti < sc.steps.length - 1) { setSti(sti + 1); setSel(null); setShow(false); } else { const ns = [...scores, { t: sc.steps.length, c: cur }]; setScores(ns); if (si < SCENARIOS.length - 1) { setSi(si + 1); setSti(0); setSel(null); setShow(false); setCur(0); } else setFin(true); } };
  if (fin) { const tc = scores.reduce((a, s) => a + s.c, 0); const tt = scores.reduce((a, s) => a + s.t, 0); const pass = tc >= Math.ceil(tt * 0.7);
    return (<div style={{ minHeight: "100vh", padding: "48px 20px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}><ScoreCircle score={tc} total={tt} /><h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Oswald'", color: pass ? B.gold : B.accent, margin: "24px 0 12px" }}>{pass ? "SCENARIOS COMPLETE!" : "NEEDS PRACTICE"}</h2><p style={{ color: B.silver, fontSize: 19, marginBottom: 36 }}>{tc} of {tt} correct</p><div style={{ maxWidth: 320, margin: "0 auto" }}>{pass ? <Btn gold onClick={() => onDone(tc, tt)}>Finish Training →</Btn> : <Btn primary onClick={() => { setSi(0); setSti(0); setSel(null); setShow(false); setScores([]); setCur(0); setFin(false); }}>Retry</Btn>}</div></div>);
  }
  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", maxWidth: 640, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 16, marginBottom: 22, fontFamily: "'Oswald'", letterSpacing: 1 }}>← BACK TO HOME</button>
      <div style={{ fontSize: 14, letterSpacing: 3, color: B.gold, marginBottom: 8, fontFamily: "'Oswald'" }}>SCENARIO {si + 1} OF {SCENARIOS.length}</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: B.white, margin: "0 0 14px", fontFamily: "'Oswald'" }}>{sc.title}</h2>
      <div style={{ background: B.char, borderRadius: 12, padding: 22, marginBottom: 22, borderLeft: `4px solid ${B.gold}` }}><p style={{ color: B.silver, margin: 0, fontSize: 18, lineHeight: 1.7, fontStyle: "italic" }}>{sc.setup}</p></div>
      <Bar total={sc.steps.length} current={sti} />
      <div style={{ fontSize: 14, color: B.gold, marginBottom: 8, letterSpacing: 1, fontFamily: "'Oswald'" }}>{st.tag}</div>
      <h3 style={{ fontSize: 22, color: B.white, fontWeight: 600, margin: "0 0 22px", lineHeight: 1.5 }}>{st.prompt}</h3>
      <div style={{ display: "grid", gap: 12, marginBottom: 22 }}>
        {st.opts.map((o, i) => { let bg = B.char, bor = B.steel; if (show && i === sel && o.correct) { bg = "rgba(76,175,80,0.15)"; bor = B.green; } else if (show && i === sel && !o.correct) { bg = "rgba(198,40,40,0.15)"; bor = B.accent; } else if (show && o.correct) { bg = "rgba(76,175,80,0.08)"; bor = "rgba(76,175,80,0.4)"; }
          return <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${bor}`, borderRadius: 10, padding: "18px 20px", textAlign: "left", cursor: show ? "default" : "pointer", color: B.white, fontSize: 17, lineHeight: 1.5 }}>{o.text}</button>;
        })}
      </div>
      {show && sel !== null && <div style={{ background: st.opts[sel].correct ? "rgba(76,175,80,0.1)" : "rgba(198,40,40,0.1)", borderRadius: 10, padding: 22, marginBottom: 22, borderLeft: `4px solid ${st.opts[sel].correct ? B.green : B.accent}` }}><p style={{ color: B.silver, margin: 0, fontSize: 17, lineHeight: 1.6 }}>{st.opts[sel].fb}</p></div>}
      {show && <Btn primary onClick={next}>{sti === sc.steps.length - 1 ? (si === SCENARIOS.length - 1 ? "See Results" : "Next Scenario →") : "Continue →"}</Btn>}
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ onBack }) {
  const [records, setRecords] = useState([]); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => { loadAllResults().then(r => { setRecords(r); setLoading(false); }); }, []);
  const filtered = search.trim() ? records.filter(r => r.name.toLowerCase().includes(search.toLowerCase())) : records;
  const passCount = filtered.filter(r => r.passed).length;
  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px", maxWidth: 900, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.silver, cursor: "pointer", fontSize: 16, marginBottom: 22, fontFamily: "'Oswald'", letterSpacing: 1 }}>← BACK</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div><h1 style={{ fontSize: 36, fontWeight: 800, color: B.white, fontFamily: "'Oswald'", margin: "0 0 4px" }}>Manager Dashboard</h1><p style={{ color: B.silver, fontSize: 16, margin: 0 }}>W.I.N.N.E.R. Training Tracker</p></div>
        <button onClick={() => { setLoading(true); loadAllResults().then(r => { setRecords(r); setLoading(false); }); }} style={{ background: B.char, border: `1px solid ${B.steel}`, borderRadius: 8, padding: "10px 20px", color: B.silver, cursor: "pointer", fontSize: 14, fontFamily: "'Oswald'", letterSpacing: 1 }}>↻ REFRESH</button>
      </div>
      {/* Search bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: B.silver, fontSize: 18, pointerEvents: "none" }}>🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by employee name..."
            style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: 10, border: `1px solid ${B.steel}`, background: B.char, color: B.white, fontSize: 16, outline: "none", fontFamily: "inherit" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: B.silver, fontSize: 18, cursor: "pointer" }}>✕</button>}
        </div>
        {search.trim() && <p style={{ color: B.silver, fontSize: 14, margin: "8px 0 0" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 32 }}>
        {[{ label: "Total", value: filtered.length, color: B.gold },{ label: "Passed", value: passCount, color: B.green },{ label: "Failed", value: filtered.length - passCount, color: B.accent },{ label: "Pass Rate", value: filtered.length > 0 ? Math.round((passCount / filtered.length) * 100) + "%" : "—", color: B.gold }].map((c, i) => (
          <div key={i} style={{ background: B.char, borderRadius: 12, padding: "20px 16px", border: `1px solid ${B.steel}`, textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 800, color: c.color, fontFamily: "'Oswald'" }}>{c.value}</div><div style={{ fontSize: 13, color: B.silver, letterSpacing: 1, fontFamily: "'Oswald'", marginTop: 4 }}>{c.label}</div></div>
        ))}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: B.silver }}>Loading...</div> :
       filtered.length === 0 ? <div style={{ textAlign: "center", padding: 60 }}><div style={{ fontSize: 48, marginBottom: 12 }}>{search ? "🔍" : "📋"}</div><p style={{ color: B.silver, fontSize: 18 }}>{search ? `No results for "${search}"` : "No completions yet."}</p></div> :
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead><tr>{["Employee", "Date", "Quiz", "Scenarios", "Overall", "Status", "Time"].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "14px 12px", borderBottom: `2px solid ${B.steel}`, color: B.gold, fontSize: 13, letterSpacing: 2, fontFamily: "'Oswald'", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((r, i) => { const ov = r.quizScore + r.scenarioScore; const ovT = r.quizTotal + r.scenarioTotal; const pct = ovT > 0 ? Math.round((ov / ovT) * 100) : 0;
            return (<tr key={i} style={{ borderBottom: `1px solid ${B.steel}` }}>
              <td style={{ padding: "14px 12px", color: B.white, fontWeight: 600 }}>{r.name}</td>
              <td style={{ padding: "14px 12px", color: B.silver, whiteSpace: "nowrap" }}>{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              <td style={{ padding: "14px 12px", color: B.white }}>{r.quizScore}/{r.quizTotal}</td>
              <td style={{ padding: "14px 12px", color: B.white }}>{r.scenarioScore}/{r.scenarioTotal}</td>
              <td style={{ padding: "14px 12px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 60, height: 8, borderRadius: 4, background: B.steel, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: pct >= 75 ? B.green : pct >= 50 ? B.gold : B.accent }} /></div><span style={{ color: B.silver, fontSize: 14 }}>{pct}%</span></div></td>
              <td style={{ padding: "14px 12px" }}><span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Oswald'", letterSpacing: 1, background: r.passed ? "rgba(76,175,80,0.15)" : "rgba(198,40,40,0.15)", color: r.passed ? B.green : B.accent }}>{r.passed ? "PASS" : "FAIL"}</span></td>
              <td style={{ padding: "14px 12px", color: B.silver, whiteSpace: "nowrap" }}>{r.minutes ? `~${r.minutes} min` : "—"}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>}
    </div>
  );
}

// ── APP ──
export default function App() {
  const [view, setView] = useState("training");
  const [page, setPage] = useState("login");
  const [employee, setEmployee] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [progress, setProgress] = useState({ videos: false, lessons: false, quiz: false, scenarios: false });
  const [quizScore, setQuizScore] = useState(0);

  const handleLogin = (name) => { setEmployee(name); setStartTime(Date.now()); setProgress({ videos: false, lessons: false, quiz: false, scenarios: false }); setQuizScore(0); setPage("home"); };
  const handleLogout = () => { setEmployee(""); setPage("login"); setStartTime(null); };
  const handleTrainingComplete = useCallback(async (scScore, scTotal) => {
    const minutes = startTime ? Math.round((Date.now() - startTime) / 60000) : null;
    const passed = quizScore >= Math.ceil(QUIZ.length * 0.75) && scScore >= Math.ceil(scTotal * 0.7);
    await saveResult({ name: employee, date: new Date().toISOString(), quizScore, quizTotal: QUIZ.length, scenarioScore: scScore, scenarioTotal: scTotal, passed, minutes });
    setProgress(p => ({ ...p, scenarios: true })); setPage("home");
  }, [employee, quizScore, startTime]);

  return (
    <div style={{ background: B.black, minHeight: "100vh", color: B.white, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700;800;900&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; } button { font-family: inherit; } table { font-family: inherit; }`}</style>
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 20px", borderBottom: `1px solid ${B.steel}` }}>
        <div style={{ display: "flex", background: B.char, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.steel}` }}>
          {[{ key: "training", label: "🎓 Training" }, { key: "dashboard", label: "📊 Dashboard" }].map(t => (
            <button key={t.key} onClick={() => setView(t.key)} style={{ padding: "10px 24px", border: "none", cursor: "pointer", background: view === t.key ? B.accent : "transparent", color: view === t.key ? B.white : B.silver, fontSize: 15, fontWeight: 600, fontFamily: "'Oswald'", letterSpacing: 1, transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>
      </div>
      {view === "dashboard" ? <Dashboard onBack={() => setView("training")} /> : <>
        {page === "login" && <LoginScreen onLogin={handleLogin} />}
        {page === "home" && <Home progress={progress} employeeName={employee} onNav={setPage} onLogout={handleLogout} />}
        {page === "videos" && <VideosPage onDone={() => { setProgress(p => ({ ...p, videos: true })); setPage("lessons"); }} onBack={() => setPage("home")} />}
        {page === "lessons" && <Lessons onDone={() => { setProgress(p => ({ ...p, lessons: true })); setPage("quiz"); }} onBack={() => setPage("home")} />}
        {page === "quiz" && <QuizPage onDone={(score) => { setQuizScore(score); setProgress(p => ({ ...p, quiz: true })); setPage("scenarios"); }} onBack={() => setPage("home")} />}
        {page === "scenarios" && <ScenarioPage onDone={handleTrainingComplete} onBack={() => setPage("home")} />}
      </>}
    </div>
  );
}
