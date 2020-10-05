var Generator = require('yeoman-generator');
var _ = require('lodash');
var fs = require('fs');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async prompting() {

        const config = await this.config.getAll();

        let queries = [
            {
                type: "input",
                persistent: true,
                name: "isLibrary",
                message: "Is Library? (false for APP)",
                default: false // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "appname",
                message: "Library name?",
                default: (this.appname || "").replace(/ /g, "-") // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "gitBaseUrl",
                message: "Git Base Url?",
                default: 'git.unidata.it' // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "gitWorkspaceName",
                message: "Git WorkSpace Name? (Your Usernane)",
                default: 'my-username' // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "gitProjectName",
                message: "Git Project Name?",
                default: (this.appname || "").replace(/ /g, "-") // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "description",
                message: "Description?",
                default: 'It makes cool things' // Default to current folder name
            },
            {
                type: "input",
                persistent: true,
                name: "author",
                message: "Author?",
                default: 'Anonymous' // Default to current folder name
            },
            {
                type: "confirm",
                persistent: false,
                name: "installNpm",
                message: "Would you like to run 'npm install' at the end?",
                default: false
            },
            {
                type: "confirm",
                persistent: false,
                name: "initGitRepo",
                message: "Would you like init Git REPO at the end?",
                default: false
            }
        ];

        let queriesWithoutAnswered =
            queries.filter(q => q.persistent !== false).map(query => {
                if (Object.keys(config).includes(query.name) === false) return query;
                console.log(`? [config] ${query.message}: ${config[query.name]}`)
            })
                .filter(q => q)
                .concat(queries.filter(q => q.persistent === false));

        this.answers = await this.prompt(queriesWithoutAnswered);
        if (this.answers.appname) this.answers.appname = this.answers.appname.replace(/ /g, '-').replace('\\', '/')
        this.outputPath = this.answers.isLibrary ? 'lib' : 'dist';

        queriesWithoutAnswered.forEach(query => this.config.set(query.name, this.answers[query.name]));

        this.loadedConfig = await this.config.getAll();
        // this.log("app name", this.answers.appname);
        // this.log("Progetto Git", this.answers.gitWorkspaceName);
        // this.log("Autore:", this.answers.author);
        // this.log("cool feature", this.answers.cool);
    }

    async writing() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            {
                appname: this.loadedConfig.appname,
                outputPath: this.outputPath
            }
        );

        let pkgJson = {
            "name": this.loadedConfig.appname,
            "main": "./" + this.outputPath + "/index.js",
            "scripts": {
                "lint": "eslint src/**",
                "type-check": "tsc --noEmit",
                "type-check:watch": "npm run type-check -- --watch",
                "build:js": "babel src --out-dir " + this.outputPath + " --extensions \".ts,.tsx\" --source-maps inline",
                "start": "node " + this.outputPath,
                "debug": "node --inspect-brk ./index.js",
                "watch": "npm-watch dev",
                "dev": "nodemon index.js",
                "coverage": "jest --collect-coverage",
                "test": "jest",
                "version": "npm run build",
                "postversion": "git push && git push --tags && npm publish"
            },
            description: this.loadedConfig.description,
            author: {
                name: this.loadedConfig.author
            },
            repository: {
                type: "git",
                url: `https://${this.loadedConfig.gitBaseUrl}/${this.loadedConfig.gitWorkspaceName}/${this.loadedConfig.gitProjectName}`
            },
        };

        if (this.isLibrary) {
            Object.assign(pkgJson.scripts, {
                "build": "npm run build:types && npm run build:js",
                "build:types": "tsc --emitDeclarationOnly",
            })
        } else {
            Object.assign(pkgJson.scripts, {
                "build": "npm run build:js",
            })
        }

        const ctx = {
            appname: this.loadedConfig.appname,
            description: this.loadedConfig.description,
            author: this.loadedConfig.author
        };

        await this.fs.copyTpl(
            this.templatePath(),
            this.destinationPath(),
            ctx
        );

        await this.fs.move(
            this.destinationPath('er_npm_ignore'),
            this.destinationPath('.npmignore'),
            ctx
        );

        await this.fs.move(
            this.destinationPath('er_git_ignore'),
            this.destinationPath('.gitignore'),
            ctx
        );


        await this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationPath(),
            ctx
        );

        await this.fs.copyTpl(
            this.templatePath('src'),
            this.destinationPath('src'),
            ctx
        );

        await this.fs.copyTpl(
            this.templatePath('test'),
            this.destinationPath('test'),
            ctx
        );

        await console.log(this.fs.extendJSON(this.destinationPath('package.json'), pkgJson));

    }

    async install() {
        if (this.loadedConfig.installNpm) await this.npmInstall();
        //console.log(`npm install `)
    }

    saveConfig() {
        this.config.save();
    }

    async initGit() {
        if (this.loadedConfig.initGitRepo) {
            console.log(`Push to git@${this.loadedConfig.gitBaseUrl}:${this.loadedConfig.gitWorkspaceName}/${this.loadedConfig.appname}.git`)
            await this.spawnCommandSync('git', ['init'], {shell :true});
            await this.spawnCommandSync('git', ['remote', 'add', 'origin', `git@${this.loadedConfig.gitBaseUrl}:${this.loadedConfig.gitWorkspaceName}/${this.loadedConfig.appname}.git`], {shell :true});
            await this.spawnCommandSync('git', ['add', '.'], {shell :true});
            await this.spawnCommandSync('git', ['commit', '-m', '"Initial commit"'], {shell :true});
            await this.spawnCommandSync('git', ['push', '-u', 'origin', 'master'], {shell :true});
        }
    }

    gitRemoteAdd() { }

    gitAdd() { }

    gitCommitMenoEmme() { }

    gitPush() { }

    // method1() {
    //     this.log('method 1 just ran');
    // }
    //
    // method2() {
    //     this.log('method 2 just ran');
    // }
};
