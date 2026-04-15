/*  75 Hard Engagement Calendar – Data
 *  -----------------------------------
 *  Categories & counts:
 *    tip      (Business Tip)       – 23 cards  (~30 %)
 *    fitness  (Fitness Challenge)   – 19 cards  (~25 %)
 *    quiz     (Quiz)               – 19 cards  (~25 %)
 *    surprise (Surprise)           – 14 cards  (~20 %)
 *
 *  Surprise sub-types:
 *    book (6) | quote (3) | playlist (2) | bts (3)
 *
 *  Sequence rule: no two consecutive days share a category.
 *  Narrative arc:
 *    Days  1-21  Foundation
 *    Days 22-49  Deep Dives
 *    Days 50-75  Synthesis
 */

window.ENG_DATA = [

  /* ───────────────────────── DAY 1 ───────────────────────── */
  {
    day: 1,
    category: "tip",
    title: "The One Metric That Matters",
    content: {
      text: "Every startup goes through stages — acquisition, activation, retention, revenue, referral. At each stage only ONE metric tells you whether you're winning or losing. Trying to move all numbers at once is the fastest way to move none.",
      takeaway: "Before building anything, identify the ONE number that tells you if you're winning. Write it on a sticky note and look at it every morning."
    }
  },

  /* ───────────────────────── DAY 2 ───────────────────────── */
  {
    day: 2,
    category: "fitness",
    title: "The 100 Rep Challenge",
    content: {
      challenge: "Do 100 push-ups today. Break them into sets however you want — 10x10, 5x20, or go for max reps each set.",
      tip: "Can't do regular push-ups? Knee push-ups count. Consistency > perfection.",
      sharePrompt: "Share your set breakdown on Stories and tag me!"
    }
  },

  /* ───────────────────────── DAY 3 ───────────────────────── */
  {
    day: 3,
    category: "quiz",
    title: "Startup Funding 101",
    content: {
      question: "What does 'bootstrapping' mean in the startup world?",
      options: [
        "Raising money from VCs",
        "Building with personal savings, no external funding",
        "Copying a competitor's model",
        "Launching with an MVP"
      ],
      correctIndex: 1,
      explanation: "Bootstrapping means self-funding. Companies like Mailchimp and Basecamp were bootstrapped to massive scale without ever taking VC money."
    }
  },

  /* ───────────────────────── DAY 4 ───────────────────────── */
  {
    day: 4,
    category: "surprise",
    title: "Book: Atomic Habits",
    content: {
      type: "book",
      text: "This book changed how I think about building systems instead of setting goals. The 1% better every day compound effect is real.",
      why: "If you're doing 75 Hard, this is THE companion book. It explains why the small daily disciplines actually work.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 5 ───────────────────────── */
  {
    day: 5,
    category: "tip",
    title: "User Personas Aren't Fluff",
    content: {
      text: "Most founders skip user personas because they 'already know their customer.' Then they build features nobody asked for. A one-page persona — name, job, frustration, dream outcome — keeps your entire team aligned on who you're actually serving.",
      takeaway: "Write one persona today. Give them a name, a job title, their biggest frustration, and the outcome they'd pay money for."
    }
  },

  /* ───────────────────────── DAY 6 ───────────────────────── */
  {
    day: 6,
    category: "fitness",
    title: "The Plank Ladder",
    content: {
      challenge: "Hold a plank for 30 seconds, rest 15 seconds. Then 45 seconds, rest 15. Then 60 seconds, rest 15. Then back down: 45 seconds, then 30 seconds. That's one cycle — do two cycles total.",
      tip: "Keep your hips level with your shoulders. If your butt is in the air, you're cheating your core out of the work.",
      sharePrompt: "Screenshot your timer after the final hold and share your total time!"
    }
  },

  /* ───────────────────────── DAY 7 ───────────────────────── */
  {
    day: 7,
    category: "quiz",
    title: "Marketing Speak",
    content: {
      question: "What does CTR stand for in digital marketing?",
      options: [
        "Cost To Retain",
        "Click-Through Rate",
        "Customer Turnover Ratio",
        "Content Tracking Report"
      ],
      correctIndex: 1,
      explanation: "CTR = Click-Through Rate. It measures how many people who see your ad or link actually click on it. A higher CTR usually means your copy or creative is resonating."
    }
  },

  /* ───────────────────────── DAY 8 ───────────────────────── */
  {
    day: 8,
    category: "surprise",
    title: "Quote: Steve Jobs on Focus",
    content: {
      type: "quote",
      text: "\"People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas.\" — Steve Jobs",
      why: "75 Hard is the ultimate exercise in focus. You picked a set of rules and now you say no to everything that conflicts with them. That discipline translates directly to building products and companies.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 9 ───────────────────────── */
  {
    day: 9,
    category: "tip",
    title: "Write Hooks, Not Headlines",
    content: {
      text: "The first line of any piece of content has one job: make them read the second line. 'Here are 5 marketing tips' is a headline. '90% of startups waste their first $10K on ads that don't work — here's what to do instead' is a hook. Hooks create an open loop the reader has to close.",
      takeaway: "Rewrite the opening line of your last social post or email using an open loop. Test it against the original."
    }
  },

  /* ───────────────────────── DAY 10 ───────────────────────── */
  {
    day: 10,
    category: "fitness",
    title: "Bodyweight Squat Burnout",
    content: {
      challenge: "Set a timer for 10 minutes. Do as many bodyweight squats as you can with good form. Rest whenever you need to, but keep the timer running. Log your total count.",
      tip: "Feet shoulder-width apart, chest up, push your knees out over your toes. Go at least to parallel — your hip crease below your knee.",
      sharePrompt: "Drop your total reps in your Stories! Let's see who hits 200+."
    }
  },

  /* ───────────────────────── DAY 11 ───────────────────────── */
  {
    day: 11,
    category: "quiz",
    title: "The Famous Pivot",
    content: {
      question: "What was Instagram originally called before it pivoted?",
      options: [
        "PicShare",
        "Burbn",
        "SnapGrid",
        "PhotoVault"
      ],
      correctIndex: 1,
      explanation: "Instagram started as Burbn, a location-based check-in app. The founders noticed users loved the photo-sharing feature most, stripped everything else, and the rest is history."
    }
  },

  /* ───────────────────────── DAY 12 ───────────────────────── */
  {
    day: 12,
    category: "tip",
    title: "TAM, SAM, SOM — Size Your Market",
    content: {
      text: "Total Addressable Market is everyone who could ever use your product. Serviceable Addressable Market is the slice you can realistically reach. Serviceable Obtainable Market is what you can actually capture in the next 1-2 years. Investors don't care about your TAM if your SOM is tiny.",
      takeaway: "Calculate your SOM right now. How many customers can you realistically acquire in 12 months with your current resources? That's the number that matters."
    }
  },

  /* ───────────────────────── DAY 13 ───────────────────────── */
  {
    day: 13,
    category: "fitness",
    title: "The 20-Minute Walk Challenge",
    content: {
      challenge: "Take a 20-minute walk — outside, no headphones, no phone scrolling. Just walk and think. Use it as a mental reset.",
      tip: "Walking without distraction is one of the most underrated productivity tools. Some of the best product ideas come during walks, not meetings.",
      sharePrompt: "Take a photo of something you noticed on your walk that you'd normally miss. Share it!"
    }
  },

  /* ───────────────────────── DAY 14 ───────────────────────── */
  {
    day: 14,
    category: "surprise",
    title: "Book: Deep Work",
    content: {
      type: "book",
      text: "Cal Newport makes the case that the ability to focus without distraction is becoming rare and therefore incredibly valuable. Deep work is a superpower in a world of constant notifications.",
      why: "If you're building something — a startup, a side project, a new skill — your rate of progress is directly proportional to the hours of deep work you put in. This book gives you the framework.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 15 ───────────────────────── */
  {
    day: 15,
    category: "tip",
    title: "Ship Fast, Learn Faster",
    content: {
      text: "The #1 mistake new builders make is spending 6 months perfecting V1. Your first version should embarrass you a little. If it doesn't, you waited too long. When I built bloc, the first version was a single NFC tag and a bare-bones Screen Time integration. Ugly? Yes. But it told me people actually wanted the product before I invested in polishing it.",
      takeaway: "What's the fastest version of your idea you could ship in 2 weeks? Strip it down to one core action and launch it."
    }
  },

  /* ───────────────────────── DAY 16 ───────────────────────── */
  {
    day: 16,
    category: "fitness",
    title: "Burpee Countdown",
    content: {
      challenge: "Do a descending ladder: 10 burpees, rest 30 seconds, 9 burpees, rest 30 seconds, all the way down to 1. That's 55 total burpees.",
      tip: "If full burpees are too intense, drop the push-up at the bottom — just squat, kick back, hop up. The movement still gets your heart rate up.",
      sharePrompt: "Time yourself from first burpee to last. Post your total time!"
    }
  },

  /* ───────────────────────── DAY 17 ───────────────────────── */
  {
    day: 17,
    category: "quiz",
    title: "Pricing Psychology",
    content: {
      question: "What is 'anchoring' in pricing strategy?",
      options: [
        "Offering the cheapest price to attract customers",
        "Showing a higher-priced option first so other prices seem reasonable by comparison",
        "Matching competitor prices exactly",
        "Pricing based on production cost plus margin"
      ],
      correctIndex: 1,
      explanation: "Anchoring uses a high reference price to make your actual price feel like a deal. That's why SaaS products often show an 'Enterprise' tier first — everything else looks affordable next to it."
    }
  },

  /* ───────────────────────── DAY 18 ───────────────────────── */
  {
    day: 18,
    category: "surprise",
    title: "BTS: Why I Started 75 Hard",
    content: {
      type: "bts",
      text: "Day 1 was chaos. I had no meal prep, no workout plan, and I almost forgot the second workout. I sat down that night and built a simple spreadsheet to track everything — water, workouts, reading, diet. That spreadsheet became the skeleton for this very calendar you're looking at.",
      why: "Starting messy is still starting. You don't need a perfect system on Day 1. You need a system you'll actually use, and you refine it as you go.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 19 ───────────────────────── */
  {
    day: 19,
    category: "tip",
    title: "The Content Flywheel",
    content: {
      text: "One piece of long-form content can become 10+ pieces. A podcast episode becomes a blog post, 5 tweets, a LinkedIn carousel, 2 short-form videos, and a newsletter excerpt. Build once, distribute everywhere. The flywheel spins faster the more consistent you are.",
      takeaway: "Take your best-performing piece of content from the last month and repurpose it into at least 3 different formats this week."
    }
  },

  /* ───────────────────────── DAY 20 ───────────────────────── */
  {
    day: 20,
    category: "fitness",
    title: "Wall Sit Endurance Test",
    content: {
      challenge: "Find a wall. Slide down until your thighs are parallel to the ground. Hold for as long as you can. Rest 2 minutes. Do it again 3 more times. Log each hold duration.",
      tip: "Press your entire back flat against the wall and keep your knees at exactly 90 degrees. It'll burn — that means it's working.",
      sharePrompt: "Post your longest hold time! Anything over 90 seconds is elite."
    }
  },

  /* ───────────────────────── DAY 21 ───────────────────────── */
  {
    day: 21,
    category: "quiz",
    title: "Business Model Basics",
    content: {
      question: "What type of business model does a company use when it offers a free basic product and charges for premium features?",
      options: [
        "Subscription model",
        "Freemium model",
        "Marketplace model",
        "Advertising model"
      ],
      correctIndex: 1,
      explanation: "Freemium gives users a free tier to experience the product, then converts a percentage into paying customers. Spotify, Slack, and Dropbox all used this model to grow rapidly."
    }
  },

  /* ──────────────── DAYS 22-49 — DEEP DIVES ──────────────── */

  /* ───────────────────────── DAY 22 ───────────────────────── */
  {
    day: 22,
    category: "surprise",
    title: "Book: Zero to One",
    content: {
      type: "book",
      text: "Peter Thiel argues that true innovation goes from 0 to 1 — creating something entirely new — rather than 1 to N, which is copying what works. His contrarian question: 'What important truth do very few people agree with you on?'",
      why: "This book rewires how you think about competition. Instead of fighting over the same market, it pushes you to find or create a market you can own. Essential reading for any builder.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 23 ───────────────────────── */
  {
    day: 23,
    category: "tip",
    title: "Unit Economics or Bust",
    content: {
      text: "If it costs you $50 to acquire a customer and that customer only ever pays you $30, you don't have a business — you have an expensive hobby. Unit economics is the math of one transaction: what does it cost to serve one customer versus what they pay you over their lifetime?",
      takeaway: "Calculate your Customer Acquisition Cost (CAC) and Lifetime Value (LTV) right now. If LTV isn't at least 3x CAC, you need to fix your funnel or your pricing before you scale."
    }
  },

  /* ───────────────────────── DAY 24 ───────────────────────── */
  {
    day: 24,
    category: "fitness",
    title: "HIIT in the Living Room",
    content: {
      challenge: "40 seconds on, 20 seconds off. 6 exercises, 3 rounds: jumping jacks, mountain climbers, high knees, squat jumps, plank shoulder taps, lunges. That's 18 minutes of total work.",
      tip: "Set a timer app to beep at your intervals so you don't have to watch the clock. Go hard during the 40 seconds — the 20-second rest is your reward.",
      sharePrompt: "Rate this workout 1-10 on difficulty after you finish!"
    }
  },

  /* ───────────────────────── DAY 25 ───────────────────────── */
  {
    day: 25,
    category: "quiz",
    title: "The RICE Framework",
    content: {
      question: "In the RICE prioritization framework, what does RICE stand for?",
      options: [
        "Revenue, Impact, Cost, Effort",
        "Reach, Impact, Confidence, Effort",
        "Risk, Innovation, Cost, Execution",
        "Results, Insight, Capacity, Efficiency"
      ],
      correctIndex: 1,
      explanation: "RICE scores help product managers prioritize features objectively. You estimate Reach, rate Impact, assign a Confidence percentage, and divide by Effort to get a score. Higher score = higher priority."
    }
  },

  /* ───────────────────────── DAY 26 ───────────────────────── */
  {
    day: 26,
    category: "tip",
    title: "A/B Testing Without a Huge Audience",
    content: {
      text: "You don't need millions of visitors to A/B test. Test one variable at a time on your landing page — headline, CTA button color, hero image. Even with 100 visitors a week, you'll see directional trends. The key is testing only ONE thing per experiment so you know what caused the change.",
      takeaway: "Pick the lowest-performing page on your site. Change only the headline. Run it for one week and compare the click-through rate to the original."
    }
  },

  /* ───────────────────────── DAY 27 ───────────────────────── */
  {
    day: 27,
    category: "fitness",
    title: "Stairway to Fitness",
    content: {
      challenge: "Find a staircase — at home, in your building, or in a park. Walk or run up and down for 15 minutes straight. Count your total flights.",
      tip: "Drive through your heels on the way up to target your glutes. On the way down, go slowly and controlled to protect your knees.",
      sharePrompt: "How many flights did you climb? Share your count!"
    }
  },

  /* ───────────────────────── DAY 28 ───────────────────────── */
  {
    day: 28,
    category: "quiz",
    title: "Burn Rate Basics",
    content: {
      question: "If a startup has $600,000 in the bank and spends $50,000 per month, what is its runway?",
      options: [
        "6 months",
        "12 months",
        "18 months",
        "24 months"
      ],
      correctIndex: 1,
      explanation: "Runway = Cash / Monthly Burn Rate. $600K / $50K = 12 months. Every founder should know their runway by heart — it tells you exactly how much time you have to make the business work."
    }
  },

  /* ───────────────────────── DAY 29 ───────────────────────── */
  {
    day: 29,
    category: "surprise",
    title: "Quote: Naval on Leverage",
    content: {
      type: "quote",
      text: "\"Give me a lever long enough and a place to stand, and I shall move the world. Code and media are permissionless leverage. They're the leverage behind the new fortunes.\" — Naval Ravikant",
      why: "Building a product or creating content gives you leverage that works while you sleep. That's why coding, writing, and creating are the highest-leverage skills you can develop.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 30 ───────────────────────── */
  {
    day: 30,
    category: "tip",
    title: "Build Moats, Not Features",
    content: {
      text: "Features get copied in weeks. Moats take years to replicate. A moat is your unfair advantage: network effects, proprietary data, brand loyalty, switching costs, or economies of scale. Every feature you ship should widen your moat, not just add a checkbox to your marketing page.",
      takeaway: "Write down your company's moat in one sentence. If you can't, your most important strategic task is figuring out what it could be."
    }
  },

  /* ───────────────────────── DAY 31 ───────────────────────── */
  {
    day: 31,
    category: "fitness",
    title: "The Ab Circuit",
    content: {
      challenge: "3 rounds, no rest between exercises, 60 seconds rest between rounds: 20 crunches, 20 bicycle kicks (total), 20 leg raises, 30-second plank, 20 Russian twists (total).",
      tip: "Keep your lower back pressed into the ground during crunches and leg raises. If it arches, you're letting your hip flexors do the work instead of your abs.",
      sharePrompt: "Rate the burn 1-10 and share which exercise destroyed you most!"
    }
  },

  /* ───────────────────────── DAY 32 ───────────────────────── */
  {
    day: 32,
    category: "quiz",
    title: "CAC vs LTV Showdown",
    content: {
      question: "A healthy SaaS business typically aims for an LTV:CAC ratio of at least:",
      options: [
        "1:1",
        "2:1",
        "3:1",
        "10:1"
      ],
      correctIndex: 2,
      explanation: "The golden rule is LTV should be at least 3x CAC. At 1:1 you're just breaking even on acquisition. At 3:1 you have enough margin to reinvest in growth, cover overhead, and actually build a profitable business."
    }
  },

  /* ───────────────────────── DAY 33 ───────────────────────── */
  {
    day: 33,
    category: "surprise",
    title: "Gym Beast Mode Playlist",
    content: {
      type: "playlist",
      text: "The ultimate high-energy workout playlist: think heavy bass, fast BPM, and tracks that make you want to sprint through a wall. Genres spanning hip-hop, electronic, and hard-hitting pop remixes. 45 minutes of pure adrenaline.",
      why: "Music at 140+ BPM has been scientifically shown to improve workout performance. The right playlist turns a dreaded workout into the best part of your day.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 34 ───────────────────────── */
  {
    day: 34,
    category: "tip",
    title: "Pricing Strategy: Don't Race to the Bottom",
    content: {
      text: "Underpricing kills more startups than overpricing. When you charge too little, you attract price-sensitive customers who churn, you can't afford support, and you signal low value. When I was pricing bloc, my instinct was to make it cheap so more people would buy. Instead, I tested a higher price point — and conversion barely changed while revenue per customer doubled.",
      takeaway: "If you haven't raised your prices in the last 6 months, test a 20% increase on new customers this week. Track conversion rate — you might be surprised."
    }
  },

  /* ───────────────────────── DAY 35 ───────────────────────── */
  {
    day: 35,
    category: "fitness",
    title: "Pull-Up Progression Day",
    content: {
      challenge: "No pull-up bar? No problem. Find a sturdy door frame, a playground bar, or even a strong tree branch. Do 5 sets: hang for 20 seconds, then attempt as many pull-ups or chin-ups as you can. If you can't do a full rep, do slow negatives (jump up, lower yourself down slowly for 5 seconds).",
      tip: "Negatives build the strength you need for full pull-ups faster than any other exercise. 3-5 second lowering phase is the sweet spot.",
      sharePrompt: "Share how many full reps you got — or how many negatives. Progress is progress!"
    }
  },

  /* ───────────────────────── DAY 36 ───────────────────────── */
  {
    day: 36,
    category: "quiz",
    title: "The MoSCoW Method",
    content: {
      question: "In the MoSCoW prioritization method, what does the 'S' stand for?",
      options: [
        "Simple",
        "Should have",
        "Strategic",
        "Scalable"
      ],
      correctIndex: 1,
      explanation: "MoSCoW = Must have, Should have, Could have, Won't have (this time). It's a dead-simple way to prioritize features for a release. Everything in 'Must have' ships; the rest gets triaged."
    }
  },

  /* ───────────────────────── DAY 37 ───────────────────────── */
  {
    day: 37,
    category: "tip",
    title: "SEO in 15 Minutes a Day",
    content: {
      text: "You don't need to be an SEO expert. Here's the 80/20: write content that answers a specific question people actually Google, put the keyword in your title and first paragraph, and earn one backlink by sharing the post in a relevant community. Do this daily for 90 days and you'll outrank 90% of competitors who only do paid ads.",
      takeaway: "Go to Google's 'People also ask' section for your niche keyword. Write a 500-word blog post that answers the top question better than anything currently ranking."
    }
  },

  /* ───────────────────────── DAY 38 ───────────────────────── */
  {
    day: 38,
    category: "fitness",
    title: "Digital Detox Walk",
    content: {
      challenge: "Leave your phone at home (or in a drawer). Walk for 30 minutes with absolutely zero screens. If you need to time it, use a basic watch or just estimate. The point is zero digital input.",
      tip: "This is harder than it sounds. Your brain will crave the dopamine of checking your phone. That craving is exactly why this exercise matters. If you've tried bloc, you know the feeling of reclaiming that headspace — this walk is the analog version.",
      sharePrompt: "When you get back, write down the one thought you had during the walk that you wouldn't have had while scrolling. Share it!"
    }
  },

  /* ───────────────────────── DAY 39 ───────────────────────── */
  {
    day: 39,
    category: "quiz",
    title: "Revenue Models Pop Quiz",
    content: {
      question: "Which revenue model does Uber primarily use?",
      options: [
        "Subscription",
        "Freemium",
        "Transaction fee / commission",
        "Licensing"
      ],
      correctIndex: 2,
      explanation: "Uber takes a commission (typically 20-30%) on every ride. Marketplace businesses that match buyers and sellers often use a transaction fee model because it scales directly with usage."
    }
  },

  /* ───────────────────────── DAY 40 ───────────────────────── */
  {
    day: 40,
    category: "surprise",
    title: "Book: The Lean Startup",
    content: {
      type: "book",
      text: "Eric Ries popularized the Build-Measure-Learn loop: ship the smallest possible version, measure what happens, learn from it, and iterate. It killed the 'build it in secret for 2 years' approach to startups.",
      why: "If you're building anything — an app, a side hustle, even a personal brand — this methodology saves you months of wasted effort by forcing you to validate before you invest.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 41 ───────────────────────── */
  {
    day: 41,
    category: "tip",
    title: "Viral Loops: Engineered Word of Mouth",
    content: {
      text: "Dropbox gave you extra storage for every friend you invited. Hotmail put 'Get your free email' in every outgoing message. A viral loop means your product's usage naturally creates more users. The best loops are embedded in the core experience, not bolted on as an afterthought.",
      takeaway: "Ask yourself: when someone uses my product, does anyone else find out about it automatically? If not, design one moment in the user journey that naturally shares the product."
    }
  },

  /* ───────────────────────── DAY 42 ───────────────────────── */
  {
    day: 42,
    category: "fitness",
    title: "Mobility Reset",
    content: {
      challenge: "Spend 20 minutes on mobility: 5 minutes hip circles and hip flexor stretches, 5 minutes shoulder pass-throughs and arm circles, 5 minutes hamstring and calf stretches, 5 minutes spinal twists and cat-cow stretches.",
      tip: "Mobility isn't just for rest days — it's injury prevention. Tight hips and shoulders are the #1 reason people get hurt during bodyweight training.",
      sharePrompt: "What's your tightest area? Share your biggest mobility struggle!"
    }
  },

  /* ───────────────────────── DAY 43 ───────────────────────── */
  {
    day: 43,
    category: "quiz",
    title: "Product Management Jargon",
    content: {
      question: "What does 'MVP' stand for in product development?",
      options: [
        "Most Viable Plan",
        "Minimum Viable Product",
        "Market Validation Process",
        "Maximum Value Proposition"
      ],
      correctIndex: 1,
      explanation: "An MVP is the simplest version of your product that lets you test your core hypothesis with real users. It's not about building something bad — it's about building only what's necessary to learn."
    }
  },

  /* ───────────────────────── DAY 44 ───────────────────────── */
  {
    day: 44,
    category: "tip",
    title: "The PRD: Your Product's Blueprint",
    content: {
      text: "A Product Requirements Document doesn't have to be 30 pages. The best PRDs fit on one page: Problem statement, target user, success metric, proposed solution, out of scope, and timeline. If your team can't agree on a one-page PRD, you're not ready to start building.",
      takeaway: "Before your next feature build, write a one-page PRD using this template: Problem (2 sentences), User (1 sentence), Metric (1 number), Solution (3-5 bullet points), Not Doing (3 bullets), Timeline (1 date)."
    }
  },

  /* ───────────────────────── DAY 45 ───────────────────────── */
  {
    day: 45,
    category: "fitness",
    title: "Farmer Carry Challenge",
    content: {
      challenge: "Grab two heavy objects — filled water jugs, loaded backpacks, heavy grocery bags — and walk 100 meters. Rest 60 seconds. Repeat 5 times. Keep your shoulders back and core tight the entire time.",
      tip: "Farmer carries build grip strength, core stability, and shoulder endurance all at once. They're one of the most functional exercises you can do with zero gym equipment.",
      sharePrompt: "What did you carry? Get creative and share your makeshift weights!"
    }
  },

  /* ───────────────────────── DAY 46 ───────────────────────── */
  {
    day: 46,
    category: "quiz",
    title: "Famous Founders",
    content: {
      question: "Who co-founded Airbnb by selling cereal boxes during the 2008 election?",
      options: [
        "Elon Musk",
        "Brian Chesky",
        "Jack Dorsey",
        "Drew Houston"
      ],
      correctIndex: 1,
      explanation: "Brian Chesky and Joe Gebbia sold 'Obama O's' and 'Cap'n McCain's' cereal to fund Airbnb's early days. They made about $30,000 — proving that hustle can cover runway when funding doesn't exist."
    }
  },

  /* ───────────────────────── DAY 47 ───────────────────────── */
  {
    day: 47,
    category: "surprise",
    title: "BTS: Halfway Reflections",
    content: {
      type: "bts",
      text: "We're past the halfway mark. Honest truth: around Day 30, I almost broke. Not because the workouts were hard — because the monotony was hard. Doing the same disciplines every single day strips away the novelty. What's left is the real question: do you want this, or did you just want to say you were doing it?",
      why: "The middle is where most people quit — in 75 Hard, in business, in anything. If you're still here, you've already beaten the average. The back half is where transformation happens.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 48 ───────────────────────── */
  {
    day: 48,
    category: "tip",
    title: "Customer Development: Talk to Humans",
    content: {
      text: "Surveys lie. Analytics tell you what happened. But only conversations tell you why. Customer development means getting on calls with real users and asking open-ended questions: 'Walk me through the last time you experienced this problem.' Never ask 'Would you pay for X?' — instead ask 'How are you solving this today, and what does that cost you?'",
      takeaway: "Schedule 3 customer calls this week. Prepare 5 open-ended questions. Just listen — don't pitch. The insights will be worth more than a month of analytics."
    }
  },

  /* ───────────────────────── DAY 49 ───────────────────────── */
  {
    day: 49,
    category: "quiz",
    title: "The Lean Canvas",
    content: {
      question: "How many sections does a standard Lean Canvas have?",
      options: [
        "5",
        "7",
        "9",
        "12"
      ],
      correctIndex: 2,
      explanation: "The Lean Canvas has 9 sections: Problem, Solution, Key Metrics, Unique Value Proposition, Unfair Advantage, Channels, Customer Segments, Cost Structure, and Revenue Streams. It's a one-page business plan designed to be completed in under 20 minutes."
    }
  },

  /* ──────────────── DAYS 50-75 — SYNTHESIS ──────────────── */

  /* ───────────────────────── DAY 50 ───────────────────────── */
  {
    day: 50,
    category: "tip",
    title: "CAC Payback Period: The Metric VCs Love",
    content: {
      text: "CAC Payback Period tells you how many months it takes to earn back what you spent acquiring a customer. If your CAC is $300 and your monthly revenue per customer is $50, your payback period is 6 months. Anything under 12 months is healthy for SaaS. Over 18 months and you're funding growth with future money — dangerous territory.",
      takeaway: "Calculate your CAC payback period today. If it's over 12 months, either reduce acquisition costs or increase early revenue per customer through upsells or higher entry pricing."
    }
  },

  /* ───────────────────────── DAY 51 ───────────────────────── */
  {
    day: 51,
    category: "surprise",
    title: "Book: Hooked",
    content: {
      type: "book",
      text: "Nir Eyal's Hook Model breaks down habit-forming products into four stages: Trigger, Action, Variable Reward, Investment. Every product that becomes part of your daily routine — Instagram, Slack, even your email — follows this loop.",
      why: "Understanding the Hook Model is a double-edged sword: it teaches you how to build products people love, but also reveals how some products manipulate you. Read this to build the former and recognize the latter.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 52 ───────────────────────── */
  {
    day: 52,
    category: "tip",
    title: "Pivot vs Persevere: The Hardest Call",
    content: {
      text: "A pivot isn't failure — it's a strategic redirection based on evidence. Instagram pivoted from a check-in app. Slack pivoted from a video game. The question isn't 'is this working?' but 'are the underlying assumptions still valid?' If your users love the problem but hate your solution, pivot the solution. If they don't care about the problem, pivot the problem.",
      takeaway: "Write down the 3 core assumptions behind your current project. For each one, list the evidence for and against it. If any assumption has more evidence against it, it's time for an honest conversation about pivoting."
    }
  },

  /* ───────────────────────── DAY 53 ───────────────────────── */
  {
    day: 53,
    category: "fitness",
    title: "The Deck of Cards Workout",
    content: {
      challenge: "Assign exercises to suits: Hearts = push-ups, Diamonds = squats, Clubs = lunges (each side), Spades = sit-ups. Draw a card — the number is your reps (face cards = 10, Aces = 11). Go through the entire deck. That's ~380 total reps.",
      tip: "Use a real deck or a random card generator app. The randomness keeps it fun and unpredictable — your brain never knows what's coming next.",
      sharePrompt: "How long did it take you to get through the full deck? Share your time!"
    }
  },

  /* ───────────────────────── DAY 54 ───────────────────────── */
  {
    day: 54,
    category: "quiz",
    title: "Hardware Meets Software",
    content: {
      question: "What is NFC technology primarily used for in consumer products?",
      options: [
        "Long-range wireless internet",
        "Short-range contactless communication and data transfer",
        "Satellite GPS tracking",
        "Bluetooth audio streaming"
      ],
      correctIndex: 1,
      explanation: "NFC (Near Field Communication) enables tap-to-interact experiences — think Apple Pay, transit cards, or products like bloc that use an NFC fridge magnet to trigger phone-locking via a simple tap. Its simplicity is its superpower."
    }
  },

  /* ───────────────────────── DAY 55 ───────────────────────── */
  {
    day: 55,
    category: "surprise",
    title: "Quote: James Clear on Identity",
    content: {
      type: "quote",
      text: "\"Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity.\" — James Clear",
      why: "You're 55 days into 75 Hard. Every workout, every page read, every gallon of water — those are all votes. You're not just completing a challenge, you're building proof that you're the kind of person who follows through.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 56 ───────────────────────── */
  {
    day: 56,
    category: "tip",
    title: "Brand Positioning: Own a Word",
    content: {
      text: "Volvo owns 'safety.' Apple owns 'design.' Tesla owns 'future.' The strongest brands own one word in the consumer's mind. You don't need a $10M marketing budget to own a word — you need consistency. Say the same thing, in the same way, over and over until people associate it with you.",
      takeaway: "What one word do you want people to think when they hear your brand name? Write it down. Now audit your last 10 social posts — does that word come through consistently?"
    }
  },

  /* ───────────────────────── DAY 57 ───────────────────────── */
  {
    day: 57,
    category: "fitness",
    title: "Outdoor Sprint Intervals",
    content: {
      challenge: "Find a flat stretch — sidewalk, park, track. Sprint for 20 seconds at max effort, then walk for 40 seconds. Repeat 10 times. Total time: 10 minutes. Don't hold back on the sprints.",
      tip: "Warm up with 5 minutes of light jogging before your first sprint. Cold sprinting is a hamstring injury waiting to happen.",
      sharePrompt: "Share your sprint location and how you felt after rep 10!"
    }
  },

  /* ───────────────────────── DAY 58 ───────────────────────── */
  {
    day: 58,
    category: "quiz",
    title: "ROAS Decoded",
    content: {
      question: "If you spend $1,000 on ads and generate $4,000 in revenue, what is your ROAS?",
      options: [
        "4x",
        "3x",
        "400%",
        "Both A and C"
      ],
      correctIndex: 3,
      explanation: "ROAS = Return on Ad Spend = Revenue / Ad Spend. $4,000 / $1,000 = 4x or 400%. Both are correct ways to express the same thing. A 4x ROAS is considered strong for most e-commerce businesses."
    }
  },

  /* ───────────────────────── DAY 59 ───────────────────────── */
  {
    day: 59,
    category: "tip",
    title: "Runway Math Every Founder Must Know",
    content: {
      text: "Runway = Cash in Bank / Monthly Burn Rate. If you have $120K and burn $15K/month, you have 8 months of runway. But here's what most founders miss: runway isn't a number — it's a deadline. Knowing your runway should change how you prioritize. With 8 months left, you don't have time to experiment with 5 strategies. Pick one, execute it in 3 months, and measure.",
      takeaway: "Calculate your personal or business runway right now. How many months can you sustain your current lifestyle or burn rate? Let that number sharpen your focus."
    }
  },

  /* ───────────────────────── DAY 60 ───────────────────────── */
  {
    day: 60,
    category: "fitness",
    title: "Phone-Free Fitness",
    content: {
      challenge: "Do today's entire workout without your phone in the room. No timer app — use a clock on the wall or count reps mentally. No music — just you and the work. Workout: 4 rounds of 15 push-ups, 20 squats, 10 burpees, 30-second plank.",
      tip: "This is a mental challenge as much as a physical one. Notice how your brain craves the phone. That discomfort is the point — building bloc taught me that our phone dependency is deeper than most of us admit.",
      sharePrompt: "How did it feel working out with zero digital distraction? Be honest!"
    }
  },

  /* ───────────────────────── DAY 61 ───────────────────────── */
  {
    day: 61,
    category: "quiz",
    title: "Startup Terminology Deep Cut",
    content: {
      question: "What is 'product-market fit'?",
      options: [
        "When your product is featured in a major publication",
        "When customers are buying, using, and recommending your product without being pushed",
        "When your product has zero bugs",
        "When you've raised your Series A funding"
      ],
      correctIndex: 1,
      explanation: "Marc Andreessen defined it best: 'Product-market fit means being in a good market with a product that can satisfy that market.' You know you have it when customers are pulling the product out of your hands."
    }
  },

  /* ───────────────────────── DAY 62 ───────────────────────── */
  {
    day: 62,
    category: "surprise",
    title: "Deep Focus Playlist",
    content: {
      type: "playlist",
      text: "A curated 90-minute deep focus playlist: ambient electronic, lo-fi beats, and instrumental film scores. No lyrics to distract your verbal processing. Think Hans Zimmer meets Tycho meets ChilledCow. Perfect for coding, writing, or reading sessions.",
      why: "Music with lyrics competes with your working memory for language processing. Instrumental music fills the silence without stealing your attention. Use this during your daily 75 Hard reading session.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 63 ───────────────────────── */
  {
    day: 63,
    category: "tip",
    title: "Feature Prioritization: Impact vs Effort",
    content: {
      text: "Draw a 2x2 grid. X-axis is effort (low to high). Y-axis is impact (low to high). Put every feature idea on the grid. Top-left quadrant (high impact, low effort) are your quick wins — do those first. Bottom-right (low impact, high effort) are time sinks — kill them. This simple exercise prevents the most common product mistake: building hard things nobody cares about.",
      takeaway: "Take your current feature backlog and map every item on a 2x2 impact/effort grid. Be ruthless about cutting anything in the bottom-right."
    }
  },

  /* ───────────────────────── DAY 64 ───────────────────────── */
  {
    day: 64,
    category: "fitness",
    title: "Lunge Marathon",
    content: {
      challenge: "Walking lunges for 200 steps total (100 each leg). Find a hallway, driveway, or sidewalk. Do them continuously or break into sets of 20. Keep your back knee just above the ground on each rep.",
      tip: "Take big steps and keep your front knee behind your toes. If your knees hurt, shorten your stride and focus on going straight down, not forward.",
      sharePrompt: "Did you do them all at once or in sets? Drop your breakdown!"
    }
  },

  /* ───────────────────────── DAY 65 ───────────────────────── */
  {
    day: 65,
    category: "quiz",
    title: "Compound Interest Magic",
    content: {
      question: "If you invest $10,000 at 10% annual return, roughly how long until it doubles (using the Rule of 72)?",
      options: [
        "5 years",
        "7.2 years",
        "10 years",
        "12 years"
      ],
      correctIndex: 1,
      explanation: "The Rule of 72: divide 72 by your interest rate to estimate doubling time. 72 / 10 = 7.2 years. This rule works for any growth rate and is one of the most useful mental math shortcuts in finance."
    }
  },

  /* ───────────────────────── DAY 66 ───────────────────────── */
  {
    day: 66,
    category: "surprise",
    title: "BTS: Building bloc — The Hard Part Nobody Sees",
    content: {
      type: "bts",
      text: "People see bloc as an app + NFC magnet. What they don't see: 4 months of Screen Time API edge cases that almost broke me, 3 different NFC chip suppliers before finding one that worked reliably through fridge magnets, and a launch week where the backend went down twice. Building a hardware + software product as a solo founder is the hardest thing I've ever done.",
      why: "Every polished product you admire has a messy, painful backstory. If your project feels chaotic right now, you're in good company. The mess is the process.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 67 ───────────────────────── */
  {
    day: 67,
    category: "tip",
    title: "Compound Interest Applies to Skills Too",
    content: {
      text: "Getting 1% better at writing every day means you're 37x better after a year. The same applies to coding, design, sales — any skill. The problem is that 1% daily improvement is invisible in the moment. You won't feel the progress day to day. But zoom out 90 days and the transformation is unmistakable. That's the magic of 75 Hard — it's a compound interest engine for discipline.",
      takeaway: "Pick one skill you want to 37x over the next year. Commit to 15 minutes of deliberate practice on it every single day, starting today."
    }
  },

  /* ───────────────────────── DAY 68 ───────────────────────── */
  {
    day: 68,
    category: "fitness",
    title: "Full-Body Pyramid",
    content: {
      challenge: "Pyramid workout — go up then back down. 2-4-6-8-10-8-6-4-2 reps of each: push-ups, squats, and sit-ups. Do all three exercises at each rep count before moving to the next. Total: 150 reps across all exercises.",
      tip: "The pyramid structure lets you warm up naturally and teaches pacing. The middle (10 reps) is the peak — give it everything you've got.",
      sharePrompt: "Share your total completion time for the full pyramid!"
    }
  },

  /* ───────────────────────── DAY 69 ───────────────────────── */
  {
    day: 69,
    category: "quiz",
    title: "Screen Time Reality Check",
    content: {
      question: "According to recent studies, what is the average daily screen time for adults on their smartphones?",
      options: [
        "2 hours",
        "4-5 hours",
        "6-7 hours",
        "8+ hours"
      ],
      correctIndex: 2,
      explanation: "The average adult spends 6-7 hours per day on screens, with about 4 hours on their phone alone. That's roughly 60 full days per year. Products like bloc exist because this number keeps climbing and most people want to reclaim some of that time."
    }
  },

  /* ───────────────────────── DAY 70 ───────────────────────── */
  {
    day: 70,
    category: "tip",
    title: "Revenue Models: Pick the Right Engine",
    content: {
      text: "Subscription gives you predictable recurring revenue but requires constant value delivery. One-time purchase is simpler but means you're always hunting for new customers. Transaction fees scale with your marketplace but require both supply and demand. Ad-supported needs massive scale. There's no best model — only the best model for your product and market.",
      takeaway: "If you're starting a business, write out which revenue model fits your product and why. Then find 3 successful companies using the same model and study how they structure pricing."
    }
  },

  /* ───────────────────────── DAY 71 ───────────────────────── */
  {
    day: 71,
    category: "quiz",
    title: "P&L Statement Literacy",
    content: {
      question: "On a Profit & Loss statement, what is 'gross margin'?",
      options: [
        "Total revenue minus all expenses including taxes",
        "Revenue minus cost of goods sold (COGS), before operating expenses",
        "Net profit divided by total revenue",
        "Operating expenses divided by revenue"
      ],
      correctIndex: 1,
      explanation: "Gross margin = Revenue - COGS. It shows how much you keep from each sale before paying for rent, salaries, and marketing. A high gross margin means your product is efficient to deliver."
    }
  },

  /* ───────────────────────── DAY 72 ───────────────────────── */
  {
    day: 72,
    category: "tip",
    title: "The Hardware + Software Playbook",
    content: {
      text: "Building a product that combines physical hardware with software is one of the hardest things in startups — but also one of the most defensible. The hardware creates a tangible touchpoint that pure software can't replicate, while the software delivers ongoing value. With bloc, the NFC fridge magnet is the physical anchor that makes the habit stick, and the app handles the Screen Time integration. Neither piece works without the other, and that combination is nearly impossible to copy.",
      takeaway: "If you're building software, ask: would a physical component make the experience stickier? If you're building hardware, ask: what software layer turns this into an ongoing relationship instead of a one-time purchase?"
    }
  },

  /* ───────────────────────── DAY 73 ───────────────────────── */
  {
    day: 73,
    category: "surprise",
    title: "Book: The Psychology of Money",
    content: {
      type: "book",
      text: "Morgan Housel shows that financial success isn't about how smart you are — it's about how you behave. The book is packed with stories showing that patience, humility, and a long time horizon beat genius-level stock picking every time.",
      why: "Whether you're managing startup finances or personal savings, this book changes your relationship with money. The chapter on compounding alone is worth the read. Pair it with the compound interest mental model from Day 67.",
      link: ""
    }
  },

  /* ───────────────────────── DAY 74 ───────────────────────── */
  {
    day: 74,
    category: "tip",
    title: "Personal Finance for Builders",
    content: {
      text: "The biggest financial edge for entrepreneurs isn't a trust fund — it's a low burn rate. If you can live on $2,000/month, you can take risks that someone spending $8,000/month never can. Save 6 months of living expenses before you go full-time on your startup. That safety net isn't just financial — it's psychological. You make better decisions when you're not desperate.",
      takeaway: "Calculate your true monthly living expenses. Then set up an automatic transfer to save toward 6 months of that number. Your future founder self will thank you."
    }
  },

  /* ───────────────────────── DAY 75 ───────────────────────── */
  {
    day: 75,
    category: "fitness",
    title: "The Final Test: Full Send",
    content: {
      challenge: "The last workout of 75 Hard. Give it everything: 75 push-ups, 75 squats, 75 sit-ups, 75 lunges (total), a 75-second plank, and a 75-second wall sit. Rest as needed — but finish every single rep.",
      tip: "This isn't about performance. It's about completion. Seventy-five days ago, this workout might have seemed impossible. Today, it's your victory lap. Savor every rep.",
      sharePrompt: "You did it. 75 days. Share your finish photo, your time, or just the words 'I finished.' You've earned it."
    }
  }

];
