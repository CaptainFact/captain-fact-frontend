# How to contribute

## Prerequisites

Familiarity with [forks](https://help.github.com/articles/fork-a-repo/),
[pull requests](https://help.github.com/articles/using-pull-requests) and
[issues](https://guides.github.com/features/issues/).


## Contributions types

- **Ideas**: Participate in an issue thread or start your own to have your voice heard
- **Resources**: Submit a pull request to add to RESOURCES.md with links to related content
- **Translations**: You can create and edit translations for the interface in `app/assets/assets/[locale]/[file].json`.
                    To translate help pages, get a look at `app/assets/assets/help/[locale]/[page].md`
- **Documentation**: Fix typos, clarify language, and add explanations about how things work
- **Code**: Submit new features or bug fixes, see "Code contributions" below

## Contributions: General workflow

1. [Pick or create an issue](https://github.com/CaptainFact/captain-fact-frontend/issues) and tell us you're working on it
2. Fork the repo
3. Checkout `staging` branch (pull requests against `master` will not be accepted)
4. Create a new branch describing what you'll do. We encourage using `feature/your-awesome-feature` or `fix/your-fix-name` naming
5. Do your stuff and commit your changes
6. (Optional but nice) [squash your commits](https://forum.freecodecamp.org/t/how-to-squash-multiple-commits-into-one-with-git/13231)
7. Make a pull request of your branch against `staging` and mention the issue you're dealing with

## Code contributions

### Developing

#### Starting the API

Starting the API is mandatory if you want to work on the debate platform, but you can skip this step
if you're just planning to translate some part of the interface or to work on help pages.

The quickest way to get the API running locally is by using its Docker image. This image
is currently stored on a private registry, and though we're planning to release it soon you can
contact us if you want to start working on this today.

Let's download and install the stuff (you must have docker installed):
```bash
# Create database container
docker create --name postgres_dev -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=captain_fact_dev -d postgres:9.6
# Login to Gitlab registry (if not already done) and pull image
docker login registry.gitlab.com
docker pull registry.gitlab.com/captainfact/captain-fact-api:staging
```

Start the API:
```bash
# Start DB
docker start postgres_dev
# Start container from captain-fact-frontend root to ensure it includes dev ssh keys
docker run -it \
  -p 4000:80 \
  -p 4001:443 \
  --link postgres_dev:postgres_dev \
  -e "CF_HOST=localhost" \
  -e "CF_SECRET_KEY_BASE=CDe6dUDYXvs7vErdbvH/8hSlHrXgSIFgsR55pJk2xs2/1XoFMjwMn8Hw1ei+k9Gm" \
  -e "CF_DB_HOSTNAME=postgres_dev" \
  -e "CF_DB_USERNAME=postgres" \
  -e "CF_DB_PASSWORD=postgres" \
  -e "CF_DB_NAME=captain_fact_dev" \
  -e "CF_FACEBOOK_APP_ID=xxxxxxxxxxxxxxxxxxxx" \
  -e "CF_FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -e "CF_FRONTEND_URL=http://localhost:3333" \
  -e "CF_CHROME_EXTENSION_ID=chrome-extension://lpdmcoikcclagelhlmibniibjilfifac" \
  -v "$(pwd)/rel/dev_localhost_keys:/run/secrets:ro" \
  --rm registry.gitlab.com/captainfact/captain-fact-api:staging console
```

If you want to update the API on the future, just run `docker pull registry.gitlab.com/captainfact/captain-fact-api:staging`

The process running the API is an interactive Elixir console. Here are some useful commands you may type in:
```elixir
# Get current API version
iex> :application.get_key :captain_fact, :vsn
# {:ok, '0.6.1'}

# This image ships with a factory to quickly create users, without worriying about invitations and emails
iex> CaptainFact.Factory.insert :user
# %CaptainFact.Accounts.User{
#  ...
#  email: "tamara1970@gutmann.biz", <- Use this email to connect. Password is "password"
#  ....}
# You can also set some property directly, like:
iex> CaptainFact.Factory.insert :user, %{reputation: 5000, email: "jougier@captainfact.io"}

# Remove all videos
iex> CaptainFact.Repo.delete_all CaptainFact.Videos.Video
```

#### Starting the frontend

Starting the frontend is much easier, just run `npm start` and you'll be able to access the site at
[localhost:3333](http://localhost:3333). A default account should have been created for you with
email=`admin@captainfact.io` and password=`password`.

### Code style

*TODO: code style and conventions*

# Communication

GitHub issues are the primary way for communicating about specific proposed
changes to this project.

[TODO] We'll soon create a place for the community to chat, maybe on Slack or on Keybase.io's
[encrypted slack alternative](https://techcrunch.com/2017/09/18/keybase-launches-fully-encrypted-slack-like-communications-tool-and-its-free/).

In both contexts, please follow the conduct guidelines below. Language issues
are often contentious and we'd like to keep discussion brief, civil and focused
on what we're actually doing, not wandering off into too much imaginary stuff.

# Conduct

We are committed to providing a friendly, safe and welcoming environment for
all, regardless of gender, sexual orientation, disability, ethnicity, religion,
or similar personal characteristic.

On IRC, please avoid using overtly sexual nicknames or other nicknames that
might detract from a friendly, safe and welcoming environment for all.

Please be kind and courteous. There's no need to be mean or rude.
Respect that people have differences of opinion and that every design or
implementation choice carries a trade-off and numerous costs. There is seldom
a right answer, merely an optimal answer given a set of values and
circumstances.

Please keep unstructured critique to a minimum. If you have solid ideas you
want to experiment with, make a fork and see how it works.

We will exclude you from interaction if you insult, demean or harass anyone.
That is not welcome behaviour. We interpret the term "harassment" as
including the definition in the
[Citizen Code of Conduct](http://citizencodeofconduct.org/);
if you have any lack of clarity about what might be included in that concept,
please read their definition. In particular, we don't tolerate behavior that
excludes people in socially marginalized groups.

Private harassment is also unacceptable. No matter who you are, if you feel
you have been or are being harassed or made uncomfortable by a community
member, please contact one of the channel ops or any of the
[CaptainFact](https://github.com/CaptainFact) core team
immediately. Whether you're a regular contributor or a newcomer, we care about
making this community a safe place for you and we've got your back.

Likewise any spamming, trolling, flaming, baiting or other attention-stealing
behaviour is not welcome.

# Frequently Asked Questions

*TODO*
