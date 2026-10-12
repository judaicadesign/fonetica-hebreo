# Sheva rules: 12 October 2026

Source: user-supplied Dikduk Eliyahu, HebrewBooks 20568, printed pages כו–כז (PDF 35–36), author text distinguished from Leshon Chayim commentary. User ArtScroll observations: זְרוֹעַ (initial vocal sheva); Psalm 130:6 שֹׁמְרִים / מִשֹּׁמְרִים; marked vocal kaf in זָכְרוּ; marked vocal mem in וַיֹּאמְרוּ. No confirmation of a primary/secondary meteg in זָֽכְרוּ.

Implemented: initial sheva without modern זר suppression; medial doubled-letter and dagesh classification; lexical long-vowel cases with stress checks; pointed Qal CָCְCוּ family; definite active Pi'el participles after article/preposition; consonantal Yah component, with structural sounds and editorial component case. Lamnatséaj and haleluYah whole-word output overrides retired. Two minimal syllable data cases remain for the Aramaic loan אושפיזין and foreign name סיסרא; the verified preposition עם possessive reading remains protected. These are not generalized from surface vowels alone.

Rule 8: a hataf is pronounced; it does not imply changing every hataf to e. Preserve a/e/o vowel quality. The prior audit suggestion to globally change non-guttural hataf was rejected by the דֳּמִי counterexample.

Source annotations are kept separately from normalized lookup keys. An unqualified meteg is NOT treated as proof of mobile sheva or principal stress: primary ArtScroll accent and secondary Masoretic accent must be distinguished. Rule 6 and the full five conditions behind rule 7 remain pending source/morphology verification. Partial two-accent handling does not claim complete implementation of those conditions.

Existing reviewed passage outputs conflicting with broader rules have heldSilentSheva + reviewRequired annotations, scoped to exact pointed source passages. These holds preserve the pre-existing approved/source readings pending new editorial verification; they are NOT claims that the general rule is false. No master source files or delivered documents changed. Source holds:
[
  {
    "ref": "83:3",
    "holds": {
      "אוֹיְבֶיךָ": [
        2
      ],
      "נָשְׂאוּ": [
        1
      ]
    }
  },
  {
    "ref": "83:5",
    "holds": {
      "אָמְרוּ": [
        1
      ]
    }
  },
  {
    "ref": "83:10",
    "holds": {
      "כְּסִיסְרָא": [
        3
      ]
    }
  },
  {
    "ref": "83:13",
    "holds": {
      "אָמְרוּ": [
        1
      ]
    }
  },
  {
    "ref": "83:19",
    "holds": {
      "וְיֵדְעוּ": [
        2
      ]
    }
  },
  {
    "ref": "121:3",
    "holds": {
      "שֹׁמְרֶךָ": [
        1
      ]
    }
  },
  {
    "ref": "121:5",
    "holds": {
      "שֹׁמְרֶךָ": [
        1
      ],
      "צִלְּךָ": [
        1
      ]
    }
  },
  {
    "ref": "142:7",
    "holds": {
      "מֵרֹדְפַי": [
        2
      ],
      "אָמְצוּ": [
        1
      ]
    }
  },
  {
    "ref": "23:5",
    "holds": {
      "צֹרְרָי": [
        1
      ]
    }
  },
  {
    "ref": "126:1",
    "holds": {
      "כְּחֹלְמִים": [
        2
      ]
    }
  },
  {
    "ref": "137:7",
    "holds": {
      "הָאֹמְרִים": [
        2
      ]
    }
  }
]

Nakdan: keepmetagim remains true; user vowels remain verbatim. Marks-only tokens may now be vocalized, with existing meteg/rafe restored by consonant index. Alternate-option selection uses the same preservation function; changed consonantal spelling with marks fails closed.

Future display contract: phonetics and optional meteg/rafe rendering consume one internal analysis. Display switches must never change pronunciation. This change does not add automatic display controls or guess unverified meteg positions.

Additional source conflicts found by the complete regression suite, preserved as explicit pending-review annotations (not rule certification):
[
  {
    "ref": "2:2",
    "holds": {
      "וְרוֹזְנִים": [
        3
      ]
    }
  },
  {
    "ref": "3:7",
    "holds": {
      "מֵרִבְבוֹת": [
        2
      ]
    }
  },
  {
    "ref": "3:8",
    "holds": {
      "אֹיְבַי": [
        1
      ]
    }
  },
  {
    "ref": "7:2",
    "holds": {
      "רֹדְפַי": [
        1
      ]
    }
  },
  {
    "ref": "7:5",
    "holds": {
      "שׁוֹלְמִי": [
        2
      ]
    }
  },
  {
    "ref": "7:14",
    "holds": {
      "לְדֹלְקִים": [
        2
      ]
    }
  },
  {
    "ref": "9:4",
    "holds": {
      "אוֹיְבַי": [
        2
      ]
    }
  },
  {
    "ref": "9:14",
    "holds": {
      "מִשֹּׂנְאָי": [
        2
      ]
    }
  },
  {
    "ref": "9:16",
    "holds": {
      "טָבְעוּ": [
        1
      ]
    }
  },
  {
    "ref": "10:8",
    "holds": {
      "לְחֵלְכָה": [
        2
      ]
    }
  },
  {
    "ref": "10:16",
    "holds": {
      "אָבְדוּ": [
        1
      ]
    }
  },
  {
    "ref": "12:2",
    "holds": {
      "מִבְּנֵי": [
        1
      ]
    }
  },
  {
    "ref": "14:4",
    "holds": {
      "אֹכְלֵי": [
        1
      ]
    }
  },
  {
    "ref": "17:9",
    "holds": {
      "אֹיְבַי": [
        1
      ]
    }
  },
  {
    "ref": "18:16",
    "holds": {
      "מוֹסְדוֹת": [
        2
      ]
    }
  },
  {
    "ref": "18:39",
    "holds": {
      "יִפְּלוּ": [
        1
      ]
    }
  },
  {
    "ref": "18:49",
    "holds": {
      "מֵאֹיְבָי": [
        2
      ]
    }
  }
]
The UI warns when one of these retained source readings is used. Unscoped rule tests now expect tidefenu, merivevot and gomelenu; initial zeroa also extends structurally to zero'otai. None of these test updates certifies an unchecked master passage.

## Follow-up visual audit
The earlier lists are historical, not active counts. Visually confirmed vocal helper marks resolved 20 contexts; the Sisra hold was redundant and was removed. Current unresolved count: 7 contexts (83:3, 83:5, 83:13, 83:19, 121:3, 121:5, 142:7). Exact provenance, before/after readings and source hashes: SHEVA_COTEJO_20261012.json. Resolved refs: 23:5, 83:10, 3:7, 3:8, 7:2, 7:5, 7:14, 9:4, 9:14, 9:16, 10:8, 10:16, 12:2, 14:4, 17:9, 18:16, 18:39, 18:49, 126:1, 137:7, 2:2. No new whole-word pronunciation overrides.
