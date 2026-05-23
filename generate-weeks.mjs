#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "client/public/workouts");

// ─── Drill Bank ────────────────────────────────────────────────────────────
// difficulty: "Easy" | "Medium" | "Hard" | "VeryHard"
// repType: "makes" | "setsPerHand" | "makesPerHand"
// baseMakes / baseSets / baseReps = baseline for 1h session, medium intensity, block 1

const BALL_HANDLING = [
  // Stationary
  { name: "Weight Shift Pound", difficulty: "Easy", repType: "setsPerHand", baseSets: 2, baseReps: 10 },
  { name: "Stationary Crossovers (Wide Base)", difficulty: "Easy", repType: "setsPerHand", baseSets: 2, baseReps: 12 },
  { name: "Pound to Jolt Cross", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Continuous Jolt Cross (No Pound)", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Pound Between-Behind", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Anchored Pivot Pounds", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  // Movement
  { name: "Split Feet Pound-Between", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Moving Pound Crossovers", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 12 },
  { name: "Dribble-Step Between the Legs", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Blended Crossover/Between Series", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Accel/Decel Flow", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Exaggerated Low to High", difficulty: "Easy", repType: "setsPerHand", baseSets: 2, baseReps: 10 },
  { name: "Single Hand Freestyle", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Double Behind to Inverted Snatch", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Change of Speed Push-Out", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  // Advanced Coordination
  { name: "Hop Freestyle", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Rotational Pulls", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Hezi-Even Stance", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Cross Step Inverted Between", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Feet-Behind Footwork", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Feet-Behind Spin", difficulty: "VeryHard", repType: "setsPerHand", baseSets: 3, baseReps: 6 },
  { name: "In Stride Change of Direction", difficulty: "VeryHard", repType: "setsPerHand", baseSets: 3, baseReps: 6 },
  { name: "Off-Balance Visualization", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Kyrie Two-Foot C.O.D. Series", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  // Reactive / Defensive
  { name: "Small Space Reactive Dribbling", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Slow Dribble to Explosive Reach", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Shoulder-to-Shoulder Recovery", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Leaning Pull the Chair Recovery", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Left-Hand Rip Away", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Spin Downhill (Creative Options)", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Overhead Gathered Pound", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  // Advanced Footwork
  { name: "Lunge Stop Series", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Hezi-Jumpback Explode", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Cross-Step Pop (COD Tween)", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Slow Step Extension", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Wichita Double Rip", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  // Contact & Recovery
  { name: "Arm-Free Pickup (Disentanglement)", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Bump and Counter (5 Variations)", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Slam and Protect (Rib Tuck)", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Wimby Pole Read", difficulty: "VeryHard", repType: "setsPerHand", baseSets: 3, baseReps: 6 },
  // Rhythm & Coordination
  { name: "Hezi In-and-Out Explode", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Find the Seams Dribble-to-Shot", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Double Pump Rhythm Drill", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  { name: "Over-the-Net Reach", difficulty: "Hard", repType: "setsPerHand", baseSets: 3, baseReps: 8 },
  // Tactical
  { name: "Low Joint Position Mobility Warm-up", difficulty: "Medium", repType: "setsPerHand", baseSets: 2, baseReps: 10 },
  { name: "Wichita Step-First Attack", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Wichita Outside Hip Sweep", difficulty: "Medium", repType: "setsPerHand", baseSets: 3, baseReps: 10 },
  { name: "Lava Pop-Back (COD Tween)", difficulty: "VeryHard", repType: "setsPerHand", baseSets: 3, baseReps: 6 },
];

const SHOOTING = [
  // Warm-up / Fluidity
  { name: "Cold Start Threes", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  { name: "Single Leg RDL Reach to Shot", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Reverse Lunge Overhead to Shot", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Side-to-Side Pops to Shot", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Find the Seams Warm-up", difficulty: "Easy", repType: "makes", baseMakes: 12 },
  { name: "Psychological Momentum (Quick Form)", difficulty: "Easy", repType: "makes", baseMakes: 10 },
  // Stationary / Footwork
  { name: "Anchored Pivot Pickup Shoot", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  { name: "Ball Pickup Shots", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  { name: "Double Pump Shots", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  { name: "Corner to Wing Shooting", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  { name: "Corner to Corner Shooting", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  // Movement / High-Speed
  { name: "Wichita Wing Series (Step-Over Rip)", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "High-Speed Skip Pull-ups", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  { name: "Knee-Push Transition Shot", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "Mid-Court Toss-and-Meet", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "Screen Rejection Jumpers", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  // Reactive / Resistance
  { name: "The Curry Drill", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "2v1 / 1v2 Shooting", difficulty: "VeryHard", repType: "makes", baseMakes: 10 },
  { name: "Tense to Relaxed Shooting", difficulty: "VeryHard", repType: "makes", baseMakes: 10 },
  { name: "Peripheral Vision/Quiet Eye Turn", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  { name: "Turn and Decide (Close-out)", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  { name: "Arm-Free Pickup Shoot", difficulty: "VeryHard", repType: "makes", baseMakes: 10 },
  { name: "Bump and Score (Step-back)", difficulty: "Hard", repType: "makes", baseMakes: 15 },
  // Specialized
  { name: "Corner Out of Bounds", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Two-Foot Floater Series", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "Visualization Short Jumpers", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  // Advanced Movement
  { name: "Separate Back Separation Shot", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Wichita Help-Side Counter Pull-up", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Catch and Shoot (On the Move)", difficulty: "Medium", repType: "makes", baseMakes: 20 },
  { name: "Mid-Range Volume Pull-ups (25 Each Way)", difficulty: "Medium", repType: "makes", baseMakes: 25 },
  // Coordination Rhythm
  { name: "Hezi BTB/Push Cross Pull-up", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Lunge Stop Anchor Stop Pull-up", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "Low-to-Ground Differential Pickup", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  // Finish-to-Shot
  { name: "Offhand Floater Development Circuit", difficulty: "Hard", repType: "makes", baseMakes: 20 },
  { name: "One Move Capstone Shooting", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  // Tactical
  { name: "Ball Screen Hedge & Relocation", difficulty: "Hard", repType: "makes", baseMakes: 12 },
  { name: "Different Footwork Every Rep", difficulty: "Hard", repType: "makes", baseMakes: 15 },
];

const FINISHING = [
  // Foundational / Warm-up
  { name: "Off-Board Touch Finishing", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Modified Inside-Hand Mikan", difficulty: "Easy", repType: "makes", baseMakes: 15 },
  { name: "Wide Hook Soft Touch", difficulty: "Easy", repType: "makes", baseMakes: 12 },
  { name: "Side-to-Side Cradles", difficulty: "Medium", repType: "makesPerHand", baseMakes: 10 },
  { name: "Off-Hand Key Extension", difficulty: "Medium", repType: "makesPerHand", baseMakes: 10 },
  { name: "Behind-the-Back Air Dexterity", difficulty: "Medium", repType: "makes", baseMakes: 10 },
  { name: "Standard Layup Series (Overhand, Underhand, Side-Hand)", difficulty: "Easy", repType: "makes", baseMakes: 12 },
  // Contact / Physical
  { name: "Slam and Tuck Protection", difficulty: "Medium", repType: "makes", baseMakes: 12 },
  { name: "Contact Pump Fake", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Pull the Chair Recovery", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Rip-Away Finish", difficulty: "Medium", repType: "makesPerHand", baseMakes: 10 },
  { name: "Two-Step Disentanglement", difficulty: "Medium", repType: "makes", baseMakes: 12 },
  { name: "Bump and Score (5 Variations)", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  // Advanced Craft / Kyrie
  { name: "Same Foot Same Hand (Off-Foot)", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  { name: "Trey Young High Floater", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Touch the Net Reach", difficulty: "VeryHard", repType: "makes", baseMakes: 8 },
  { name: "Two-Foot Change of Direction (Kyrie Series)", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Escape Floater", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  { name: "Slow-Step / Extension Read", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Overhead Gather Bait", difficulty: "Medium", repType: "makes", baseMakes: 12 },
  { name: "Gyro Counter Finish", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  // Creative / Situational
  { name: "Layups from Anywhere", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  { name: "Object Jump Finish", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Off-Hand Floater Circuit", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  { name: "Wichita Counter to Finish", difficulty: "Medium", repType: "makes", baseMakes: 12 },
  // Refined Footwork
  { name: "Inside Hand Driving Finish", difficulty: "Medium", repType: "makesPerHand", baseMakes: 10 },
  { name: "The Four-Way Reverse Sequence", difficulty: "Hard", repType: "makes", baseMakes: 8 },
  { name: "Differential Angle Floaters", difficulty: "Medium", repType: "makes", baseMakes: 12 },
  { name: "Underhand Floater (Same-Foot/Same-Hand)", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  // Tactical / Reactive
  { name: "Two-Foot Finish off Sell-Out Reach", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Chest-Stop Screen Rejection Finish", difficulty: "VeryHard", repType: "makes", baseMakes: 8 },
  { name: "Wichita Double Rip to Finish", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Inside-Hand Reverse Finish", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  { name: "One-Move Capstone Finish", difficulty: "Medium", repType: "makes", baseMakes: 15 },
  // Kyrie Variations
  { name: "Kyrie Cuffing Series", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Kyrie 18-Shot Finishing Series", difficulty: "VeryHard", repType: "makes", baseMakes: 18 },
  { name: "Cradle-Change Direction Finish", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "Inside-Hand Wrap Reverse", difficulty: "Hard", repType: "makesPerHand", baseMakes: 10 },
  // Specialized
  { name: "Wichita Double Rip Middle Finish", difficulty: "Hard", repType: "makes", baseMakes: 10 },
  { name: "One Move Capstone Finishing", difficulty: "Medium", repType: "makes", baseMakes: 15 },
];

// Attach subCategory
const DRILL_BANK = [
  ...BALL_HANDLING.map(d => ({ ...d, subCategory: "ballHandling" })),
  ...SHOOTING.map(d => ({ ...d, subCategory: "shooting" })),
  ...FINISHING.map(d => ({ ...d, subCategory: "finishing" })),
];

// ─── Descriptions ───────────────────────────────────────────────────────────
// Keyed by drill name → { low, medium, high }
const DESCRIPTIONS = {
  // Ball Handling
  "Weight Shift Pound": {
    low: "Form: Hard pound dribble at knee-to-hip level, shift body weight side-to-side keeping ball on same spot",
    medium: "Game-Speed: Explosive pound dribble with full weight shift, maintain rhythm at game tempo",
    high: "Pressured: Maximum speed weight shifts with defender shadowing, protect ball and maintain control",
  },
  "Stationary Crossovers (Wide Base)": {
    low: "Form: Low wide stance, slow crossovers wider than knees, weight shifts with every cross",
    medium: "Game-Speed: Crossovers at game speed in wide base stance, explosive weight transfer each rep",
    high: "Pressured: Explosive crossovers with defender mirroring, maximize width and speed",
  },
  "Pound to Jolt Cross": {
    low: "Form: Controlled pound followed by low jolt cross using fingertips, focus on clean transitions",
    medium: "Game-Speed: Standard pound then immediate low jolt cross at game pace",
    high: "Pressured: Max-speed pound to jolt cross with defender live, protect ball on every rep",
  },
  "Continuous Jolt Cross (No Pound)": {
    low: "Technique: Back-to-back low jolt crosses at slow tempo, float ball between crosses",
    medium: "Game-Speed: Continuous jolt crosses at game speed, strong fingertip control throughout",
    high: "Pressured: Explosive continuous jolt crosses at max speed, defender shadowing tight",
  },
  "Pound Between-Behind": {
    low: "Form: Stationary pound, between legs by big toe, then behind back at slow rhythm",
    medium: "Game-Speed: Full rhythm pound-between-behind series at game pace, sway with ball",
    high: "Pressured: Max-speed pound-between-behind with defender applying pressure",
  },
  "Anchored Pivot Pounds": {
    low: "Technique: Anchor one foot, slow freestyle pound dribbles exploring unpredictable patterns",
    medium: "Game-Speed: Anchored foot, varied pound moves at game speed before pickup",
    high: "Pressured: Full-speed anchored pivot pounds with defender challenging pickup timing",
  },
  "Split Feet Pound-Between": {
    low: "Form: Moving pound with split feet (one forward/back) as ball goes between legs",
    medium: "Game-Speed: Moving split-feet pound-between at game pace, feet snap back under hips",
    high: "Pressured: Full-speed split-feet moves with defender live, explosive transitions",
  },
  "Moving Pound Crossovers": {
    low: "Form: Sideline-to-sideline crossovers, hips turn toward ball on each cross at slow pace",
    medium: "Game-Speed: Full-speed sideline crossovers, hips turning explosively each rep",
    high: "Pressured: Max-speed moving crossovers with defender tracking, maximize hip rotation",
  },
  "Dribble-Step Between the Legs": {
    low: "Technique: Inside foot steps with ball, slow between-legs change of direction, feel the timing",
    medium: "Game-Speed: Dribble-step between legs at game speed, explosive direction change",
    high: "Pressured: Max-speed dribble-step change of direction with active defender",
  },
  "Blended Crossover/Between Series": {
    low: "Form: Moving crossover alternating with between-legs, slanted back posture, slow pace",
    medium: "Game-Speed: Blended series at game pace, stay slanted and reactive",
    high: "Pressured: Full-speed blended crossover/between with defender shadowing",
  },
  "Accel/Decel Flow": {
    low: "Technique: One-two footwork pattern at slow speed, ball moves around feet in sync",
    medium: "Game-Speed: Accel/decel footwork at game rhythm, explosive ankle and Achilles prep",
    high: "Pressured: Max-speed accel/decel pops with live defender, minimize hesitation",
  },
  "Exaggerated Low to High": {
    low: "Form: Alternating two very low then two very high dribbles at slow tempo",
    medium: "Game-Speed: Low-to-high alternation at game pace, explosive height transitions",
    high: "Pressured: Max-speed exaggerated low-to-high with defender close, maintain control",
  },
  "Single Hand Freestyle": {
    low: "Technique: Court-wide single hand dribbling at 50% speed, focus on fluidity",
    medium: "Game-Speed: Single-hand freestyle at game speed across court",
    high: "Pressured: Single-hand freestyle at 100% speed, defender applying full pressure",
  },
  "Double Behind to Inverted Snatch": {
    low: "Form: Two behind-the-back dribbles then inverted snatch at controlled tempo",
    medium: "Game-Speed: Double-behind to inverted snatch at game pace, smooth coordination",
    high: "Pressured: Full-speed double-behind to inverted snatch into shot with live pressure",
  },
  "Change of Speed Push-Out": {
    low: "Technique: Raise body to slow down, slow-motion push-out dribble then snatch back",
    medium: "Game-Speed: Change of speed push-out at game tempo, defender freeze timing",
    high: "Pressured: Explosive change of speed with defender live, maximize freeze effect",
  },
  "Hop Freestyle": {
    low: "Form: Single-leg hops with freestyle dribble, small controlled hops at slow speed",
    medium: "Game-Speed: Hop freestyle with progressively larger hops at game pace",
    high: "Pressured: Max-size explosive hops with freestyle dribble, defender shadowing",
  },
  "Rotational Pulls": {
    low: "Technique: Pocket ball, slow backward rotation then lean forward projection",
    medium: "Game-Speed: Rotational pulls at game speed, explosive forward lean off rotation",
    high: "Pressured: Full-speed rotational pulls with live defender, commit to forward lean",
  },
  "Hezi-Even Stance": {
    low: "Technique: Slow even stance entry, let ball float, controlled body rise to hesitate",
    medium: "Game-Speed: Even stance hesitation at game pace, convincing freeze before explode",
    high: "Pressured: Full-speed hezi into even stance with live defender, explosive out",
  },
  "Cross Step Inverted Between": {
    low: "Form: Cross foot over, slow between-legs, keep back foot glued to ground",
    medium: "Game-Speed: Cross-step inverted between at game pace, project body forward",
    high: "Pressured: Full-speed cross-step with defender, maximize forward projection",
  },
  "Feet-Behind Footwork": {
    low: "Technique: Slow feet-behind movement like track start, feel forward momentum creation",
    medium: "Game-Speed: Feet-behind at game speed, instant forward momentum off each rep",
    high: "Pressured: Explosive feet-behind with active defender, max acceleration out",
  },
  "Feet-Behind Spin": {
    low: "Technique: Feet-behind entry then controlled spin, maintain downhill momentum",
    medium: "Game-Speed: Feet-behind spin at game pace, stay downhill through rotation",
    high: "Pressured: Full-speed feet-behind spin with live defender, no momentum loss",
  },
  "In Stride Change of Direction": {
    low: "Technique: 40% sprint, subtle direction change without losing stride efficiency",
    medium: "Game-Speed: 60-70% sprint, game-like direction shift, no speed loss",
    high: "Pressured: 80% sprint change of direction at maximum efficiency with defender",
  },
  "Off-Balance Visualization": {
    low: "Technique: Slow awkward positions, visualize bumps and recover dribble at low speed",
    medium: "Game-Speed: Off-balance positions at game intensity, recover dribble quickly",
    high: "Pressured: Defender physically bumps player, recover dribble and attack at full speed",
  },
  "Kyrie Two-Foot C.O.D. Series": {
    low: "Technique: Slow cross-between-behind into two-foot shift, feel direction change",
    medium: "Game-Speed: Full Kyrie two-foot C.O.D. series at game pace",
    high: "Pressured: Max-speed cross-between-behind two-foot shift with live defender",
  },
  "Small Space Reactive Dribbling": {
    low: "Technique: Tight space dribbling with passive defender, focus on efficiency",
    medium: "Game-Speed: Tight space with active defender, protect ball and find openings",
    high: "Pressured: Live aggressive defender in tight space, maximum ball protection and creativity",
  },
  "Slow Dribble to Explosive Reach": {
    low: "Technique: Very slow dribble, time defender's reach at half speed",
    medium: "Game-Speed: Slow dribble baiting defender, explosive blast off on reach",
    high: "Pressured: Live defender reaching aggressively, must explode past on every attempt",
  },
  "Shoulder-to-Shoulder Recovery": {
    low: "Technique: Controlled bump drill, use shoulder to cut off at slow pace",
    medium: "Game-Speed: Game-speed shoulder recovery from driving line disruption",
    high: "Pressured: Full-speed shoulder clash with defender, recover and counter aggressively",
  },
  "Leaning Pull the Chair Recovery": {
    low: "Technique: Lean into partner slowly, partner pulls away, controlled balance recovery",
    medium: "Game-Speed: Game-speed lean with sudden chair-pull, maintain dribble on recovery",
    high: "Pressured: Full-speed lean, aggressive chair-pull, recover balance and finish at rim",
  },
  "Left-Hand Rip Away": {
    low: "Technique: Slow gather with partner lightly holding ball, deliberate left-hand rip",
    medium: "Game-Speed: Game-speed gather, defender has hand on ball, rip away cleanly",
    high: "Pressured: Aggressive defender grabs ball, explosive rip-away and immediate finish",
  },
  "Spin Downhill (Creative Options)": {
    low: "Technique: Controlled spin off slow defender, explore creative options at low speed",
    medium: "Game-Speed: Live spin-off with creative secondary moves at game pace",
    high: "Pressured: Full-speed spin forced by aggressive defender, execute creative option immediately",
  },
  "Overhead Gathered Pound": {
    low: "Technique: Controlled pound into overhead gather, show ball slowly to practice timing",
    medium: "Game-Speed: Max-speed pound to overhead gather, sell shot fake convincingly",
    high: "Pressured: Full-speed overhead gather with shot-blocker bait, finish off balance",
  },
  "Lunge Stop Series": {
    low: "Technique: Short lunge during slow drive, explore three timing variations methodically",
    medium: "Game-Speed: Lunge stop at game speed, explosive early explosion option",
    high: "Pressured: Full-speed lunge stop with live defender, commit to explosive back-foot engine",
  },
  "Hezi-Jumpback Explode": {
    low: "Technique: Even stance hesitation, slow jumpback sell, feel the direction change",
    medium: "Game-Speed: Hezi-jumpback at game speed, convincing lean before explosion",
    high: "Pressured: Full-speed jumpback with live defender, maximum commitment on explode",
  },
  "Cross-Step Pop (COD Tween)": {
    low: "Technique: Cross-step slowly, second foot touches, deliberate pop in opposite direction",
    medium: "Game-Speed: Cross-step pop at game speed, instant reaction when foot lands",
    high: "Pressured: Full-speed cross-step pop with defender, floor is lava on second foot contact",
  },
  "Slow Step Extension": {
    low: "Technique: Slow-step without stopping, read imaginary defender, extend or jump back",
    medium: "Game-Speed: Slow step with defender on hip at game pace, read and execute decision",
    high: "Pressured: Live defender chase, slow step at full speed, instant read and attack",
  },
  "Wichita Double Rip": {
    low: "Technique: Catch on wing, controlled rip across body then back to middle",
    medium: "Game-Speed: Double rip at game speed, drive or pull-up off the second rip",
    high: "Pressured: Live defender taking away first rip, explosive second rip into attack",
  },
  "Arm-Free Pickup (Disentanglement)": {
    low: "Technique: Slow drive with partner holding arm, deliberate arm-free pickup practice",
    medium: "Game-Speed: Game-speed drive, defender on arm, fluid pickup into shot",
    high: "Pressured: Aggressive defender on arm, explosive disentanglement into finish",
  },
  "Bump and Counter (5 Variations)": {
    low: "Technique: Slow bump into defender hip, practice five counter options methodically",
    medium: "Game-Speed: Game-speed bump and counter, mix all five variations naturally",
    high: "Pressured: Full-speed bump with live defender, execute best counter in real time",
  },
  "Slam and Protect (Rib Tuck)": {
    low: "Technique: Controlled slam dribble, slow jump into defender with ball tucked in ribs",
    medium: "Game-Speed: Game-speed slam and tuck, shoulder shields ball on contact",
    high: "Pressured: Full-speed slam, aggressive lateral jump into defender, maximum protection",
  },
  "Wimby Pole Read": {
    low: "Technique: Beat primary defender slowly, recognize Wimby pole read, adapt finish",
    medium: "Game-Speed: Game-speed drive past primary, immediate read of help defender reach",
    high: "Pressured: Full-speed drive with live Wimby-style help, adapt finish under pressure",
  },
  "Hezi In-and-Out Explode": {
    low: "Technique: Slow in-and-out during hesitation, body rises to freeze imaginary defender",
    medium: "Game-Speed: In-and-out hezi at game pace, convincing freeze before explode",
    high: "Pressured: Full-speed in-and-out hezi with live defender, freeze feet and burst past",
  },
  "Find the Seams Dribble-to-Shot": {
    low: "Technique: Slow spin toss, controlled seam find, smooth dribble-to-shot transition",
    medium: "Game-Speed: Game-speed toss, fast seam find, immediate move into shot",
    high: "Pressured: Maximum-speed toss and seam find with shot clock pressure simulation",
  },
  "Double Pump Rhythm Drill": {
    low: "Technique: Slow exaggerated pump fake, find rhythm and energy into secondary move",
    medium: "Game-Speed: Double pump at game speed, recover rhythm quickly into shot or drive",
    high: "Pressured: Full-speed double pump with live defender, execute secondary option immediately",
  },
  "Over-the-Net Reach": {
    low: "Technique: Drive slowly, extend ball as high as possible toward net, pull back to shoulder",
    medium: "Game-Speed: Game-speed drive with over-net reach, controlled return to finish",
    high: "Pressured: Full-speed drive, maximum reach extension, finish through live defender",
  },
  "Low Joint Position Mobility Warm-up": {
    low: "Form: Move through deep low joint positions in all directions, slow and controlled",
    medium: "Game-Speed: Low joint mobility flow at moderate pace, prep explosive first steps",
    high: "Pressured: Dynamic low joint positions at full speed, maximum mobility activation",
  },
  "Wichita Step-First Attack": {
    low: "Technique: Slow rip with step first emphasis, maximize space off catch",
    medium: "Game-Speed: Step-first rip at game pace, immediate drive off the catch",
    high: "Pressured: Full-speed step-first with live defender, maximum distance on initial rip",
  },
  "Wichita Outside Hip Sweep": {
    low: "Technique: Slow rip keeping ball on outside hip, no crossing body",
    medium: "Game-Speed: Outside hip sweep at game speed, jerk ball to air not across body",
    high: "Pressured: Full-speed outside hip sweep with active defender reaching",
  },
  "Lava Pop-Back (COD Tween)": {
    low: "Technique: Cross-step slowly, treat second foot contact as signal to pop immediately",
    medium: "Game-Speed: Cross-step at game pace, explosive pop-back the instant second foot lands",
    high: "Pressured: Max-speed cross-step, floor is lava, instant pop-back with defender live",
  },
  // Shooting
  "Cold Start Threes": {
    low: "Form: Three-pointers from cold, focus on release point and follow-through only",
    medium: "Game-Speed: Cold start threes at game tempo, off-the-bench readiness",
    high: "Pressured: Cold start three-pointers with defender closing out, shoot on catch",
  },
  "Single Leg RDL Reach to Shot": {
    low: "Form: Single-leg RDL reach-out, controlled energy transfer into shot",
    medium: "Game-Speed: RDL reach to shot at game speed, switching spots each rep",
    high: "Pressured: Full-speed RDL to shot with defender closing, maintain balance",
  },
  "Reverse Lunge Overhead to Shot": {
    low: "Form: Controlled reverse lunge overhead, pop feet to ground and shoot with rhythm",
    medium: "Game-Speed: Reverse lunge to shot at game pace, fluid energy transfer",
    high: "Pressured: Explosive reverse lunge shot with closing defender",
  },
  "Side-to-Side Pops to Shot": {
    low: "Form: Four lateral hops on one foot at slow pace, controlled ground and shot",
    medium: "Game-Speed: Lateral pops at game speed, find ground and rise into shot",
    high: "Pressured: Max-speed lateral pops with defender closing, shoot immediately on ground",
  },
  "Find the Seams Warm-up": {
    low: "Form: Gentle spin toss, find seams deliberately before each shot",
    medium: "Game-Speed: Spin toss at game pace, fast seam find into shot",
    high: "Pressured: Maximum spin on toss, fastest possible seam find with shot clock pressure",
  },
  "Psychological Momentum (Quick Form)": {
    low: "Form: Slow form shooting, goal 8 makes in a row, build confidence and flow",
    medium: "Game-Speed: Quick form shooting, goal 10 makes in a row at game tempo",
    high: "Pressured: 15 consecutive makes target, maximum mental focus and consistency",
  },
  "Anchored Pivot Pickup Shoot": {
    low: "Form: Anchored foot, slow freestyle pounds into smooth pickup and shot",
    medium: "Game-Speed: Anchored pivot pounds at game tempo, unpredictable before pickup",
    high: "Pressured: Full-speed anchored pivots with defender on ball, clean pickup and shoot",
  },
  "Ball Pickup Shots": {
    low: "Form: Ball on ground, controlled level change pickup, find rhythm into shot",
    medium: "Game-Speed: Ball pickup at game speed, immediate rhythm into shot on pickup",
    high: "Pressured: Fast pickup with defender closing, shoot before defender arrives",
  },
  "Double Pump Shots": {
    low: "Form: Exaggerated slow pump fake, deliberate rhythm rebuild into shot",
    medium: "Game-Speed: Double pump at game speed, smooth rhythm recovery into shot",
    high: "Pressured: Full-speed double pump with live defender, execute on second rhythm",
  },
  "Corner to Wing Shooting": {
    low: "Form: Alternating corner and wing threes at slow pace, 7 for 10 target",
    medium: "Game-Speed: Corner to wing at game tempo, build mental consistency",
    high: "Pressured: Corner to wing with defender closing, make on catch target",
  },
  "Corner to Corner Shooting": {
    low: "Technique: Different footwork every rep at slow pace, master each footwork style",
    medium: "Game-Speed: Corner to corner at game tempo, different footwork each make",
    high: "Pressured: Full-speed corner to corner, different footwork, defender closing",
  },
  "Wichita Wing Series (Step-Over Rip)": {
    low: "Form: Step-over cut at slow speed, controlled catch and rip into pull-up",
    medium: "Game-Speed: Step-over cut at game speed, hard rip into one-dribble pull-up",
    high: "Pressured: Full-speed step-over with live defender, rip and attack immediately",
  },
  "High-Speed Skip Pull-ups": {
    low: "Technique: Two skips at 50% speed, controlled three-point pull-up",
    medium: "Game-Speed: Two fast skips into high-speed three-point pull-up",
    high: "Pressured: Maximum-speed skips into three-point pull-up with defender close",
  },
  "Knee-Push Transition Shot": {
    low: "Technique: From one knee, slow push into transition pull-up, focus on footwork",
    medium: "Game-Speed: Knee push to transition pull-up at game speed",
    high: "Pressured: Full-speed knee push to pull-up with defender tracking",
  },
  "Mid-Court Toss-and-Meet": {
    low: "Technique: Gentle toss across court, jog to meet, find balance and shoot",
    medium: "Game-Speed: Toss and meet at game speed, immediate shot on balance",
    high: "Pressured: Full-speed toss-and-meet with shot clock, shoot instantly on arrival",
  },
  "Screen Rejection Jumpers": {
    low: "Form: Reject slow screen, controlled chest stop, recover into jump shot",
    medium: "Game-Speed: Screen rejection at game pace, recover shot through contact",
    high: "Pressured: Full-speed screen rejection, aggressive chest stop, explosive recovery shot",
  },
  "The Curry Drill": {
    low: "Technique: Slow relocation cuts using passers and screeners, work for clean look",
    medium: "Game-Speed: Curry drill at game pace, use screeners to create three-point space",
    high: "Pressured: Live defender full drill, create and execute three-point shot under pressure",
  },
  "2v1 / 1v2 Shooting": {
    low: "Technique: Read two slow defenders, find space for controlled short jumper",
    medium: "Game-Speed: 1v2 at game speed, quick read and shoot before help arrives",
    high: "Pressured: Live 1v2 at full game intensity, shoot under maximum pressure",
  },
  "Tense to Relaxed Shooting": {
    low: "Technique: Light pushing/pulling from partner, controlled shift to relaxed shot",
    medium: "Game-Speed: Moderate disruption, quick shift from tense to fluid on go signal",
    high: "Pressured: Aggressive push/pull, explosive release from tension to relaxed fluid shot",
  },
  "Peripheral Vision/Quiet Eye Turn": {
    low: "Technique: Slow turn, deliberate quiet eye focus on rim before controlled shot",
    medium: "Game-Speed: Mid-speed turn with hands up from defender, lock eyes and shoot",
    high: "Pressured: Late turn with aggressive defender, fast quiet eye lock and shoot",
  },
  "Turn and Decide (Close-out)": {
    low: "Technique: Turn late, slow close-out read, decide shoot or drive at half speed",
    medium: "Game-Speed: Turn and decide at game pace, instant shoot or drive decision",
    high: "Pressured: Full-speed turn, aggressive close-out, committed instant decision",
  },
  "Arm-Free Pickup Shoot": {
    low: "Technique: Drive slowly with partner lightly holding arm, controlled arm-free pickup",
    medium: "Game-Speed: Game-speed drive, defender on arm, fluid pickup into shot",
    high: "Pressured: Aggressive defender on arm, explosive disentanglement into shot",
  },
  "Bump and Score (Step-back)": {
    low: "Technique: Controlled bump into defender, slow step-back for jumper",
    medium: "Game-Speed: Game-speed bump and step-back, create space and shoot",
    high: "Pressured: Full-speed bump with live defender, explosive step-back jumper",
  },
  "Corner Out of Bounds": {
    low: "Form: Five corner out-of-bounds shots, focus on arc and precision",
    medium: "Game-Speed: Corner out-of-bounds at game pace, simulate end-of-game pressure",
    high: "Pressured: Corner out-of-bounds with shot clock running, make on first look",
  },
  "Two-Foot Floater Series": {
    low: "Technique: Cross-between-behind at slow speed into controlled two-foot floater",
    medium: "Game-Speed: Full Kyrie two-foot floater series at game pace",
    high: "Pressured: Full-speed two-foot floater series with live defender",
  },
  "Visualization Short Jumpers": {
    low: "Technique: Slow freestyle with visualization, deliberate pull-up from each position",
    medium: "Game-Speed: Visualization drill at game speed, commit to pull-up decision",
    high: "Pressured: Full-speed visualization with defender, execute pull-up under pressure",
  },
  "Separate Back Separation Shot": {
    low: "Technique: Slow separation back move off imaginary screen, create window and shoot",
    medium: "Game-Speed: Game-speed ball screen separation, shoot before defender recovers",
    high: "Pressured: Live screen with hard hedge, explosive separation and quick shot",
  },
  "Wichita Help-Side Counter Pull-up": {
    low: "Technique: Slow wing rip with visualized help defender, controlled counter pull-up",
    medium: "Game-Speed: Help-side counter pull-up at game pace, smooth transition from drive",
    high: "Pressured: Live help defender rotating, explosive counter into pull-up jumper",
  },
  "Catch and Shoot (On the Move)": {
    low: "Form: Relocation cuts at walking pace, catch and shoot with perfect footwork",
    medium: "Game-Speed: Catch and shoot on the move at full game speed",
    high: "Pressured: Game-speed relocation with active defender, shoot on catch",
  },
  "Mid-Range Volume Pull-ups (25 Each Way)": {
    low: "Form: 25 pull-ups each direction at deliberate pace, perfect legal first step",
    medium: "Game-Speed: 25 pull-up jumpers each way at game tempo, legal footwork focus",
    high: "Pressured: Volume pull-ups each direction with closing defender, clean footwork",
  },
  "Hezi BTB/Push Cross Pull-up": {
    low: "Technique: Slow BTB or push-cross hesitation, controlled pull-up entry",
    medium: "Game-Speed: BTB/push-cross hezi at game speed, freeze then rise to pull-up",
    high: "Pressured: Full-speed BTB/push-cross with live defender, sell freeze and shoot",
  },
  "Lunge Stop Anchor Stop Pull-up": {
    low: "Technique: Slow lunge into anchor stop, controlled momentum kill before pull-up",
    medium: "Game-Speed: Lunge-anchor stop pull-up at game pace, snap from drive to shot",
    high: "Pressured: Full-speed lunge anchor stop with live defender, explosive jump shot",
  },
  "Low-to-Ground Differential Pickup": {
    low: "Technique: Deliberate awkward low pickups in motion, find rhythm into shot",
    medium: "Game-Speed: Low-to-ground pickup challenge at game pace, adaptive shooting",
    high: "Pressured: Full-speed awkward pickups with defender, shoot without reset",
  },
  "Offhand Floater Development Circuit": {
    low: "Form: Off-hand floater circuit at deliberate pace, focus on touch and arc",
    medium: "Game-Speed: Off-hand floater circuit at game tempo, one-foot and two-foot variety",
    high: "Pressured: High-volume off-hand floater circuit with live defender challenging",
  },
  "One Move Capstone Shooting": {
    low: "Technique: One chosen move into any shooting option at slow pace, build confidence",
    medium: "Game-Speed: Capstone move into shooting option at game tempo",
    high: "Pressured: Full-speed capstone move with live defender, execute under fatigue",
  },
  "Ball Screen Hedge & Relocation": {
    low: "Technique: Slow hard hedge play, deliberate ball-out to short roller then relocate",
    medium: "Game-Speed: Hard hedge response at game pace, quick relocation for return pass",
    high: "Pressured: Live hard hedge with aggressive defense, fast ball-out and shooting relocation",
  },
  "Different Footwork Every Rep": {
    low: "Technique: Corner to corner shooting, different footwork each rep at slow tempo",
    medium: "Game-Speed: Corner to corner at game pace, varied footwork — no repeats",
    high: "Pressured: Full-speed corner to corner, different footwork every rep with defender",
  },
  // Finishing
  "Off-Board Touch Finishing": {
    low: "Form: Toss ball off backboard/rim at slow pace, react and finish with creativity",
    medium: "Game-Speed: Off-board touch finishing at game speed, varied creative finishes",
    high: "Pressured: Max-speed off-board finishing with live defender at rim",
  },
  "Modified Inside-Hand Mikan": {
    low: "Form: Mikan-style drill using inside hand only, slow touch and high spin focus",
    medium: "Game-Speed: Inside-hand Mikan at game pace, soft touch and backboard spin",
    high: "Pressured: Full-speed inside-hand Mikan with tight time windows",
  },
  "Wide Hook Soft Touch": {
    low: "Form: Wide hooks with both hands at slow pace, extend range of touch near rim",
    medium: "Game-Speed: Wide hooks at game speed, both hands, varied angles",
    high: "Pressured: Wide hooks with active defender, maintain touch under pressure",
  },
  "Side-to-Side Cradles": {
    low: "Form: Slow cradle side-to-side before finish, use full arm for backboard spin",
    medium: "Game-Speed: Side-to-side cradles at game pace, arm generates spin on backboard",
    high: "Pressured: Full-speed cradles with live defender, protect ball on each side",
  },
  "Off-Hand Key Extension": {
    low: "Form: Standing outside key, deliberate off-hand extension layup, no backboard",
    medium: "Game-Speed: Off-hand key extension at game speed, no backboard challenge",
    high: "Pressured: Off-hand extension with defender contesting, no backboard allowed",
  },
  "Behind-the-Back Air Dexterity": {
    low: "Form: Slow ball toss, behind-the-back while moving, find rim and finish",
    medium: "Game-Speed: Air dexterity at game pace, explosive hand-eye coordination finish",
    high: "Pressured: Full-speed air dexterity with live defense at rim",
  },
  "Standard Layup Series (Overhand, Underhand, Side-Hand)": {
    low: "Form: Slow consecutive overhand, underhand, and side-hand layups, master positioning",
    medium: "Game-Speed: Full layup series at game pace, consecutive makes target",
    high: "Pressured: Layup series at full speed with close-out defender at rim",
  },
  "Slam and Tuck Protection": {
    low: "Technique: Controlled slam dribble, deliberate rib tuck and lateral jump into partner",
    medium: "Game-Speed: Slam and tuck at game speed, shoulder shields ball on contact",
    high: "Pressured: Full-speed slam and tuck into aggressive defender, maximum protection",
  },
  "Contact Pump Fake": {
    low: "Technique: Slow slam and tuck, patient pump fake, deliberate finish over defender",
    medium: "Game-Speed: Contact pump fake at game pace, get defender in air before finish",
    high: "Pressured: Full-speed contact pump fake with aggressive defender, execute through contact",
  },
  "Pull the Chair Recovery": {
    low: "Technique: Slow lean into partner, controlled chair-pull, deliberate balance recovery",
    medium: "Game-Speed: Game-speed lean, sudden chair-pull, recover and finish",
    high: "Pressured: Full-speed aggressive lean, explosive recovery from chair-pull and finish",
  },
  "Rip-Away Finish": {
    low: "Technique: Slow gather with partner on ball, deliberate rip-away and finish",
    medium: "Game-Speed: Game-speed gather, defender hand on ball, rip away and finish",
    high: "Pressured: Aggressive defender on ball, explosive rip-away and strong finish",
  },
  "Two-Step Disentanglement": {
    low: "Technique: Defender hand firmly on ball, deliberate two steps to free and finish",
    medium: "Game-Speed: Game-speed two-step disentanglement, efficient and decisive",
    high: "Pressured: Aggressive defender hold, explosive two-step disentanglement and finish",
  },
  "Bump and Score (5 Variations)": {
    low: "Technique: Slow bump into defender hip, practice all five scoring counters methodically",
    medium: "Game-Speed: Bump and five-variation score at game pace, mix naturally",
    high: "Pressured: Full-speed bump with live defender, choose and execute best counter",
  },
  "Same Foot Same Hand (Off-Foot)": {
    low: "Technique: Controlled creative move, slow same-foot/same-hand layup, feel the timing",
    medium: "Game-Speed: Same-foot/same-hand finish at game pace, difficult for defender to time",
    high: "Pressured: Full-speed same-foot/same-hand with live defender contesting",
  },
  "Trey Young High Floater": {
    low: "Technique: Slow high-arc floater attempts, ball targets above backboard dropping in",
    medium: "Game-Speed: High floater at game pace, consistent high arc above backboard",
    high: "Pressured: High floater with shot-blocker live, maintain arc under pressure",
  },
  "Touch the Net Reach": {
    low: "Technique: Slow drive, deliberate ball-to-net reach, pull back to shoulder finish",
    medium: "Game-Speed: Game-speed touch-the-net reach, protected finish on pullback",
    high: "Pressured: Full-speed net reach with live shot-blocker, explosive extension and finish",
  },
  "Two-Foot Change of Direction (Kyrie Series)": {
    low: "Technique: Slow cross-between-behind to two-foot shift toward baseline, controlled",
    medium: "Game-Speed: Kyrie two-foot change of direction at game pace, finish at baseline",
    high: "Pressured: Full-speed Kyrie COD with live defender, decisive baseline shift and finish",
  },
  "Escape Floater": {
    low: "Technique: Slow push-out from defender hip, two-dribble fading floater, feel the escape",
    medium: "Game-Speed: Escape floater at game pace, max two dribbles under chase",
    high: "Pressured: Full-speed escape with live aggressive chaser, fading floater under pressure",
  },
  "Slow-Step / Extension Read": {
    low: "Technique: Slow approach downhill, deliberate read, choose extension or slow step",
    medium: "Game-Speed: Slow-step extension read at game pace, commit to chosen option",
    high: "Pressured: Full-speed read with live defender, instant decision on extension vs stepback",
  },
  "Overhead Gather Bait": {
    low: "Technique: Controlled pound into overhead gather, slow bait show before finish",
    medium: "Game-Speed: High-speed pound to overhead gather bait at game pace",
    high: "Pressured: Full-speed overhead gather with live shot-blocker, bait and finish under them",
  },
  "Gyro Counter Finish": {
    low: "Technique: Slow ball show to defender, controlled gyro step to opposite side and finish",
    medium: "Game-Speed: Gyro counter at game pace, decisive and smooth gyro execution",
    high: "Pressured: Full-speed gyro counter with live defender, explosive gyro step finish",
  },
  "Layups from Anywhere": {
    low: "Technique: Slow freestyle, any layup choice, catch and immediate creative secondary",
    medium: "Game-Speed: Freestyle layups at game pace, immediate secondary finish on catch",
    high: "Pressured: Full-speed layup freestyle with live defender, creative under pressure",
  },
  "Object Jump Finish": {
    low: "Technique: Object on floor, slow jump from outside, deliberate creative hand finishes",
    medium: "Game-Speed: Object jump at game pace, use hang time for varied finishes",
    high: "Pressured: Full-speed object jump with defender contesting, creative finish in traffic",
  },
  "Off-Hand Floater Circuit": {
    low: "Technique: Off-hand floater circuit at slow pace, 20 makes with one-foot and two-foot",
    medium: "Game-Speed: Off-hand floater circuit at game pace, baseline and middle variety",
    high: "Pressured: Off-hand floater circuit with live defender, maintain arc under challenge",
  },
  "Wichita Counter to Finish": {
    low: "Technique: Slow step-over cut, rip and controlled counter into tight finish at rim",
    medium: "Game-Speed: Wichita counter to finish at game pace, tight compact finish",
    high: "Pressured: Full-speed counter to finish with live help defender, remain low and compact",
  },
  "Inside Hand Driving Finish": {
    low: "Technique: Slow drive, inside hand finish, get corresponding leg up for protection",
    medium: "Game-Speed: Inside-hand drive finish at game speed, left leg up on left-hand finish",
    high: "Pressured: Full-speed inside-hand finish with live defender contesting",
  },
  "The Four-Way Reverse Sequence": {
    low: "Technique: All four reverse types slowly: drive R/finish L, R/R, L/R, L/L",
    medium: "Game-Speed: Four-way reverse sequence at game pace, varied hand-rim combinations",
    high: "Pressured: Full-speed four-way reverse with defender, all four must be completed",
  },
  "Differential Angle Floaters": {
    low: "Technique: Three floater types from different angles slowly, dexterity focus",
    medium: "Game-Speed: Differential angle floaters at game pace, different angle every rep",
    high: "Pressured: Full-speed differential floaters with live defense, varied angles",
  },
  "Underhand Floater (Same-Foot/Same-Hand)": {
    low: "Technique: Slow same-foot/hand underhand floater from further out, feel the timing",
    medium: "Game-Speed: Same-foot/hand underhand floater at game pace, away from rim",
    high: "Pressured: Full-speed underhand floater with shot-blocker, maximize distance from rim",
  },
  "Two-Foot Finish off Sell-Out Reach": {
    low: "Technique: Slow reactive step-up off deliberate reach, controlled two-foot finish",
    medium: "Game-Speed: React to sell-out reach at game speed, step up and two-foot finish",
    high: "Pressured: Live aggressive defender reach, explosive step-up two-foot balanced finish",
  },
  "Chest-Stop Screen Rejection Finish": {
    low: "Technique: Slow screen rejection, deliberate chest stop contact, compose and finish",
    medium: "Game-Speed: Screen rejection chest stop at game pace, play through small spaces",
    high: "Pressured: Full-speed rejection with aggressive chest stop, finish through contact",
  },
  "Wichita Double Rip to Finish": {
    low: "Technique: Slow double-rip drill, remain low and compact into tight finish at rim",
    medium: "Game-Speed: Double rip to tight finish at game pace, low and compact",
    high: "Pressured: Full-speed double rip with live defender, execute tight compact finish",
  },
  "Inside-Hand Reverse Finish": {
    low: "Technique: Slow baseline drive, inside-hand wrap around rim using backboard",
    medium: "Game-Speed: Inside-hand reverse at game pace, backboard shield from defender",
    high: "Pressured: Full-speed inside-hand reverse with live defender, use backboard",
  },
  "One-Move Capstone Finish": {
    low: "Technique: One chosen move into any creative finish at deliberate pace",
    medium: "Game-Speed: Capstone move into creative finish at game pace when fatigued",
    high: "Pressured: Full-speed capstone move into best available finish under live pressure",
  },
  "Kyrie Cuffing Series": {
    low: "Technique: Slow cuffing practice holding ball against forearm/wrist before move",
    medium: "Game-Speed: Cuffing series at game pace, total control during acrobatics",
    high: "Pressured: Full-speed cuffing series with live defender, maintain control at max speed",
  },
  "Kyrie 18-Shot Finishing Series": {
    low: "Technique: Six shots × three timings slowly, master each timing variation",
    medium: "Game-Speed: 18-shot series at game pace, all timings, switch sides",
    high: "Pressured: Full 18-shot series at maximum speed with live defense",
  },
  "Cradle-Change Direction Finish": {
    low: "Technique: Slow cradle gather during mid-air two-foot direction shift",
    medium: "Game-Speed: Cradle change of direction at game pace, protect ball mid-air",
    high: "Pressured: Full-speed cradle COD with live shot-blocker, maximum ball protection",
  },
  "Inside-Hand Wrap Reverse": {
    low: "Technique: Slow baseline drive, inside-hand wrap with backboard shield",
    medium: "Game-Speed: Inside-hand wrap reverse at game pace, use backboard strategically",
    high: "Pressured: Full-speed inside-hand wrap with live defender, backboard is shield",
  },
  "Wichita Double Rip Middle Finish": {
    low: "Technique: Slow rip and re-rip to middle, tight low compact finish at rim",
    medium: "Game-Speed: Double rip middle finish at game pace, stay low through contact",
    high: "Pressured: Full-speed double rip middle finish with live defense, no hesitation",
  },
  "One Move Capstone Finishing": {
    low: "Technique: 15 one-foot + 15 two-foot layups, each preceded by chosen capstone move slowly",
    medium: "Game-Speed: Capstone finishing circuit at game pace, test moves when tired",
    high: "Pressured: Full-speed capstone circuit with defender, execute finishes under fatigue",
  },
};

// ─── Block Definitions ───────────────────────────────────────────────────────
// Each block: which weeks, primary subCategory, secondary subcategories with ratios
const BLOCKS = [
  { num: 1, weeks: [1,2,3,4], primary: "ballHandling", sec1: "shooting", sec2: "finishing", p1: 0.50, p2: 0.35, p3: 0.15, label: "Ball Handling" },
  { num: 2, weeks: [5,6,7,8], primary: "shooting", sec1: "ballHandling", sec2: "finishing", p1: 0.50, p2: 0.25, p3: 0.25, label: "Shooting" },
  { num: 3, weeks: [9,10,11,12,13], primary: "finishing", sec1: "shooting", sec2: "ballHandling", p1: 0.50, p2: 0.30, p3: 0.20, label: "Finishing" },
  { num: 4, weeks: [14,15,16,17], primary: "ballHandling", sec1: "finishing", sec2: "shooting", p1: 0.50, p2: 0.30, p3: 0.20, label: "Ball Handling Renewed" },
  { num: 5, weeks: [18,19,20,21,22], primary: "shooting", sec1: "finishing", sec2: "ballHandling", p1: 0.50, p2: 0.30, p3: 0.20, label: "Shooting Renewed" },
  { num: 6, weeks: [23,24,25,26], primary: "finishing", sec1: "shooting", sec2: "ballHandling", p1: 0.50, p2: 0.30, p3: 0.20, label: "Finishing Renewed" },
];

// ─── Day patterns ────────────────────────────────────────────────────────────
const DAY_PATTERNS = {
  Monday:    { intensityDist: [0.22, 0.58, 0.20], focus: "medium" },
  Tuesday:   { intensityDist: [0.20, 0.55, 0.25], focus: "high" },
  Wednesday: { intensityDist: [0.30, 0.55, 0.15], focus: "low-medium" },
  Thursday:  { intensityDist: [0.22, 0.58, 0.20], focus: "medium" },
  Friday:    { intensityDist: [0.20, 0.55, 0.25], focus: "high" },
  Saturday:  { intensityDist: [0.28, 0.57, 0.15], focus: "low-medium" },
  Sunday:    { intensityDist: [0.40, 0.50, 0.10], focus: "low" },
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DAY_ABBREVS = { Monday:"mon", Tuesday:"tue", Wednesday:"wed", Thursday:"thu", Friday:"fri", Saturday:"sat", Sunday:"sun" };
const DURATIONS = ["30m","1h","2h","3h"];
const DRILL_COUNTS = { "30m": 4, "1h": 5, "2h": 7, "3h": 10 };
const DURATION_MULT = { "30m": 0.8, "1h": 1.0, "2h": 1.3, "3h": 1.6 };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getBlock(weekNum) {
  return BLOCKS.find(b => b.weeks.includes(weekNum));
}

function getWeekInBlock(block, weekNum) {
  return block.weeks.indexOf(weekNum) + 1; // 1-indexed
}

function blockMultiplier(blockNum) {
  return 1.0 + (blockNum - 1) * 0.2;
}

function weekInBlockMultiplier(weekInBlock) {
  if (weekInBlock === 1) return 1.0;
  if (weekInBlock === 2) return 1.10;
  if (weekInBlock === 3) return 1.15;
  return 1.20;
}

function shuffle(arr, seed) {
  // Deterministic shuffle using seed
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcMakes(base, durMult, blockMult, weekMult) {
  return Math.max(1, Math.round(base * durMult * blockMult * weekMult));
}

function calcSets(base, durMult, blockMult, weekMult) {
  return Math.max(1, Math.min(8, Math.round(base * durMult * blockMult * weekMult)));
}

function buildReps(drill, duration, blockMult, weekMult) {
  const dm = DURATION_MULT[duration];
  if (drill.repType === "makes") {
    return { type: "makes", makes: calcMakes(drill.baseMakes, dm, blockMult, weekMult) };
  }
  if (drill.repType === "makesPerHand") {
    return { type: "makesPerHand", rightMakes: calcMakes(drill.baseMakes, dm, blockMult, weekMult) };
  }
  // setsPerHand
  const sets = calcSets(drill.baseSets, dm, blockMult, weekMult);
  const reps = duration === "3h" ? Math.round(drill.baseReps * 1.2) : drill.baseReps;
  return { type: "setsPerHand", sets, rightReps: reps };
}

function assignIntensities(count, pattern) {
  // pattern = [lowFrac, medFrac, highFrac]
  const intensities = [];
  const nLow = Math.max(1, Math.round(count * pattern[0]));
  const nHigh = Math.max(0, Math.round(count * pattern[2]));
  const nMed = count - nLow - nHigh;
  for (let i = 0; i < nLow; i++) intensities.push("low");
  for (let i = 0; i < Math.max(0, nMed); i++) intensities.push("medium");
  for (let i = 0; i < nHigh; i++) intensities.push("high");
  // Trim or pad to exact count
  while (intensities.length < count) intensities.push("medium");
  while (intensities.length > count) intensities.pop();
  return intensities;
}

function getDrillDescription(drill, intensity) {
  const desc = DESCRIPTIONS[drill.name];
  if (desc && desc[intensity]) return desc[intensity];
  const prefix = intensity === "low" ? "Form" : intensity === "medium" ? "Game-Speed" : "Pressured";
  return `${prefix}: ${drill.subCategory === "ballHandling" ? "Ball handling drill" : drill.subCategory === "shooting" ? "Shooting drill" : "Finishing drill"} — ${drill.difficulty} level, focus on execution and control`;
}

// ─── Day Focus descriptions ───────────────────────────────────────────────────
const DAY_FOCUS = {
  Monday: [
    "Ball handling fundamentals and control at game speed",
    "Stationary and movement ball control under moderate pressure",
    "Core dribbling patterns with primary skill emphasis",
    "Handle development with secondary skill integration",
    "Ball movement efficiency and pace control",
    "Controlled handle work with shooting integration",
    "Handle fundamentals leading into primary block focus",
    "Dribble mechanics and decision-making under pressure",
    "Game-speed ball handling with skill block emphasis",
    "Dynamic handle patterns and combination skill work",
    "Cross-skill integration with handle-first approach",
    "Technical dribbling with finishing setup work",
    "Advanced handle combinations building to skill peak",
    "Renewed handle emphasis with explosive drive options",
    "Ball control patterns with advanced finishing reads",
    "Game-speed handle work and secondary skill activation",
    "Handle mechanics under competitive pressure",
    "Shooting preparation with ball-handling warm-up",
    "Shot creation dribble patterns at game tempo",
    "Handle-to-shot transitions and decision making",
    "Shot preparation handles and rim attack options",
    "Game-speed shot creation from handle sequences",
    "Finishing setup handles and paint attack preparation",
    "Handle patterns leading into advanced finishing circuits",
    "Contact-ready ball control with finishing integration",
    "Peak-block handle and finishing combination work",
  ],
  Tuesday: [
    "High-intensity shooting and competitive skill work",
    "Game-pressure shooting with defensive resistance",
    "Contested shooting and creative finishing at max effort",
    "High-speed skill combinations under full pressure",
    "Maximum effort shooting and handle under resistance",
    "Full-pressure finishing and movement shooting circuits",
    "Elite competitive shooting with defensive reads",
    "Pressure shooting and handle combination peak effort",
    "High-intensity finishing circuits with contested shots",
    "Max-effort skill work across all three disciplines",
    "Contested finishing and pressure shooting at full speed",
    "Game-scenario pressure work with finishing emphasis",
    "Peak pressure shooting and finishing combinations",
    "High-intensity handle and finishing under live defense",
    "Maximum effort contested finishing and attack reads",
    "Full-pressure finishing and shooting combination day",
    "Elite pressure skills across primary focus with resistance",
    "High-effort shooting creation from diverse positions",
    "Maximum shooting volume and competitive pressure",
    "Contested shots and finishing under maximum resistance",
    "Full-speed shot creation under live defensive reads",
    "Peak-effort shooting circuits with secondary finishing",
    "Maximum finishing volume under live defensive pressure",
    "High-intensity finishing and shooting combination",
    "Elite finishing under full game-speed pressure",
    "Peak block competitive finishing at maximum effort",
  ],
  Wednesday: [
    "Recovery shooting and technique reinforcement",
    "Light handle work and technical shooting refinement",
    "Controlled finishing development and technique focus",
    "Recovery skills and technical pattern reinforcement",
    "Low-medium intensity skill refinement and correction",
    "Technical work on secondary skills with light intensity",
    "Technique-focused session across primary skill block",
    "Recovery session with secondary skill maintenance",
    "Light-to-medium skills with emphasis on technique",
    "Technical refinement of primary and secondary drills",
    "Low-intensity skill maintenance and pattern drilling",
    "Recovery day with controlled finishing technique work",
    "Technical mastery focus across primary block skills",
    "Recovery-intensity advanced handle technique refine",
    "Low-medium finishing technique and control work",
    "Technical refinement of primary focus with recovery",
    "Controlled skill work and technique correction day",
    "Light shooting recovery with ball handling refinement",
    "Technical shooting patterns and rhythm development",
    "Recovery shooting and controlled ball handling work",
    "Low-medium shooting refinement and control circuits",
    "Technical shooting mastery and recovery-pace work",
    "Light finishing technique and touch development",
    "Recovery finishing work with technical detail focus",
    "Controlled finishing refinement and touch training",
    "Recovery-pace finishing and shooting technical work",
  ],
  Thursday: [
    "Primary skill development at standard game pace",
    "Core skill block work with secondary integration",
    "Game-speed skill development across block focus",
    "Primary focus reinforcement with technique emphasis",
    "Standard game-speed skill circuits",
    "Primary block skill at medium-high game pace",
    "Consistent skill work building toward week peak",
    "Primary focus acceleration with secondary support",
    "Game-speed primary skill and secondary combinations",
    "Skill block progression with secondary skill support",
    "Standard game-speed primary skill at volume",
    "Primary block skill push at medium intensity",
    "Technical skill development at game pace",
    "Advanced handle and secondary skill at game tempo",
    "Game-speed finishing and skill support circuits",
    "Primary block skill reinforcement at game pace",
    "Standard game-speed skill work across all focus areas",
    "Shooting development at game pace with handle support",
    "Game-speed shooting with secondary skill integration",
    "Primary shooting block at standard game intensity",
    "Shooting volume work at game speed with reads",
    "Game-speed shooting and secondary finishing work",
    "Finishing development at standard game intensity",
    "Game-speed finishing with shooting support work",
    "Primary finishing block at standard game pace",
    "Peak block finishing skill at game intensity",
  ],
  Friday: [
    "High-intensity finishing and competitive game scenarios",
    "Maximum pressure skill work and game reads",
    "Competitive finishing circuits at elite intensity",
    "Full-pressure game scenarios across skill block",
    "High-intensity skill competition and game reads",
    "Competitive circuits with maximum effort finishing",
    "Elite pressure skills and competitive game finishes",
    "Maximum effort game scenarios and competitive reads",
    "High-pressure finishing and competitive game skills",
    "Full-speed competitive work across skill disciplines",
    "Maximum competitive intensity across all skill areas",
    "Elite competitive finishing with defensive resistance",
    "Peak competitive skills under maximum pressure",
    "High-intensity advanced handle under game pressure",
    "Maximum finishing intensity with competitive reads",
    "Elite pressure finishing and game-speed work",
    "Full competitive intensity with primary skill peak",
    "Maximum shooting intensity and competitive reads",
    "Elite shooting competition with defensive resistance",
    "Full-pressure competitive shooting at peak intensity",
    "Maximum shooting creation under competitive pressure",
    "Elite shooting competition and secondary skill peak",
    "Maximum finishing competition under elite pressure",
    "High-intensity competitive finishing at peak block",
    "Elite competitive finishing with maximum resistance",
    "Peak block competitive finishing under maximum pressure",
  ],
  Saturday: [
    "Secondary skill focus with light-to-medium intensity",
    "Technical secondary skill work and recovery circuits",
    "Low-medium skill circuits with secondary emphasis",
    "Recovery and secondary skill development day",
    "Technical secondary work with primary skill recovery",
    "Secondary focus skill work at controlled intensity",
    "Light-medium secondary skill and technical circuits",
    "Secondary skill reinforcement at recovery intensity",
    "Technical secondary skill circuits with light intensity",
    "Low-medium secondary skill maintenance and refinement",
    "Secondary focus refinement with recovery intensity",
    "Technical secondary drills at controlled game pace",
    "Secondary skill peak preparation at low-medium effort",
    "Advanced secondary skill refinement at recovery pace",
    "Secondary skill technical work at low-medium intensity",
    "Recovery-pace secondary skill and technical circuits",
    "Secondary skill emphasis at controlled intensity",
    "Shooting touch development and secondary skill work",
    "Secondary shooting circuits at recovery intensity",
    "Ball handling technique and secondary shooting work",
    "Secondary skill technical focus at low-medium pace",
    "Shooting technique and secondary skill refinement",
    "Finishing touch and secondary skill development",
    "Secondary finishing circuits at controlled intensity",
    "Finishing refinement and secondary skill maintenance",
    "Peak block secondary finishing and technical work",
  ],
  Sunday: [
    "Active recovery with form shooting and light handles",
    "Low-intensity maintenance and skill visualization",
    "Recovery skills and mental rehearsal of week's drills",
    "Light touch work and skill pattern reinforcement",
    "Recovery pace with technique visualization",
    "Light skill maintenance and recovery circuits",
    "Low-intensity recovery with skill visualization",
    "Maintenance drills and week review at light pace",
    "Active recovery and low-intensity skill reinforcement",
    "Light skill maintenance across week's primary focus",
    "Recovery day with visualization and light circuits",
    "Low-intensity maintenance and form skill practice",
    "Recovery circuits and skill visualization practice",
    "Light recovery with advanced skill visualization",
    "Low-intensity finishing maintenance and recovery",
    "Recovery visualization and light circuit maintenance",
    "Low-intensity skill maintenance and pattern review",
    "Recovery shooting and light ball handling maintenance",
    "Light shooting touch and recovery circuit work",
    "Active recovery with visualization of shooting patterns",
    "Low-intensity shooting maintenance and recovery",
    "Recovery shooting and skill visualization practice",
    "Light finishing touch and recovery circuit work",
    "Recovery finishing visualization and light maintenance",
    "Low-intensity finishing maintenance and recovery",
    "Peak block active recovery and skill visualization",
  ],
};

// ─── Main generation ─────────────────────────────────────────────────────────
function generateWeek(weekNum) {
  const block = getBlock(weekNum);
  const weekInBlock = getWeekInBlock(block, weekNum);
  const bMult = blockMultiplier(block.num);
  const wMult = weekInBlockMultiplier(weekInBlock);
  const seed = weekNum * 12345;

  const bhDrills = shuffle(BALL_HANDLING.map(d=>({...d,subCategory:"ballHandling"})), seed + 1);
  const sDrills  = shuffle(SHOOTING.map(d=>({...d,subCategory:"shooting"})), seed + 2);
  const fDrills  = shuffle(FINISHING.map(d=>({...d,subCategory:"finishing"})), seed + 3);

  const drillsByCategory = { ballHandling: bhDrills, shooting: sDrills, finishing: fDrills };

  // Counters to cycle through drills across days
  const cursors = { ballHandling: 0, shooting: 0, finishing: 0 };

  const label = `Block ${block.num} – Week ${weekNum}: ${block.label} Emphasis`;

  const days = DAYS.map((dayName, dayIdx) => {
    const pattern = DAY_PATTERNS[dayName];
    const dayAbbrev = DAY_ABBREVS[dayName];
    const focusArr = DAY_FOCUS[dayName];
    const focus = focusArr[(weekNum - 1) % focusArr.length];

    // Determine drill count per day (total pool = sum of all duration counts)
    const totalDrillsNeeded = Object.values(DRILL_COUNTS).reduce((a,b)=>a+b,0);

    // Determine category mix for this day
    // Use block ratios: primary, sec1, sec2
    const cats = [block.primary, block.sec1, block.sec2];
    const ratios = [block.p1, block.p2, block.p3];

    // Pick drills for this day's pool, cycling through categories
    const dayPool = [];
    const usedNamesThisDay = new Set();

    let remainder = totalDrillsNeeded;
    cats.forEach((cat, ci) => {
      const count = ci < cats.length - 1 ? Math.round(remainder * ratios[ci] / (ratios.slice(ci).reduce((a,b)=>a+b,0))) : remainder;
      const pool = drillsByCategory[cat];
      let added = 0;
      let attempts = 0;
      while (added < count && attempts < pool.length * 2) {
        const drill = pool[cursors[cat] % pool.length];
        cursors[cat]++;
        attempts++;
        if (!usedNamesThisDay.has(drill.name)) {
          usedNamesThisDay.add(drill.name);
          dayPool.push(drill);
          added++;
        }
      }
      remainder -= added;
    });

    // Shuffle dayPool for variety
    const shuffledPool = shuffle(dayPool, seed + dayIdx * 7);

    // Assign drills to durations (non-overlapping within day)
    let poolIdx = 0;
    const durationWorkouts = DURATIONS.map(dur => {
      const count = DRILL_COUNTS[dur];
      const durDrills = shuffledPool.slice(poolIdx, poolIdx + count);
      poolIdx += count;

      // Assign intensities to these drills
      const intensities = shuffle(assignIntensities(durDrills.length, pattern.intensityDist), seed + dayIdx + dur.length);

      const durId = dur === "30m" ? "30" : dur;
      const drillObjects = durDrills.map((drill, di) => {
        const intensity = intensities[di] || "medium";
        return {
          id: `${dayAbbrev}-bb-${durId}-${di + 1}`,
          category: "basketball",
          subCategory: drill.subCategory,
          duration: dur,
          name: drill.name,
          description: getDrillDescription(drill, intensity),
          intensity,
          reps: buildReps(drill, dur, bMult, wMult),
        };
      });

      return { duration: dur, drills: drillObjects };
    });

    return {
      day: dayName,
      focus,
      categories: {
        basketball: {
          workouts: durationWorkouts,
        },
      },
    };
  });

  return { label, days };
}

// ─── Write files ─────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });

const weekFiles = [];
for (let w = 1; w <= 26; w++) {
  const weekData = generateWeek(w);
  const filename = `week-${String(w).padStart(3,"0")}.json`;
  weekFiles.push(filename);
  writeFileSync(join(OUT_DIR, filename), JSON.stringify(weekData, null, 2));
  process.stdout.write(`Generated ${filename}\n`);
}

const manifest = { startDate: "2026-01-01", weeks: weekFiles };
writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
process.stdout.write(`Generated manifest.json (${weekFiles.length} weeks)\n`);
process.stdout.write("Done!\n");
