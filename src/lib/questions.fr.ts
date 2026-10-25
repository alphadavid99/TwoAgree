// French translation overlay for the question bank.
//
// The canonical English bank lives in questions.ts (mirrored from the .xlsx per
// CLAUDE.md §9) and is NOT edited here. This file maps deck slugs → French names
// and question ids → French text/options/scale-labels. Anything missing falls
// back to English, so the app never breaks on a gap.
//
// Option order MUST match the English exactly — answers are stored by index.
// Tone rule (CLAUDE.md §1): stay honest and direct on contentious topics — do
// not soften. Translations mirror the plain, unhedged English.
import { withNames, type Names } from "./who";
import { DECKS, type Question } from "./questions";
import type { Lang } from "./i18n";

export const DECK_NAMES_FR: Record<string, string> = {
  "in-the-home": "À la maison",
  "finances-money": "Finances & argent",
  "faith-worship-practice": "Foi & pratique du culte",
  "roles-responsibilities": "Rôles & responsabilités",
  "theology-beliefs": "Théologie & croyances",
  "dreams-future": "Rêves & avenir",
  "family-children": "Famille & enfants",
  "parenting-style": "Style d’éducation",
  "intimacy-physical": "Intimité & physique",
  "conflict-communication": "Conflit & communication",
  "in-laws-extended-family": "Belle-famille & proches",
  "fun-icebreakers": "Détente & brise-glace",
  "deal-breakers": "Points rédhibitoires",
  "health-lifestyle": "Santé & mode de vie",
  "past-baggage": "Passé & bagages",
  "career-ambition": "Carrière & ambition",
  "character-self-awareness": "Caractère & connaissance de soi",
  "us-compatibility": "Nous & compatibilité",
  "values-convictions": "Valeurs & convictions",
  "faithfulness-loyalty": "Fidélité & loyauté",
  "where-we-are-now": "Où nous en sommes",
};

/** Per-question French fields. Only the user-facing text is translated. */
export type QFr = { q: string; opts?: string[]; lo?: string; hi?: string };

