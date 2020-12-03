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
  
  view(document) {
    const path = document.path.replace(nova.workspace.path, '')
    const url = `${this.url}/blob/${this.branch}${path}`
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

module.exports = {
  load: (directory) => {
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
}

// // https://github.com/rewardful/rewardful/blame/master/app/models/campaign.rb
