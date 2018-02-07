> Si vous croisez un troll, mettez lui un vote négatif et ne le nourissez pas.

Le système de signalement vous permet de signaler du contenu inaproprié. Vous êtes autorisé à effectuer
un petit nombre de signalements chaque jour et devez les utiliser judicieusement: en abuser peut vous faire
perdre beaucoup de réputation.


# Signalements

Pour tout le contenu qui ne rentrerait pas dans les catégories ci-dessous mais qui serait illégal dans
votre pays, merci de remplir une [demande de censure](/help/censorship_requests).


* Spam ou publicité
* Language grossier
* Attaque personelle ou harcelement
  
# Modération collective

Vos signalements sont analysés par des utilisateurs ayant une réputation importante qui décident
si les signalements sont justifiés ou abusifs.
La force de la sanction imposée dépend de la force du censensus des modérateurs.

## Modérateurs

Pour chaque action signalée, les modérateurs ont 3 choix :

* Confirmer le signalement
* Pas sûr
* Signalement abusif

## Règles

Il faut le vote d'au mois 3 modérateurs avant de pouvoir prendre une décision.
Un score est ensuite généré entre -1.0 et +1.0: 

```
score = (nb_confirm - nb_abuse) / total_feedbacks
```

* Si `score <= -0.66` => Signalement abusif
* Si `score >=  0.66` => Confirmer le signalement
* Sinon => Relancer et attendre plus de retours 

#### Exemples

* 2 confirment + 1 pas sûr = 2 * 1 + 0 = 2 => Confirmé
* 1 confirment + 2 pas sûr = 1 + 0 + 0 = 1 => Relancer et attendre d'autres retours
* 1 confirment + 2 abusif = 1 - 1 - 1 = -1 => Relancer et attendre d'autres retours
* 2 abusif + 1 pas sûr = 2 * (-1) + 0 = -2 => Signalement abusif

## Mise à jour de la réputation

Nous métons à jour la réputation en fonction de ce score. Pour être justes et ne pas pénaliser
les utilisateurs quand la décision est compliquée, on détermine la force du consensus des modérateurs
avec une formule qui nous donne une valeur entre 0.0 et 1.0 que nous utilisons pour pondérer les
gains et les pertes de réputation :

```
force_du_consensus = (score_absolu - min_val) * (1 / (1 - min_val))
```
