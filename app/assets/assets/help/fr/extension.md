# Installation

L'application est disponnible sur le
[Chrome Web Store](https://chrome.google.com/webstore/detail/captainfact-beta/fnnhlmbnlbgomamcolcpgncflofhjckm)
et pour [Firefox](https://addons.mozilla.org/en-US/firefox/addon/captainfact/)

# Code source

Le code source de l'extension est 100% open-source (GPL3/AGPL3), vous pouvez le retrouver ici:
* https://github.com/CaptainFact/captain-fact-extension

Elle utilise aussi un autre projet interne qui inject des informations sur des videos HTML en utilisant Javascript:
* https://github.com/CaptainFact/captain-fact-overlay-injector

# FAQ

## Pourquoi demander la permission "storage" ?

L'extension stocke un cache local des identifiants de vidéos qui existent sur CaptainFact. Ce cache est mis à jour
quand vous visitez Youtube s'il ne l'a pas été ces 15 dernières minutes. C'est une amélioration en terme
de vie privée qui garantit que nous ne traquons pas les vidéos que vous regardez et que nous n'envoyons pas de requêtes
inutiles.

## Pourquoi demander l'accès aux onglets ?

Le script s'injecte manuellement **uniquement** si la vidéo est référencée dans le cache local. Nous avons aussi
besoin de cette permission pour désactiver CaptainFact dans tous vos onglets lorsque vous le désactivez dans la popup
d'extension.

Vous pouvez vérifiez par vous-même dans le code source, dans `chrome/extension/background.js` (look for `chrome.tabs.`)

## Pourquoi demander la permission d'accès à Youtube ?

Pour être en mesure d'injecter les informations dans les vidéos que vous consultez sur https://www.youtube.com

## Pourquoi injecter uniquement sur youtube.com et pas dans tous les players intégrés sur d'autres sites ?

Il est possible que nous implémentions cette fonctionnalité dans le futur sur une version alternative de l'extension.
Nous ne souhaitons pas le faire sur la branche principale car celà nécessite de demander la permission d'accéder à
tous les sites que vous visitez.

## Puis-je contribuer et ajouter des sources directement depuis l'extension ?

Pas pour le moment.