export const Q_FR: Record<string, QFr> = {
  // --- In the Home ---
  "HOME-006": { q: "À quel point as-tu besoin que notre foyer soit rangé ?", lo: "Détendu face au désordre", hi: "Chaque chose à sa place" },
  "HOME-007": { q: "À quel point est-ce important pour toi d’être propriétaire plutôt que locataire ?", lo: "Louer me convient", hi: "Être propriétaire compte beaucoup" },
  "HOME-008": { q: "Qui devrait s’occuper des réparations et de l’entretien de la maison ?", opts: ["Surtout {A}", "Surtout {B}", "Nous deux", "On ferait appel à un pro"] },
  "HOME-009": { q: "À quel point est-ce important d’avoir un espace à toi seul à la maison ?", lo: "Tout partager me convient", hi: "J’ai besoin de mon propre espace" },

  // --- Finances & Money ---
  "FIN-004": { q: "À quel point es-tu discipliné avec un budget mensuel ?", lo: "Peu rigoureux côté budget", hi: "Je suis chaque centime" },
  "FIN-011": { q: "Quand tu es stressé, à quelle fréquence dépenses-tu ou fais-tu les magasins pour te sentir mieux ?", lo: "Jamais", hi: "Très souvent" },

  // --- Faith & Worship practice ---
  "FAITH-001": { q: "À quel point prier ensemble en couple est-il essentiel pour toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-003": { q: "À quel point es-tu engagé dans le don régulier ou la dîme ?", lo: "Pas une priorité", hi: "Un engagement ferme" },
  "FAITH-004": { q: "À quelle fréquence voudrais-tu qu’on prie ensemble ?", opts: ["Chaque jour", "Quelques fois par semaine", "De temps en temps", "Je préfère prier en privé"] },
  "FAITH-007": { q: "À quel point veux-tu t’investir dans la communauté de l’Église et les petits groupes ?", lo: "Rarement impliqué", hi: "Très impliqué" },
  "FAITH-015": { q: "À quel point une vie de prière personnelle est-elle importante pour toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-016": { q: "À quel point est-ce important que ton partenaire ait sa propre vie de prière, en dehors de toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-017": { q: "Devrions-nous prier ensemble avant les grandes décisions ?", lo: "Rarement", hi: "Toujours" },
  "FAITH-018": { q: "À quel point est-ce important que la relation de ton partenaire avec Dieu passe avant sa relation avec toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-020": { q: "Quel rythme de lecture personnelle de la Bible espères-tu tenir ?", opts: ["Chaque jour", "La plupart des jours", "Chaque semaine", "De temps en temps"] },
  "FAITH-021": { q: "À quel point est-ce important d’étudier régulièrement la Bible ensemble en couple ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-022": { q: "Notre relation devrait activement nous rapprocher tous les deux de Dieu, et pas seulement laisser notre foi intacte.", lo: "Pas du tout d’accord", hi: "Tout à fait d’accord" },
  "FAITH-024": { q: "À quel point est-ce important pour toi que ton partenaire soit né de nouveau, avec une conversion personnelle ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-025": { q: "À quel point es-tu sûr de ton propre salut ?", lo: "Je me questionne encore", hi: "Pleinement assuré" },
  "FAITH-026": { q: "Si on vient d’Églises différentes, comment décider où aller ensemble ?", opts: ["On va à la mienne", "On va à la tienne", "On en trouve une nouvelle ensemble", "Ça nous va d’y aller séparément"] },
  "FAITH-028": { q: "Dans quelle mesure l’Écriture façonne-t-elle tes décisions quotidiennes ?", lo: "Rarement un facteur", hi: "Elle guide mes décisions" },
  "FAITH-030": { q: "Quand tu pèches, quel est ton réflexe ?", opts: ["Confesser et chercher à rendre des comptes", "Le dire à Dieu en privé et passer à autre chose", "Essayer d’y remédier par moi-même", "J’ai tendance à le cacher"] },
  "FAITH-031": { q: "À quel point est-ce important pour toi qu’on serve activement dans une Église, pas seulement qu’on y assiste ?", lo: "Y assister suffit", hi: "Servir compte vraiment" },
  "FAITH-033": { q: "À quel point es-tu ouvert à être encadré et repris par des croyants mûrs ?", lo: "Je préfère me débrouiller seul", hi: "Je l’accueille volontiers" },

  // --- Roles & Responsibilities ---

  // --- Theology & Beliefs ---

  // --- Dreams & Future ---
  "DREAM-001": { q: "À quel point ton sens du but de ta vie est-il clair ?", lo: "Je cherche encore", hi: "Très clair" },
  "DREAM-003": { q: "À quoi ressemble la retraite pour toi ?", opts: ["Repos et simplicité", "Voyages et aventure", "Continuer à travailler ou servir", "Pas d’image claire encore"] },
  "DREAM-004": { q: "À quel point veux-tu que notre mariage ressemble à celui de tes parents ?", lo: "Très différent de celui de mes parents", hi: "Très semblable à celui de mes parents" },

  // --- Family & Children ---
  "FAM-001": { q: "Combien d’enfants espérerais-tu ?", opts: ["Aucun", "1 à 2", "3 à 4", "5 et plus", "Ouvert / pas sûr"] },
  "FAM-004": { q: "À quel point est-ce important qu’on s’accorde sur les enfants et l’éducation ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },

  // --- Parenting style ---

  // --- Intimacy & Physical ---
  "INT-001": { q: "À quel point l’intimité physique est-elle importante pour toi dans le mariage ?", lo: "Une faible priorité", hi: "Très importante" },
  "INT-008": { q: "À quel point est-ce important pour toi que ton partenaire ait réservé, ou réserve, la sexualité au mariage ?", lo: "Pas important", hi: "Essentiel" },
  "INT-012": { q: "À quel point l’affection et la complicité au quotidien sont-elles importantes pour toi ?", lo: "Pas un grand besoin", hi: "Très importantes" },

  // --- Conflict & Communication ---
  "CONF-002": { q: "À quelle vitesse aimes-tu résoudre un conflit ?", lo: "J’ai d’abord besoin d’espace", hi: "Le régler tout de suite" },
  "LOYAL-005": { q: "À quel point nos téléphones devraient-ils être ouverts l’un à l’autre ?", lo: "Les téléphones restent privés", hi: "Accès total l’un à l’autre" },
  "CONF-012": { q: "Quand tu dois soulever un problème, comment préfères-tu le faire ?", opts: ["Le régler tout de suite", "Attendre le bon moment", "L’écrire ou l’envoyer par message", "L’éviter jusqu’à ce que ça déborde"] },
  "CONF-016": { q: "Quelle dose de conflit te paraît normale et saine dans une relation ?", lo: "Presque aucune", hi: "Fréquent, c’est normal" },
  "CONF-021": { q: "Quand on te coupe la parole, comment réagis-tu d’habitude ?", opts: ["Je laisse passer", "J’attends, puis je reprends", "Je m’agace intérieurement", "Je réplique par-dessus"] },

  // --- In-Laws & Extended Family ---
  "INLAW-006": { q: "Dans quelle mesure tes parents influencent-ils tes décisions ?", lo: "Je décide en toute indépendance", hi: "Je m’appuie beaucoup sur eux" },

  // --- Fun & Icebreakers ---

  // --- Deal-breakers ---
  "DEAL-004": { q: "Pourrais-tu épouser quelqu’un qui ne partage pas ta foi ?", opts: ["Non, jamais", "Seulement s’il y était ouvert", "Oui, si on se respectait", "La foi n’est pas essentielle pour moi"] },
  "DEAL-006": { q: "À quel point une addiction grave serait-elle rédhibitoire pour toi ?", lo: "Je pourrais le surmonter", hi: "Absolument rédhibitoire" },
  "DEAL-007": { q: "Pourrais-tu épouser quelqu’un qui ne veut jamais d’enfants, alors que toi si ?", opts: ["Non, c’est rédhibitoire", "Il faudrait trouver un compromis", "Je pourrais y renoncer", "Je suis flexible sur les enfants"] },
  "DEAL-008": { q: "Un casier judiciaire serait-il rédhibitoire pour toi ?", opts: ["Oui, quel qu’il soit", "Ça dépend de quoi il s’agit", "Seulement les crimes violents", "Non, les gens peuvent changer"] },

  // --- Health & Lifestyle ---
  "HEALTH-009": { q: "Es-tu couche-tard ou lève-tôt ?", lo: "Lève-tôt", hi: "Couche-tard" },

  // --- Past & Baggage ---

  // --- Career & Ambition ---
  "CAREER-001": { q: "À quel point l’ambition professionnelle est-elle centrale pour toi ?", lo: "Un emploi, c’est juste pour vivre", hi: "La carrière est centrale pour moi" },
  "CAREER-003": { q: "À quel point es-tu prêt à déménager pour une opportunité d’emploi ?", lo: "Je veux poser mes racines", hi: "Tout à fait prêt à bouger" },
  "CAREER-004": { q: "Si nos carrières entraient en conflit, laquelle devrait primer ?", opts: ["Celle du mari", "Celle de la femme", "Celle qui rapporte le plus", "Celle qui passionne le plus", "On déciderait au cas par cas"] },
  "CAREER-005": { q: "Combien d’heures par semaine, c’est trop pour le travail ?", opts: ["Moins de 40", "40 à 50", "50 à 60", "Ce que le travail exige"] },
  "CAREER-006": { q: "À quel point est-ce important que ton travail ait du sens, plutôt que juste bien payer ?", lo: "Bien payer suffit", hi: "Il doit avoir du sens" },
  "CAREER-007": { q: "Accepterais-tu une baisse de salaire pour un meilleur cadre de vie ou plus de temps ensemble ?", lo: "Je tiendrais à conserver le revenu", hi: "Volontiers, pour une vie meilleure" },
  "CAREER-008": { q: "Que penses-tu du fait que l’un de nous prenne un gros risque professionnel, comme lancer une entreprise ?", lo: "Je préfère la stabilité", hi: "Je suis pour les risques audacieux" },
  "CAREER-009": { q: "Quand le travail et le temps en famille entrent en conflit, lequel devrait l’emporter d’habitude ?", lo: "La famille l’emporte presque toujours", hi: "Le travail doit parfois primer" },
  "CAREER-010": { q: "À quel âge aimerais-tu pouvoir prendre ta retraite ou ralentir ?", opts: ["Vers 50-55 ans ou avant", "Autour de 60 ans", "Vers 65 ans", "Je travaillerais aussi longtemps que possible"] },

  // --- Character & Self-Awareness ---
  "SELF-001": { q: "À quel point t’ouvres-tu facilement à quelqu’un ?", lo: "Sur mes gardes", hi: "Très ouvert" },
  "SELF-004": { q: "À quel point exprimes-tu facilement tes émotions ?", lo: "Elles restent enfermées en moi", hi: "Je les exprime facilement" },
  "SELF-006": { q: "À quel point as-tu besoin de sentir que tu contrôles ?", lo: "Décontracté, je me laisse porter", hi: "J’ai besoin de contrôler" },
  "SELF-008": { q: "Classe ce qui donne le plus de sens à ta vie.", opts: ["La foi", "La famille", "Le travail", "Les amis", "La croissance personnelle", "Servir les autres"] },
  "SELF-012": { q: "À quel point pardonnes-tu facilement ?", lo: "Je garde ça longtemps", hi: "Je pardonne vite" },
  "SELF-013": { q: "De combien de temps seul as-tu besoin pour te retrouver ?", lo: "Je me ressource entouré", hi: "J’ai besoin de beaucoup de solitude" },
  "SELF-018": { q: "À quel point prends-tu l’initiative plutôt que d’attendre qu’on te guide ?", lo: "J’ai tendance à attendre et à suivre", hi: "Je prends les devants et j’initie" },
  "SELF-020": { q: "À quel point travailles-tu activement sur ta croissance et ton caractère en ce moment ?", lo: "Je n’y suis pas concentré", hi: "Je travaille activement sur moi" },
  "SELF-021": { q: "À quel point es-tu à l’aise d’avoir à rendre des comptes sur tes faiblesses ?", lo: "Je préfère les gérer en privé", hi: "Je veux qu’on me tienne pour responsable" },
  "SELF-022": { q: "À quel point gères-tu bien ton temps et tes responsabilités ?", lo: "Souvent désorganisé", hi: "Très organisé et au point" },
  "SELF-023": { q: "Pour une grande décision, sur quoi t’appuies-tu le plus ?", opts: ["La prière", "L’Écriture", "Un conseil avisé", "Mon propre jugement", "La recherche et la logique"] },
  "SELF-024": { q: "Dans quelle mesure tes amis influencent-ils tes choix et ta direction ?", lo: "Très peu", hi: "Énormément" },
  "SELF-025": { q: "Comment gères-tu les ragots dans les conversations du quotidien ?", opts: ["Je m’en éloigne", "J’écoute mais je ne les répands pas", "Je m’y joins parfois", "J’aime bien un bon ragot"] },
  "SELF-026": { q: "Agis-tu de la même façon avec tout le monde, ou différemment selon qui regarde ?", lo: "Je suis le même avec tout le monde", hi: "Je m’adapte beaucoup selon les gens" },

  // --- Us & Compatibility ---
  "US-002": { q: "Qu’est-ce qui te dit que ce qu’on a est vraiment de l’amour et pas juste des sentiments forts ?" },
  "US-006": { q: "Classe ce qui fait durer un mariage, le plus important en premier.", opts: ["La communication", "L’engagement", "Une foi partagée", "La confiance", "L’amitié", "L’intimité", "Des objectifs communs"] },
  "US-008": { q: "Qu’est-ce qui, chez moi, te rend fier ?" },
  "US-010": { q: "Quel mariage admires-tu, et que font-ils que tu voudrais pour nous ?" },
  "US-011": { q: "Qu’est-ce qui, chez moi, te fait hésiter ou t’inquiète en ce moment ?" },
  "US-016": { q: "Qu’as-tu toujours voulu me demander sans jamais l’avoir fait ?" },
  "US-029": { q: "Que penses-tu du rythme auquel avance notre relation ?", lo: "Trop lent pour moi", hi: "Trop rapide pour moi (3 = parfait)" },
  "US-030": { q: "À quel point est-ce important pour toi que je m’entende avec tes amis les plus proches ?", lo: "Pas important", hi: "Essentiel" },
  "US-034": { q: "Cette période devrait-elle être plutôt pour s’amuser ou pour évaluer sérieusement notre avenir ?", lo: "Surtout en profiter", hi: "L’évaluer sérieusement" },
  "US-035": { q: "À quel point est-ce important que ton conjoint soit aussi ton meilleur ami ?", lo: "La romance compte plus pour moi", hi: "Meilleurs amis avant tout" },
  "US-038": { q: "Dans quelle mesure les partenaires devraient-ils se pousser à grandir, plutôt que de s’accepter tels qu’ils sont ?", lo: "S’accepter tels qu’on est", hi: "Se pousser activement à grandir" },
  "US-040": { q: "Avec quelle facilité renoncerais-tu à un loisir ou un engagement s’il nuisait à notre relation ?", lo: "Je serais réticent", hi: "Volontiers" },

  // --- Values & Convictions ---
};

/** Deck name in the active language (English fallback). */
export function deckName(slug: string, lang: Lang): string {
  const en = DECKS[slug]?.name ?? slug;
  return lang === "fr" ? DECK_NAMES_FR[slug] ?? en : en;
}

/** A question with its user-facing text swapped to the active language, and
 *  — given the two names — "which of you" options filled in (lib/who.ts). */
export function localizeQuestion(q: Question, lang: Lang, names?: Names): Question {
  const f = lang === "fr" ? Q_FR[q.id] : undefined;
  const out = f
    ? { ...q, q: f.q, opts: f.opts ?? q.opts, lo: f.lo ?? q.lo, hi: f.hi ?? q.hi }
    : q;
  return names ? withNames(out, names) : out;
}
