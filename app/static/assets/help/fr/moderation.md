# Signalements

Les utilisateurs confirmés peuvent signaler des contenus innapropriés :

* Attaque personelle ou langage inapproprié
* Spam ou publicité non souhaitée
  
Au bout de trois signalement, une alerte s'affiche sur le commentaire concerné
indiquant qu'il est en attente de modération.   

# Modération collective

Les signalements sont ensuite analysés par [des utilisateurs ayant une
réputation importante](/help/privileges) qui décident du résultat.

Pour chaque action signalée, les modérateurs ont 3 choix :

* Confirmer le signalement
* Pas sûr
* Signalement abusif

Il faut le vote d'au moins 3 modérateurs avant de pouvoir prendre une décision.
Un score est ensuite généré entre -1.0 et +1.0 : 

```
score = (nombre_de_confirmations - nombre_de_réfutations) / total
```

* Si `score >=  0.66` : Confirmer le signalement
* Si `score <= -0.66` : Signalement abusif
* Sinon relancer et attendre le retour d'autres modérateurs

Pour plus d'infomations sur les changements de réputation liés à la modération,
[cliquez ici](/help/reputation).