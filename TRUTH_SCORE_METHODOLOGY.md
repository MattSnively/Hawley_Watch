# Truth Score Methodology

## Overview

Each Josh Hawley tweet/post is scored on a 0-100% scale based on three weighted factors:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| Factual Accuracy | 40% | Is the claim true? Based on fact-checker ratings |
| Intent to Mislead | 40% | Is he deliberately trying to deceive? |
| Context & Cherry-Picking | 20% | Is he leaving out key information? |

**Final Score = (Factual × 0.4) + (Intent × 0.4) + (Context × 0.2)**

---

## Factor 1: Factual Accuracy (40%)

Based on established fact-checker ratings, converted to a 0-100 scale:

### Conversion Table

| Fact-Checker Rating | Score |
|---------------------|-------|
| **Pants on Fire** (PolitiFact) | 0% |
| **False** / 4 Pinocchios | 10% |
| **Mostly False** / 3 Pinocchios | 25% |
| **Half True** / Mixture / 2 Pinocchios | 50% |
| **Mostly True** / 1 Pinocchio | 75% |
| **True** / No Pinocchios | 100% |

### When No Fact-Check Exists

If no major fact-checker has rated the specific claim:
1. Search for fact-checks on the underlying claim/topic
2. Cross-reference with official data sources (BLS, CBO, etc.)
3. Assign score based on your research, noting "No formal fact-check available"

### Sources to Check
- [PolitiFact - Josh Hawley](https://www.politifact.com/personalities/josh-hawley/)
- [Washington Post Fact Checker](https://www.washingtonpost.com/politics/fact-checker/)
- [Snopes](https://www.snopes.com/)
- [FactCheck.org](https://www.factcheck.org/)

---

## Factor 2: Intent to Mislead (40%)

This is the key differentiator. A statement can be technically true but deliberately deceptive.

### Scoring Criteria

| Score | Intent Level | Description |
|-------|--------------|-------------|
| 0-10% | **Blatant Deception** | Knows it's false, says it anyway. Repeats debunked claims. |
| 20-35% | **Willful Ignorance** | Should know better given his position. No attempt to verify. |
| 40-55% | **Spin/Framing** | True-ish but framed to create false impression |
| 60-75% | **Partisan Interpretation** | Reasonable but one-sided take on facts |
| 80-90% | **Good Faith Disagreement** | Honest interpretation, even if you disagree |
| 95-100% | **Honest Statement** | No apparent intent to mislead |

### Red Flags for Low Intent Scores

- **Repeating debunked claims** - He's been corrected before but keeps saying it
- **Citing discredited sources** - Using data he knows is flawed
- **Strategic timing** - Dropping misleading info when it can't be easily countered
- **Dog whistles** - Technically deniable but clearly signaling something false
- **Motte-and-bailey** - Retreating to defensible claim when called out on extreme one

### Green Flags for Higher Intent Scores

- Acknowledges uncertainty or complexity
- Cites credible sources
- Represents opposing view fairly
- Corrects past errors

---

## Factor 3: Context & Cherry-Picking (20%)

Does he tell the whole story, or just the convenient parts?

### Scoring Criteria

| Score | Context Level | Description |
|-------|---------------|-------------|
| 0-20% | **Severe Cherry-Picking** | Completely ignores contradicting evidence or crucial context |
| 25-40% | **Significant Omission** | Leaves out important context that changes meaning |
| 45-60% | **Selective Emphasis** | Highlights favorable data, downplays unfavorable |
| 65-80% | **Minor Omissions** | Mostly complete picture with small gaps |
| 85-100% | **Full Context** | Acknowledges complexity, includes relevant caveats |

### Questions to Ask

1. **What did he leave out?**
   - Contradicting data points?
   - His own past statements or votes?
   - Relevant donor connections?

2. **What timeframe did he cherry-pick?**
   - Did he choose a specific date range to make numbers look better/worse?

3. **Who did he fail to mention?**
   - His own role in the problem?
   - Contributors who might benefit from his position?

4. **What comparison is he avoiding?**
   - How does this compare to his own party's record?
   - To historical norms?

---

## Calculating the Final Score

### Example Calculation

**Hawley Tweet:** "Biden's economy has been a disaster for working families!"

| Factor | Analysis | Score |
|--------|----------|-------|
| **Factual Accuracy** | Mixed - some metrics up, some down. Fact-checkers rate similar claims as "Half True" | 50% |
| **Intent to Mislead** | Uses "disaster" knowing economy has mixed signals. Ignores positive data. Willful framing. | 30% |
| **Context** | Cherry-picks negative indicators. Ignores job growth, wage gains. Doesn't mention his votes against relief bills. | 25% |

**Calculation:**
- Factual: 50 × 0.4 = 20
- Intent: 30 × 0.4 = 12
- Context: 25 × 0.2 = 5
- **Final Score: 37% - MISLEADING**

---

## Score-to-Label Conversion

| Score Range | Label | Color |
|-------------|-------|-------|
| 0-15% | **FALSE** | Red |
| 16-35% | **MISLEADING** | Orange |
| 36-55% | **MIXED** | Yellow |
| 56-75% | **MOSTLY TRUE** | Light Green |
| 76-100% | **TRUE** | Green |

---

## Visual Representation

```
FALSE      MISLEADING     MIXED      MOSTLY TRUE     TRUE
  |___________|___________|___________|___________|
  0%         20%         40%         60%        100%

  ████░░░░░░░░░░░░░░░░ 20% - MISLEADING

Breakdown:
  Factual Accuracy:    ██████████░░░░░░░░░░ 50%
  Intent to Mislead:   ██████░░░░░░░░░░░░░░ 30%
  Context:             █████░░░░░░░░░░░░░░░ 25%
```

---

## Transparency & Sourcing

Every scored post MUST include:

1. **Links to fact-checks used** (or note if none exist)
2. **Brief explanation of each factor score**
3. **Sources for context claims** (voting records, donor data, etc.)

### Example Post Footer

```
TRUTH SCORE: 37% - MISLEADING

How we scored this:
• Factual Accuracy (50%): PolitiFact rated similar claims "Half True"
• Intent to Mislead (30%): Repeats framing despite knowing mixed data
• Context (25%): Omits job growth data, his votes against relief

Sources: PolitiFact, BLS Employment Data, Congress.gov voting record
```

---

## Edge Cases

### Opinion vs. Fact
If Hawley is stating an opinion (not a factual claim):
- Factual Accuracy: N/A (or 50% neutral)
- Weight Intent and Context more heavily
- Note: "This is an opinion, not a factual claim"

### Predictions
For claims about the future:
- Score based on whether prediction is reasonable given available data
- Note: "This is a prediction and cannot be fully fact-checked"

### Old Claims Resurface
If he reposts an old claim that's since been debunked:
- Intent score should be LOW (he knows better now)
- Note when original claim was made and when it was debunked

---

## Methodology Updates

This methodology may be refined over time. Any changes will be:
1. Documented with date and reason
2. Applied consistently going forward
3. Not retroactively applied to old posts (unless noted)
