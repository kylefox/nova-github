// https://github.com/atom/atom/blob/v1.53.0/src/git-repository-provider.js
// https://github.com/atom/atom/blob/v1.53.0/src/git-repository.js
// https://flight-manual.atom.io/api/v1.53.0/GitRepository/
// https://github.com/atom/open-on-github/blob/master/lib/github-file.js

const github = require('github')

nova.commands.register("github.viewFile", (editor) => {
  github.viewFile(editor.document.path) 
});

nova.commands.register("github.viewBlame", (editor) => {
  github.viewBlame(editor.document.path) 
});
