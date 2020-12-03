const run = (command, cwd) => {
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

const load = (directory) => {
  return new Promise((resolve, reject) => {
    run('remote get-url origin', directory).then((remote) => {        
      run('branch --show-current', directory).then((branch) => {
        resolve({
          branch: branch,
          remote: { url: remote, name: 'origin' }
        })
      });
    })
  })
}

 module.exports = { load }
