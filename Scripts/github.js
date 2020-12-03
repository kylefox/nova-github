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
  
  load(path) {
    return new Promise((resolve, reject) => {
      this.run('remote get-url origin').then((remoteURL) => {
        console.log('got remoteURL: ', remoteURL)
        resolve(remoteURL)
        this.remote = { url: remoteURL }
        this.url = 'neat' //remoteGitHubURL(remoteURL)
      //   
      //   this.run('branch --show-current').then((branch) => {
      //     this.branch = branch
      //     console.log('Repository#load')
      //     console.log(remoteURL)
      //     console.log(resolve)
      //     resolve(repository)
      //     
      //     // const url = remoteGitHubURL(remoteURL);
      //     // const path = editor.document.path.replace(nova.workspace.path, '')
      //     // const fullURL = `${url}/blob/${branch}${path}`
      //     // nova.openURL(fullURL)
      //   });
      })
    })
  }
}

//   console.clear()
// 
//   const repository = repositoryForDirectory(nova.workspace.path)
//   
//   if(!repository) {
//     console.warn("No git repository found.")
//     return
//   }
//   
  // repository.run('remote get-url origin').then((remoteURL) => {
  //   repository.run('branch --show-current').then((branch) => {
  //     const url = remoteGitHubURL(remoteURL);
  //     const path = editor.document.path.replace(nova.workspace.path, '')
  //     const fullURL = `${url}/blob/${branch}${path}`
  //     nova.openURL(fullURL)
  //   });
  // })

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
        repository.load().then((bacon) => {
          console.log('github.load')
          console.log(bacon)
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
