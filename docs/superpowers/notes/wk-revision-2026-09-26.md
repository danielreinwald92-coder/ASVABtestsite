# Word Knowledge revision (2026-09-26)

**Why.** The first empirical calibration (see `docs/scoring-methodology.md`, "Empirical
calibration") measured WK discrimination at about 35% of the official pool's. Review found the
cause: distractors were antonyms or off-tone words, so the key could be picked by connotation
(positive vs negative, increase vs decrease) without knowing the word, and 77% of keys sat at
option B in the raw data.

**What changed.** 136 of WK001-WK155 were rewritten in place (same id, same target word,
same meaning of the key): distractors are now same part of speech, same register and tone,
typically sound-alike or same-topic traps, never antonyms; difficulty tags re-rated; explanations
rewritten to name the new most tempting distractor; stored option order shuffled. 12 items
(WK001, WK002, WK036, WK038, WK040, WK041, WK047-WK050, WK052, WK054) already met the bar and
WK156-WK167 were written to it. Every rewritten key was confirmed by two independent blind
solvers (0 mismatches); six items flagged for loose wording were tightened before shipping.

**Calibration impact.** Responses to these ids recorded before 2026-09-27 answer the OLD
versions. When re-fitting WK (`scripts/calibration/fit-discrimination.js`), filter WK rows to
`taken_at >= '2026-09-27'`. `A_SCALE.WK` stays at the pre-revision 0.35 until then; a too-low
scale is the safe direction (likely ranges slightly wide, no loss of accuracy).

Rewritten ids: WK003 WK004 WK005 WK006 WK007 WK008 WK009 WK010 WK011 WK012 WK013 WK014 WK015 WK016 WK017 WK018 WK019 WK020 WK021 WK022 WK023 WK024 WK025 WK026 WK027 WK028 WK029 WK030 WK031 WK032 WK033 WK034 WK035 WK037 WK039 WK042 WK043 WK044 WK045 WK046 WK051 WK053 WK055 WK056 WK057 WK058 WK059 WK060 WK061 WK062 WK063 WK064 WK065 WK066 WK067 WK068 WK069 WK070 WK071 WK072 WK073 WK075 WK076 WK077 WK078 WK079 WK080 WK081 WK082 WK084 WK085 WK086 WK087 WK088 WK089 WK090 WK091 WK092 WK093 WK095 WK097 WK098 WK099 WK100 WK101 WK102 WK104 WK105 WK106 WK107 WK108 WK109 WK111 WK112 WK113 WK114 WK115 WK116 WK118 WK119 WK120 WK121 WK122 WK123 WK124 WK125 WK126 WK127 WK128 WK129 WK130 WK131 WK132 WK133 WK134 WK135 WK136 WK137 WK138 WK139 WK140 WK141 WK142 WK143 WK144 WK145 WK146 WK147 WK148 WK149 WK150 WK151 WK152 WK153 WK154 WK155
