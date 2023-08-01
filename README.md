<div align="center">

<img src="https://github.com/Ilhasoft/weni-platform/raw/main/images/logos/png/weni-396x129-color.png" width="100px" />

*This project is a module of [Weni](https://github.com/weni-ai) integrated inside [Weni WebApp (Connect)](https://github.com/weni-ai/weni-webapp)*

<br/> 

# INTEGRATIONS

Front-end project of Weni's Integrations module!

</div>

<br/> 

# Technologies

- [Vue 2](https://v2.vuejs.org/)
- [Sass](https://sass-lang.com/)
- [i18n](https://www.i18next.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Unnnic](https://github.com/weni-ai/unnnic) (Weni's design system)

<br/> 

# Requirements
Before running the application, make sure you have installed the following tools on your machine:

- [Node.js 14.x](https://nodejs.org/en)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (recommended)

<br/> 

# Set up

1. Open the terminal and clone the repository

```
  git clone https://github.com/weni-ai/weni-integrations-webapp.git
```

2. Enter the created directory

```
  cd weni-integrations-webapp
```

3. Install the dependencies:

```
  yarn
```

<br/> 

# How to develop
## Environment variables
1. Create the .env file
2. Configure the .env following the patterns below
 
| Variable | Type | Default | Description |
|--|--|--|--|
| VUE_APP_API_BASE_URL | `string` | Empty | https://integrations-engine.stg.cloud.weni.ai
| VUE_APP_LOGROCKET_ID  | `string` | Empty | 
| VUE_APP_HELPHERO_ID | `string` | Empty | m7dO0to4OK
| VUE_APP_PARENT_IFRAME_DOMAIN | `string` | Empty | https://dash-staging.weni.ai
| VUE_APP_FLOWS_IFRAME_URL | `string` | Empty | https://flows-staging.weni.ai

<br/> 

## Tokens
...

<br/> 

## Execution
Start the server with:

```
  yarn serve
```

After that, it will be available at http://localhost:8080.

<br/> 

# Development Workflow

| Command | Description |
|--|--|
| yarn | Install dependencies
| yarn serve | serve with hot reload at localhost:8080
| yarn build | Build for production with minification
| yarn build --report | Build for production and view the bundle analyzer report
| yarn translations:build | Build translations for production
| yarn translations:suggest-from-pt-br | Build translations for production with suggestions. Add at least one language in the translations file so that suggestions in other languages can be generated.
| yarn lint | Show lint warnings and errors
| yarn test:unit | Run all tests
| yarn test:unit --watch | Run test in watch mode

<br/> 

# Open-Source Governance
The Weni Platform open source projects are governed by @weni-ai. Weni opens all its software parts under terms of an open-source license to reach potential users and partners mainly. Secondly, Weni wants to reach developers by building a community for some pieces that are more reusable in other businesses or software projects, such as NLP models or tools. Besides that, the openness of our software is also related to building trust by enabling our external stakeholders to audit the security of our software.

<br/> 

# Community
- Join our community chat to discuss with our internal team
- Join #dev for help from the community to development issues

<br/>

# Contributing
We are looking for collaboration from the Open Source community! There's so much we want to do, including but not limited to: enhancing existing applications with new features, optimizing the NLP tasks and algorithms involved that boost accuracy, new communication channels and integrations.

- Please read our contribution guidelines for details on what and how you can contribute.

- Report a bug by using this guideline for details on what and how you can contribute.
