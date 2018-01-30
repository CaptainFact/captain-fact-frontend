> If you encounter a troll, vote it down and don't feed it.

The flagging system allows you to report inappropriate content. You're allowed a small number of
flags each day and should use them carefully; Using flags inappropriately can make you loose a lot 
of [reputation](/help/reputation).


# Flags

For all content not falling into below categories that may be
illegal in your country, please use the [censorship request procedure](/help/censorship_requests).


* Spam or commercial content
* Rude language  
* Personal attack or harassment
  
# Collective moderation

Your flags are then reviewed by users with a high reputation that will decide
if the flags are justified or abusive.
The strength of the sanction depends of the moderators consensus strength.

## Moderators feedback

For each reported action, moderators have 3 choices:

* Confirm flag
* Not sure
* Abusive flag

## Rules

We need at least 3 moderators to vote before taking a decision.
Then we generate a score between -1.0 and +1.0:

```
score = (nb_confirm - nb_abuse) / total_feedbacks
```


* If `score <= -0.66` => Abusive flag 
* If `score >=  0.66` => Confirm flag 
* Else => Wait to have more feedbacks 

#### Examples

* 2 confirm + 1 not sure = 2 * 1 + 0 = 2 => Confirm
* 1 confirm + 2 not sure = 1 + 0 + 0 = 1 => Re-ask with more moderators
* 1 confirm + 2 abusive = 1 - 1 - 1 = -1 => Re-ask with more moderators
* 2 abusive + 1 not sure = 2 * (-1) + 0 = -2 => Abusive flag

## Reputation updates

We update reputations depending on this score. But to be fair and not penalize
users when decisions are complicated, we first determine the strength of the moderators consensus
with a formula that gives us a value between 0.0 and 1.0 that we use to ponderate reputation
gain or loss: 

```
consensus_strength = (abs_score - min_val) * (1 / (1 - min_val))
```
