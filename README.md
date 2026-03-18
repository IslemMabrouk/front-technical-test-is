# [Ictechlab]() - Front-end technical test

This test is part of Ictechlab's hiring process for a front-end developer position. It should take 3 to 6 hours of your time.

## Objective

The goal of this technical test is to code a small file manager app. It will require you to read, understand and implement an unknown API using JavaScript, and create a basic user interface to present the data.

### Structure

This repository’s main branch provides a ready to use Angular 19 boilerplate, pre-configured with **TypeScript** and **Sass**, allowing you to quickly start building scalable and maintainable web applications. The project structure is organized for easy development, and you are free to customize it to fit your needs.

Although we are working with Angular at Ictechlab, there is _no limitation_ in the frameworks and libraries you can use for this test.

### API

The **api** directory contains the code for the mock file manager API you will be using, so you don't have to change anything in those files (you can of course take a look inside if you want). For detailed API endpoints and usage, see [API.md](./API.md).

### What we're expecting

We expect your code to work without bugs and implement the following features:

- Display the root files and folders
- Download a file
- Upload a file

We also expect your code to be a reflection of yourself at work, so we will be attentive to the choices you'll make regarding code architecture, readability and performance.

### What we're not expecting

We suggest you don't spend too much time on your UI, we know how time intensive it can be. The same can be said for browser compatibility, just make sure your app works in one evergreen browser, like Chrome for instance.

### Bonus features

If you have some time left and want to go a little bit further, here are some feature ideas you can add to this app:

- Navigate inside folders
- Use routing for navigation
- Rename a file or folder
- Create a new folder
- Move a file / folder to another folder
- Delete a file or a folder
- Upload multiple files / folders
- Upload through drag and drop
- Make the app responsive

## Quick start

```
npm ci
npm start
```

## Submission

The quickest way to submit your work is by [forking](https://github.com/ictechlab/front-technical-test/fork) this repository, then sending us a Pull Request after you're done.

Alternatively, you can copy this repository to your personal space, and send us a link to your branch (if you make your repo private, you'll need to [invite us as collaborators](https://help.github.com/en/articles/inviting-collaborators-to-a-personal-repository)).
