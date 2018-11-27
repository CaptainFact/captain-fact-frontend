export default {
  title: 'Erreur',
  server: {
    unknown: 'Quelque chose a mal fonctionné de notre côté, on regarde ça !',
    invalid_email: 'Adresse e-mail invalide',
    invalid_token: 'Le code de vérification est invalide ou a expiré',
    invalid_invitation_token: "Votre code d'invitation est invalide ou a expiré",
    reset_failed: 'La réinitialisation a échoué',
    authentication_failed: "L'authentification a échoué",
    invalid_email_password: 'Adresse e-mail ou mot de passe invalide',
    not_enough_reputation: "Vous n'avez pas assez de réputation pour faire ça",
    limit_reached: 'Vous avez atteint votre limite quotidienne pour cette action',
    not_found:
      'Cet élement semble ne pas exister, essayez de rafraichir la page si le problème persiste',
    action_already_done: 'Cette action a déjà été effectuée',
    unauthenticated: 'Vous devez vous connecter pour effectuer cette action',
    unauthorized: 'Merci de vous (re)connecter pour continuer',
    noInternet: 'La connexion au serveur a échoué, essayez de rafraichir la page'
  },
  client: {
    joinCrashed: 'La cconnexion au serveur a échoué',
    thirdParty: "L'authentification a échoué",
    submissionError: "Un problème est survenu lors de l'envoi des données",
    noVideoAvailable: "Aucune vidéo n'est disponible",
    notEnoughReputation: 'Pas assez de réputation pour accéder à cette fonctionnalité',
    needReputation:
      "Vous avez besoin d'au moins {{requiredRep}} points de <2>réputation</2> pour faire ça"
  }
}
