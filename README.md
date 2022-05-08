# Overview

I am learning to build integrated web applications with Remix, a React Framework. I wanted to use this new framework to create a list of articles that will be how-tos to store important information and steps that a person should take to perform routine tasks.

Collaborators who wish to install this project on their own computer should follow these steps:

- Set up your environment:
- 
  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```
- Open web browser to [http://localhost:3001](http://localhost:3001) to view the site.

The demo video is available at: [Software Demo Video](https://youtu.be/1b-K10Y9A2A)

# Web Pages

The main page of the knowledgebase shows a list of links on the left side menu of the page. Upon selecting one of the menu choices, the corresponding article will be displayed in the pane on the right.

At the top of the menu, there is a link to add an article. Clicking this link opens a form with the necessary fields that will be required for an article.

With an article selected, it will be displayed and there will be action buttons to edit or delete it. The edit button will load a form with the article contents pre-filled into the form.

# Development Environment

I used the indie stack of the remix framework for the react library. This primarily makes use of the TypeScript language to generate a React server-rendered application. The indie stack starter works similarly to django in some ways in that it gives some nice scaffolding to build an app.

# Useful Websites

* [Remix Run](https://remix.run/docs/en/v1)
* [Tailwind](https://tailwindcss.com/)
* [Indie Stack](https://github.com/remix-run/indie-stack)

# Future Work

* Store article content in a cloud database (prisma)
* Populate the article list menu from the database instead of hard-coded.
* make fancier controls for managing the article tag feature
* implement a filtered search feature to quickly find articles that match a search term.