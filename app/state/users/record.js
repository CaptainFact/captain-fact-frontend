import { Record } from 'immutable'


const User = new Record({
  id: 0,
  email: '',
  fb_user_id: null,
  username: '',
  name: '',
  locale: '',
  reputation: 0,
  picture_url: null,
  mini_picture_url: null,
  registered_at: null,
  achievements: [],
  is_publisher: false,
  speaker_id: null,
  // fake data for POC
  // entities shall indicate videoId, quoteId and commentId
  // So we can filter uniq occurencies
  // but for the sake of POC and because I don't have time for fixtures
  // we put numbers
  entities: {
    quotes: 850,
    comments: 45,
    positiveVotesReceived: 25,
    positiveVotesGiven: 75,
    negativeVotesGiven: 4,
    negativeVotesReceived: 4,
    flags: 8,
  },
  city: {
    name: 'Trjvednaja',
    temperature: '19.5°C',
    population: 9.854
  },
  tutorial: {
    story: `J’ai injustement été enfermé en prison par un groupe nommé “Les Judicieux”. Ils ont réussi à prendre le contrôle total de l’archipel en répandant de fausses informations et ont fait disparaître le soleil de l’archipel pour renforcer leur emprise sur la population. En  continuant de hacker le système de ma cellule, je devrais pouvoir m’évader et rejoindre ma ville et la mission CaptainFact, qui agit pour rétablir la lumière sur Chant’Aube.`,
    objectives: [
      {
        name: 'Vérifier mon adresse e-mail',
        skipped: false,
        progression: 100,
      },
      {
        name: 'Ajouter une citation sur la vidéo de test',
        skipped: true,
        progression: 0,
      },
      {
        name: 'Ajouter un commentaire sur la vidéo de test',
        skipped: true,
        progression: 0,
      },
      {
        name: 'Signaler une citation sur la vidéo de test',
        skipped: true,
        progression: 0,
      },
      {
        name: 'Voter un commentaire sur la vidéo de test',
        skipped: true,
        progression: 0,
      },
    ]
  },
  objectives: [
    {
      zone: 'sun',
      name: 'Faire revenir le soleil',
      story: 'Mauris non orci molestie, pharetra nibh eget, mollis sem. Nulla vitae nunc et libero aliquet auctor quis nec enim. Nam in justo ipsum. ' ,
      tasks: [
        {
          name: 'Ajouter au moins 70 citations',
          entity: 'quotes',
          goal: 70,
        },
        {
          name: 'Recevoir 20 votes positifs',
          entity: 'positiveVotesReceived',
          goal: 20,
        },
        {
          name: 'Avoir au moins 175 de réputation',
          entity: 'reputation',
          goal: 175,
        },
        {
          name: 'Commenter plus de 5 vidéos différentes',
          entity: 'comments',
          goal: 5
        }
      ]
    },
    {
      zone: 'port',
      name: 'Libérer le port',
      story: 'Mauris non orci molestie, pharetra nibh eget, mollis sem. Nulla vitae nunc et libero aliquet auctor quis nec enim. Nam in justo ipsum. ' ,
      tasks: [
        {
          name: 'Ajouter au moins 25 citations',
          entity: 'quotes',
          goal: 25
        },
        {
          name: 'Recevoir 20 votes positifs',
          entity: 'positiveVotesReceived',
          goal: 20
        },
        {
          name: 'Avoir au moins 175 de réputation',
          entity: 'reputation',
          goal: 175,
        },
        {
          name: 'Commenter plus de 2 vidéos différentes',
          entity: 'comments',
          goal: 2
        }
      ]
    },
    {
      zone: 'west',
      name: 'Libérer les quartiers ouest',
      story: 'Mauris non orci molestie, pharetra nibh eget, mollis sem. Nulla vitae nunc et libero aliquet auctor quis nec enim. Nam in justo ipsum. ' ,
      tasks: [
        {
          name: 'Ajouter au moins 5 citations',
          entity: 'quotes',
          goal: 5
        },
        {
          name: 'Recevoir 15 votes positifs',
          entity: 'positiveVotesReceived',
          goal: 15
        },
        {
          name: 'Avoir au moins 75 de réputation',
          entity: 'reputation',
          goal: 75,
        },
      ]
    },
  ]

})

export default User
