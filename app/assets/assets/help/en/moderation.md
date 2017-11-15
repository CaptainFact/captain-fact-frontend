The flagging system allows you to report inappropriate content. You're allowed a small number of
flags each day and should use them carefully; Using flags inappropriately can make you loose a lot 
of [reputation](/help/reputation).


# Flags

For all content not falling into below categories that may be
illegal in your country, please use the [censorship request procedure](/help/censorship_requests).


* Spam or commercial content
    
  Anything that has nothing to do with the subject, that tries to sell something or link to
  undesirable content


* Rude language

  This includes the use of sexualized language. Confronting opinions can sometimes be emotionally
  powerful, but try to stay polite.

  
* Personal attack or harassment

  You should always attack the ideas, not the people. Anything like "Are you stupid ?" or mothers
  jokes will not be tolerated. We don't attack moms, never.

  If a troll upsets you vote it down and don't feed it.

  
# Collective moderation

Your flags are then reviewed by users with a high reputation that will decide if the flags are justified or abusive.
Depending on how strong their consensus is, you will gain or loose more or less reputation.

## Moderators feedback

For each reported comments, moderators have 3 choices:

* Confirm flag
* Not sure
* Abusive flag

## Rules

We need at least 3 moderators to vote before taking a decision. Then we generate a score:

```
score = (nb_confirm - nb_abuse) / total_feedbacks
```
<br/>
Which generates a score between -1.0 and +1.0.

* If `score <= -0.66` => Abusive flag 
* If `score >=  0.66` => Confirm flag 
* Else => Wait to have more feedbacks 

<details>
<summary>Examples</summary>
  <ul>
    <li>2 confirm + 1 not sure = 2 * 1 + 0 = 2 => Confirm</li>
    <li>1 confirm + 2 not sure = 1 + 0 + 0 = 1 => Re-ask with more moderators</li>
    <li>1 confirm + 2 abusive = 1 - 1 - 1 = -1 => Re-ask with more moderators</li>
    <li>2 abusive + 1 not sure = 2 * (-1) + 0 = -2 => Abusive flag</li>
  </ul>
</details>

## Reputation updates

We update reputations depending on this score. But to be fair and not penalize users when decisions are complicated,
we first determine the strength of the moderators consensus with: 

```
consensur_strength = (abs_score - min_val) * (1 / (1 - min_val))
```
<br/>
Which gives us a value between 0.0 and 1.0 that we use to ponderate reputatin gain or loss.