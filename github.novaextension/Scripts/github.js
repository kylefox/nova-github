const git = require('git')

class Repository {
  constructor(repository) {
    this.branch = repository.branch
    this.remote = repository.remote
    this.url = this.remote.url
      .replace(/^git@github.com:/, 'https://github.com/')
      .replace(/\.git/, '')
  }
  
  viewURL(path) {
    return `${this.url}/blob/${this.branch}${path}`
  }
  
  blameURL(path) {
    return `${this.url}/blame/${this.branch}${path}`
  }
}

const repositoryForDirectory = (directory) => {
  const gitDirectory = nova.path.join(directory, '.git')

  if(nova.fs.stat(gitDirectory)) {
    return directory
  } else {
    return null
  }
}

const load = (directory) => {
  const repositoryDirectory = repositoryForDirectory(directory)
  
  return new Promise((resolve, reject) => {
    if(repositoryDirectory) {
      git.load(repositoryDirectory).then((data) => {
        resolve(new Repository(data))
      })
    } else {
      console.warn(`No git repository in ${directory}`)
      reject(null)
    }
  })
}

const viewFile = (path) => {
  load(nova.workspace.path).then((repository) => {
    nova.openURL(repository.viewURL(path.replace(nova.workspace.path, '')))
  })
}

const viewBlame = (path) => {
  load(nova.workspace.path).then((repository) => {
    nova.openURL(repository.blameURL(path.replace(nova.workspace.path, '')))
  })
}

module.exports = { viewFile, viewBlame }
