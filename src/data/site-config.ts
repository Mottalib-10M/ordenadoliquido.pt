
export const CONTACT_EMAIL = 'contacto@ordenadoliquido.pt';

/*
 * Identite legale de l'editeur (RECETTE-SITE.md, controle check-legal).
 * Un champ laisse vide ressort en jaune sur la page legale et fait echouer le
 * controle : rien ne part en ligne avec une mention manquante.
 */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',
  legalForm: '',                 // vide : publication a titre personnel, pas de societe
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: 'França',          // pays de l'editeur, pas du site
  phone: '',
  registerLabel: 'SIREN',
  registerNumber: '',
  vatLabel: 'Número de IVA',
  vatNumber: '',                 // vide : non assujetti
  jurisdiction: 'Portugal',
  supervisoryAuthority: 'Comissão Nacional de Proteção de Dados (CNPD), Av. D. Carlos I, 134 - 1.º, 1200-651 Lisboa, Portugal',
  supervisoryAuthorityUrl: 'https://www.cnpd.pt/',
  hosting: {
    name: 'GitHub, Inc.',
    address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States',
    phone: '',
    url: 'https://github.com',
  },
};
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];
