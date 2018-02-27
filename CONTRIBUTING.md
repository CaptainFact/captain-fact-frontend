# How to contribute

## Prerequisites

Familiarity with [forks](https://help.github.com/articles/fork-a-repo/),
[pull requests](https://help.github.com/articles/using-pull-requests) and
[issues](https://guides.github.com/features/issues/).

## Communication

[![Join the chat at https://gitter.im/CaptainFact](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CaptainFact)

GitHub issues are the primary way for communicating about specific proposed changes to this project.

We also use [Trello](https://trello.com/b/5s6F5iTv/captainfact) to keep track of the tasks we're working on. Feel free to
comment on these tasks directly.

## Contributions types

- **Ideas**: Participate in an issue thread or start your own to have your voice heard
- **Resources**: Submit a pull request to add to RESOURCES.md with links to related content
- **Translations**: You can create and edit translations for the interface in `app/i18n/[locale]/[file].js`.
                    To translate help pages, get a look at `app/assets/assets/help/[locale]/[page].md`
- **Documentation**: Fix typos, clarify language, and add explanations about how things work
- **Code**: Submit new features or bug fixes, see "Code contributions" below

## Contributions: General workflow

1. [Pick or create an issue](https://github.com/CaptainFact/captain-fact-frontend/issues) and tell us you're working on it
2. Fork the repo
3. Checkout `staging` branch (pull requests against `master` will not be accepted)
4. Create a new branch describing what you'll do. We encourage using `feature/your-awesome-feature`, `fix/your-fix-name`
   or `improvement/your-improvement` naming
5. Do your stuff and commit your changes
6. (Optional but nice) [squash your commits](https://forum.freecodecamp.org/t/how-to-squash-multiple-commits-into-one-with-git/13231)
7. Make a pull request of your branch against `staging` and mention the issue you're dealing with

## Code contributions

### Developing

#### Starting the API

The quickest way to get the API running locally is by using Docker. This image
is currently stored on a private registry, and though we're planning to release it soon you can
contact us if you want to start working on this today and we'll invite you. 

If you don't have it, install Docker:

```bash
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh
```

A script will then help you getting this API up and running:
Just execute `./rel/run_dev_docker_api.sh` from project's root, follow the instructions and you'll end up with 
an Elixir console bind to the API and listening on port 4000(HTTP) + 4001(HTTPS).

Here are some useful commands you may type in:
```elixir
# Get current API version (also available in browser at localhost:4000)
iex> CaptainFact.Application.version
"0.7.7"
# This image ships with a factory to quickly create users, without worriying about invitations and emails
iex> DB.Factory.insert :user
# %CaptainFact.Accounts.User{
#  ...
#  email: "tamara1970@gutmann.biz", <- Use this email to connect. Password is "password"
#  ....}
# You can also set properties directly, like:
iex> DB.Factory.insert :user, %{reputation: 5000, email: "jougier@captainfact.io"}

# If you need a full video with sources, speakers comments and all the goods, you can run the
# following command. It may take some time to run (30s-1min) cause it must fetch the speakers
# pictures from wikimedia.
iex> List.first(c(Path.join(:code.priv_dir(:captain_fact), "demos/demo_fr.ex"))).init_and_run

# Remove all videos
iex> CaptainFact.Repo.delete_all CaptainFact.Videos.Video
```

#### Starting the frontend

To start the frontend just run `npm install` to install dependencies then `npm start` and you'll
be able to access the site at [localhost:3333](http://localhost:3333).
A default account should have been created for you with email=`admin@captainfact.io` and password=`password`.
