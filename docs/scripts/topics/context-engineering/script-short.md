# Video Script Template (Short - 90s)

**Topic:** Context Engineering in 2026
**Target Audience:** AI Software Developers
**Goal:** Explain why agents fail and how to use Smart Truncation in under 90 seconds.

---

## 0:00 - 0:15 | Hook & The Problem
- **Visual:** A rapidly growing text box representing an AI context window until it shatters like glass.
- **Script:**
  > "Why do your AI agents suddenly lose their minds on turn 10? The answer from top production teams in 2026 is clear: Agents don't fail because of prompts; they fail because of context rot."

## 0:15 - 0:45 | The "Meat" (Technical Explanation)
- **Visual:** Split screen. Left: "Naive Truncation" (chopping text) with a big red X. Right: "LLM Summarization" (a robot making a messy summary) with a big red X.
- **Script:**
  > "You've probably tried naive truncation or asking the LLM to summarize past chats. Both fail at scale. You lose too much critical reasoning data, and the agent treats follow-up questions as entirely new conversations."

## 0:45 - 1:15 | The Solution / Context-Snoopiest Implementation
- **Visual:** Diagram of the "Head/Tail Pattern". Top block (Rules) is locked. Bottom block (Current Prompt) is locked. Middle block slides out into a vector database.
- **Script:**
  > "The winning architecture is Context Engineering using Smart Truncation. In Continuum Flow, we keep the 'Head'—your core rules—and the 'Tail'—your immediate chunk. We chop out the middle and store it in a vector database. The agent can retrieve it if needed, keeping the active window ultra-fast and lightweight."

## 1:15 - 1:30 | Key Takeaway & CTA
- **Visual:** A dashboard showing a successful "11th-Turn Evaluation".
- **Script:**
  > "Stop feeding your AI the whole haystack. Separate the rules from the history. Test your agent on the 11th turn. Check out Continuum Flow to see the code."

---

## Technical Terms for Subtitles
- **[Context Rot]:** The decay of detail retrieval and logical consistency as context grows.
- **[Smart Truncation]:** Keeping the Head (Rules) and Tail (Prompt) while vectorizing the middle.
- **[11th-Turn Evaluation]:** A strict testing methodology to pinpoint when an AI session degrades.
