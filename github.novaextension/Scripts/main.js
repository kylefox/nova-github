// https://github.com/atom/atom/blob/v1.53.0/src/git-repository-provider.js
// https://github.com/atom/atom/blob/v1.53.0/src/git-repository.js
// https://flight-manual.atom.io/api/v1.53.0/GitRepository/
// https://github.com/atom/open-on-github/blob/master/lib/github-file.js

const github = require('github')

nova.commands.register("github.openFile", (editor) => {
  console.clear()
  github.load(nova.workspace.path).then((repository) => {
    repository.view(editor.document)
  })
});
