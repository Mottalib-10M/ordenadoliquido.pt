/**
 * Formes des exemples chiffres des pages de situation fiscale.
 *
 * Ces types vivaient dans le frontmatter de ComoSeCalcula.astro, mais esbuild
 * refuse un type union declare la (« Unexpected "|" »). Ils sont donc ici, ou
 * les deux consommateurs, le composant et les donnees, peuvent les lire.
 *
 * Le principe : une donnee ne contient QUE l'hypothese, jamais un montant.
 * Les valeurs affichees sont calculees par le moteur du site.
 */

export type EstadoCivil = 'solteiro' | 'casado1titular' | 'casado2titulares';

/** Une hypothese de calcul, telle qu'on la saisirait dans le simulateur. */
export interface Caso {
  bruto: number;
  estadoCivil: EstadoCivil;
  dependentes: number;
  irsJovem: number;
}

/** Ce qu'une ligne affiche. `diferenca` et `soma` portent sur le net mensuel. */
export type Linha =
  | { rotulo: string; nota?: string; caso: string; campo: 'bruto' | 'tsu' | 'retencao' | 'liquido' | 'taxaEfetiva' }
  | { rotulo: string; nota?: string; diferenca: [string, string] }
  | { rotulo: string; nota?: string; soma: string[] };

export interface Exemplo {
  titulo: string;
  casos: Record<string, Caso>;
  linhas: Linha[];
  /** Texte editorial ; les valeurs s'y ecrivent {champ:cle} ou {champ:a-b}. */
  comentario: string;
}
