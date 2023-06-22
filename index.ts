import { execSync } from "child_process"
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { copySync, writeFileSync } from "fs-extra"
import { join } from 'path'

interface IyamlConfig {
    pages: {
        repo: string
        path: string
    }[]
}

interface IfirebaseConfig {
    hosting: {
        rewrites: {source: string, destination: string}[]
    }
}

const ymlFile = readFileSync('./pages.yml', {encoding: "utf-8"})
const {pages} = load(ymlFile) as IyamlConfig
for(const [pageName, {repo, path}] of Object.entries(pages)) {
    execSync(`git clone ${repo}`, {stdio: 'inherit'})
    const foldername = repo.match(/\/(.*)\.git/)?.[1]
    if(!foldername) throw `failed to match foldername in ${pageName}`
    console.log(join(__dirname, foldername))
    execSync(`npm install`, {stdio: 'inherit', cwd: join(__dirname, foldername)})
    execSync(`npm run build`, {stdio: 'inherit', cwd: join(__dirname, foldername)})

    copySync(`./${foldername}/dist`, `./build/${path}`)
}

const firebaseConfig: IfirebaseConfig = require('./firebase.json')

for(const page of Object.values(pages)){
    firebaseConfig.hosting.rewrites.push({
        source: `/${page.path}/**`,
        destination: `/${page.path}/index.html`
    })
}
writeFileSync('./firebase.json', JSON.stringify(firebaseConfig))
