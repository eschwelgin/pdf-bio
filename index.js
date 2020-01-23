const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('html-pdf');

const questions = [
  {
    type: 'input',
    name: 'name',
    message: "Enter your Github username",
    answer: ""
  },
  {
    type: 'input',
    name: 'color',
    message: "Enter your favorite color"
  }
]

function createPDF(uDataUser) {
  const html = fs.readFileSync('./prof.html', 'utf8');
  const options = { format: 'Letter' };
  pdf.create(html, options).toFile(`./${uDataUser}.pdf`, function(err, res) {
    if (err) return console.log(err);
    // console.log(res)
    console.log(`PDF ${uDataUser} Written to Disk`); // { filename: '/app/businesscard.pdf' }
  });
}

function buildProf(answers, github, uDataStar) {
  const uDataUser = answers.name
  const uDataColor = answers.color
  const uDataImg = github.data.avatar_url
  const uDataBlog = github.data.blog
  const uDataBio = github.data.bio
  const uDataRepo = github.data.public_repos
  const uDataFollower = github.data.followers
  const uDataFollowing = github.data.following
  const uDataLocation = github.data.location
  const HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
      <style>
        body { text-align:center; }
        div { background-color:${uDataColor};
              display: inline-block;
              margin: 10px;
              padding: 10px;
              border: 2px solid black;
              border-radius: 7px; }
      </style>
    </head>
      <body>
        <div><img src="${uDataImg}" height="250" width="250">
          <h2>${uDataUser}</h2></div><br/>
        <div><h3>${uDataBio}</h3>
        <h3>GitHub - http://github.com/${uDataUser}/
          <h3>Blog - ${uDataBlog}<h3></div><br/>
        <div><h3>${uDataRepo} Repos
          | ${uDataFollower} Followers
          | ${uDataStar} Stars
          | ${uDataFollowing} Following</h3></div><br/>
        <div><img src="http://maps.googleapis.com/maps/api/staticmap?center=${uDataLocation}&amp;zoom=12&amp;size=800x250&amp;key=AIzaSyCmj71F1XA3hoYnJsTjY2uWeUmNnPlvaVU">
        <h3>${uDataLocation}</h3></div>
      </body>
    </html>
    `
  // console.log(answers, uDataImg)
  fs.writeFile("prof.html", HTML, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("HTML Written to Disk");
    createPDF(uDataUser)
  });
}

function starCall(answers, github) {
    let name = answers.name
    let uDataStar1
    axios.get(`https://api.github.com/users/${name}/starred`
    )
    .then(function (response) {
      let uDataStar0 = response.data.map(x => x.id);
      uDataStar1 = uDataStar0.length
      // uDataStar = response.length
      // console.log(uDataStar1 + " has a value")
      buildProf(answers, github, uDataStar1)
    })
    .catch(function (error) {
      console.log(error);
    })
  }

function gitCall(answers) {
  let name = answers.name
  axios.get(`https://api.github.com/users/${name}`
  )
  .then(function (response) {
    github = response
    starCall(answers, github)
  })
  .catch(function (error) {
    console.log(error);
  })
}

inquirer.prompt(questions)
  .then(answers => {
    // console.log(JSON.stringify(answers, null, '  '))
    gitCall(answers)
  })
  .catch(function(err) {
    console.log(err);
});