import * as defs from '../../constants'

export default {
  compare_show: 'Comparer',
  compare_hide: 'Masquer',
  compareAll: 'Tout comparer',
  hideAll: 'Tout masquer',
  when: 'Quand',
  who: 'Qui',
  changes: 'Changements',
  revert: 'Restaurer',
  entity: 'Entité',
  moderation: 'Modération',
  deletedUser: 'Compte supprimé',
  madeAction: '{{action}}\u00A0:',
  action: {
    [defs.ACTION_CREATE]: 'Créé',
    [defs.ACTION_REMOVE]: 'Retiré',
    [defs.ACTION_UPDATE]: 'Mis à jour',
    [defs.ACTION_DELETE]: 'Supprimé',
    [defs.ACTION_ADD]: 'Ajouté',
    [defs.ACTION_RESTORE]: 'Restauré',
    [defs.ACTION_FLAG]: 'Signalé',
    [defs.ACTION_VOTE_UP]: 'Voté positivement',
    [defs.ACTION_VOTE_DOWN]: 'Voté négativement',
    [defs.ACTION_SELF_VOTE]: 'Voté pour lui-même',
    [defs.ACTION_REVERT_VOTE_UP]: 'Annulé son vote positif',
    [defs.ACTION_REVERT_VOTE_DOWN]: 'Annulé son vote négatif',
    [defs.ACTION_REVERT_SELF_VOTE]: 'Annulé son vote pour lui-même',
    [defs.ACTION_BANNED_BAD_LANGUAGE]: 'Modéré ($t(moderation:reason.1))',
    [defs.ACTION_BANNED_BAD_SPAM]: 'Modéré ($t(moderation:reason.2))',
    [defs.ACTION_BANNED_BAD_IRRELEVANT]: 'Modéré ($t(moderation:reason.3))',
    [defs.ACTION_BANNED_BAD_NOT_CONSTRUCTIVE]: 'Modéré ($t(moderation:reason.4))'
  },
  entities: {
    [defs.ENTITY_VIDEO]: 'vidéo',
    [defs.ENTITY_SPEAKER]: 'intervenant',
    [defs.ENTITY_STATEMENT]: 'citation',
    [defs.ENTITY_COMMENT]: 'commentaire',
    [defs.ENTITY_SOURCED_COMMENT]: 'commentaire sourcé',
    [defs.ENTITY_USER_ACTION]: 'action',
    [defs.ENTITY_USER]: 'utilisateur'
  }
}
