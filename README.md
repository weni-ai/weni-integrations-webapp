<div align="center">

<img src="https://github.com/Ilhasoft/weni-webapp/raw/main/src/assets/LogoWeniAnimada.svg" height="100" />

[![Run Unit Tests, Lint Files and Build Project](https://github.com/weni-ai/weni-integrations-webapp/actions/workflows/test-and-build.yml/badge.svg?branch=main)](https://github.com/weni-ai/weni-integrations-webapp/actions/workflows/test-and-build.yml)
[![codecov](https://codecov.io/gh/weni-ai/weni-integrations-webapp/branch/main/graph/badge.svg?token=TZHJ6L2U7R)](https://codecov.io/gh/weni-ai/weni-integrations-webapp)

*This project is a module of [Weni](https://github.com/weni-ai) integrated inside [Weni WebApp (Connect)](https://github.com/weni-ai/weni-webapp)*

# :desktop_computer: Weni-Integrations-Webapp

Front-end project of Weni's Integrations module. Backend data is gathered from [Weni Integrations Engine](https://github.com/Ilhasoft/weni-integrations-engine).

</div>

# About Weni Integrations

Through Integrations, users of the Weni platform will be able to connect their chatbot with different communication channels. This project was carefully developed with the needs of our clients in mind, with the aim of unlocking the human potential of your organization.
> [Usability documentation](https://docs.weni.ai/l/pt/integracoes)

![integrations-preview](https://github.com/weni-ai/weni-integrations-webapp/assets/54125469/871ce5a7-98a5-4e13-8979-b31c276172a2)

# Main Technologies

- [Vue 3](https://v3.vuejs.org/)
- [Sass](https://sass-lang.com/)
- [i18n](https://www.i18next.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Unnnic](https://github.com/weni-ai/unnnic) (Weni's design system)

# Requirements

Before running the application, make sure you have installed the following tools on your machine:

- [Node.js 18.x](https://nodejs.org/en)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (recommended)

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

# How to develop

## Environment variables

1. Create the .env file
2. Configure the .env following the patterns below
 
| Variable | Type | Default | Description |
|--|--|--|--|
| API_BASE_URL | `string` | Empty | URN of the backend environment to API requests. Without slash at the end.
| WHATSAPP_FACEBOOK_APP_ID  | `string` | Empty | WhatsApp Facebook App identifier
| FACEBOOK_APP_ID  | `string` | Empty | Facebook App identifier
| LOGROCKET_ID  | `string` | Empty | LogRocket identifier
| HELPHERO_ID | `string` | Empty | HelpHero identifier
| PARENT_IFRAME_DOMAIN | `string` | Empty | Weni Webapp URL
| FLOWS_IFRAME_URL | `string` | Empty | Flows module URL

# Development

Start the server with:

```
  yarn serve
```

After that, it will be available at http://localhost:8080.

# Development Workflow

| Command | Description |
|--|--|
| yarn | Install dependencies
| yarn dev | serve with hot reload at localhost:5173
| yarn build | Build for production with minification
| yarn build --report | Build for production and view the bundle analyzer report
| yarn translations:build | Build translations for production
| yarn translations:suggest-from-pt-br | Build translations for production with suggestions. Add at least one language in the translations file so that suggestions in other languages can be generated.
| yarn lint | Show lint warnings and errors
| yarn test:unit | Run all tests
| yarn test:unit --watch | Run test in watch mode

# Open-Source Governance

The Weni Platform open source projects are governed by [@weni-ai](https://github.com/weni-ai/). Weni opens all its software parts under terms of an open-source license to reach potential users and partners mainly. Secondly, Weni wants to reach developers by building a community for some pieces that are more reusable in other businesses or software projects, such as NLP models or tools. Besides that, the openness of our software is also related to building trust by enabling our external stakeholders to audit the security of our software.

# Community

- Join our [community chat](https://community-chat.weni.ai) to discuss with our internal team
- Join [#dev](https://community-chat.weni.ai/channel/dev) for help from the community to development issues

# Contributing

**We are looking for collaboration from the Open Source community!** There's so much we want to do,
including but not limited to: enhancing existing applications with new features,
optimizing the NLP tasks and algorithms involved that boost accuracy, new communication channels and integrations.

* Please read our [contribution guidelines](https://github.com/ilhasoft/weni-platform/blob/main/.github/CONTRIBUTING.md) for details on what and how you can contribute.
* Report a bug by using [this guideline](https://github.com/ilhasoft/weni-platform/blob/main/.github/CONTRIBUTING.md#report-a-bug) for details on what and how you can contribute.
