const git = (command, cwd) => {
  const git = new Process("/usr/bin/env", {
    args: `git ${command}`.split(' '),
    cwd: cwd
  });
  
  const promise = new Promise((resolve, reject) => {
    git.onStdout((output) => {
      resolve(output.replace(/(?:\r\n|\r|\n)/g, '').trim())
    });
    git.onStderr(reject);
  })
  
  git.start()
  
  return promise;  
}

const remoteGitHubURL = (remoteURL) => {
  return remoteURL.replace(/^git@github.com:/, 'https://github.com/').replace(/\.git/, '')
}

class Repository {
  constructor(directory) {
    this.directory = directory
  }
  
  run(command) {
    return git(command, this.directory)
  }
  
  view(path) {
    path = path.replace(nova.workspace.path, '')
    const url = `${this.url}/blob/${this.branch}${path}`
    nova.openURL(url)
  }
  
  blame(path) {
    path = path.replace(nova.workspace.path, '')
    const url = `${this.url}/blame/${this.branch}${path}`
    nova.openURL(url)
  }
  
  load(path) {
    return new Promise((resolve, reject) => {
      this.run('remote get-url origin').then((remoteURL) => {        
        this.run('branch --show-current').then((branch) => {
          this.remote = { url: remoteURL, name: 'origin' }
          this.url = remoteGitHubURL(remoteURL)
          this.branch = branch
          resolve(this)
        });
      })
    })
  }
}

const repositoryForDirectory = (directory) => {
  const gitDirectory = nova.path.join(directory, '.git')

  if(nova.fs.stat(gitDirectory)) {
    return new Repository(gitDirectory)
  } else {
    return null
  }
}

const load = (directory) => {
  const repository = repositoryForDirectory(directory)
  
  return new Promise((resolve, reject) => {
    if(repository) {
      repository.load().then(() => {
        resolve(repository)
      })
    } else {
      console.warn(`No git repository in ${directory}`)
      reject(null)
    }
  })
}

const viewFile = (path) => {
  load(nova.workspace.path).then((repository) => {
    repository.view(path)
  })
}

const viewBlame = (path) => {
  load(nova.workspace.path).then((repository) => {
    repository.blame(path)
  })
}

module.exports = { viewFile, viewBlame }
