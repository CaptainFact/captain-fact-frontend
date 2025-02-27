# Flags

Confirmed users can flag innapropriate contents:

* Personal attack or inappropriate language
* Unwanted commercial content or spam

After three flags, a warning is displayed on concerned comment indicating that
there is a pending moderation on it.

# Collective moderation

Your flags are then reviewed by [users with a high reputation](/help/privileges) 
that will decide if the flags are justified.

For each reported action, moderators have 3 choices:

* Confirm flag
* Not sure
* Abusive flag

We need at least 3 moderators to vote before taking a decision.
Then we generate a score between -1.0 and +1.0:

```
score = (nb_confirm - nb_abuse) / total_feedbacks
```


* If `score <= -0.66`: Abusive flag 
* If `score >=  0.66`: Confirm flag 
* Else wait to have more feedbacks 

#### Examples

* 2 confirm + 1 not sure = 2 * 1 + 0 = 2: Confirm
* 1 confirm + 2 not sure = 1 + 0 + 0 = 1: Re-ask with more moderators
* 1 confirm + 2 abusive = 1 - 1 - 1 = -1: Re-ask with more moderators
* 2 abusive + 1 not sure = 2 * (-1) + 0 = -2: Abusive flag

## Reputation updates

For information about reputation changes linked to moderation,  
[check this](/help/reputation).

# Rules for video content moderation

To better promote verified videos, videos with zero source after 30 days since posting become unlisted. This action is performed by the technical team and can be requested by a user.
_NB: Unlisted videos do not appear on the fact checking page or the browser extension. However, it is still possible to contribute with the link. They can be re-listed with a justified request from a user._
