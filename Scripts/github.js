class Repository {
  constructor(directory) {
    this.directory = directory
  }
  
  load(path) {
    console.log('loading ', path)
    const promise = new Promise((resolve, reject) => {
      
    })
    
    return promise
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
//   repository.run('remote get-url origin').then((remoteURL) => {
//     repository.run('branch --show-current').then((branch) => {
//       const url = remoteGitHubURL(remoteURL);
//       const path = editor.document.path.replace(nova.workspace.path, '')
//       const fullURL = `${url}/blob/${branch}${path}`
//       nova.openURL(fullURL)
//     });
//   })

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

const repositoryForDirectory = (directory) => {
  const gitDirectory = nova.path.join(directory, '.git')

  if(nova.fs.stat(gitDirectory)) {
    return new Repository(gitDirectory)
  } else {
    return null
  }
}

const remoteGitHubURL = (remoteURL) => {
  return remoteURL.replace(/^git@github.com:/, 'https://github.com/').replace(/\.git/, '')
}

module.exports = {
  load: (directory) => {
    const repository = repositoryForDirectory(directory)
    
    if(repository) {
      repository.load()
    } else {
      console.warn(`No git repository in ${directory}`)
    }
  }
}

// // https://github.com/rewardful/rewardful/blame/master/app/models/campaign.rb
