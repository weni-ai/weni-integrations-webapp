<div id="top"></div>

<br />
<div align="center">
  <h3 align="center">Weni Integrations WebApp</h3>

  <p align="center">
    Front-end project of Weni's Integrations module!
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project

Front-end project of Weni's Integrations module. Backend data is gathered from [Weni Integrations Engine](https://github.com/Ilhasoft/weni-integrations-engine).
This project is a module of [Weni WebApp](https://github.com/Ilhasoft/weni-webapp)

### Built With

* [Vue.js](https://vuejs.org/)
* [Unnnic](https://github.com/Ilhasoft/unnnic)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* [Node.js 14.x](https://nodejs.org/en/download/)
* [yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Ilhasoft/weni-integrations-webapp.git
   ```
2. Install dependency packages
   ```sh
   yarn install
   ```
3. Create a `.env` and enter the required environment variables
   ```sh
    VUE_APP_API_BASE_URL=http://localhost:8001
    VUE_APP_USE_SENTRY=false
    VUE_APP_SENTRY_ENVIRONMENT=develop
    VUE_APP_SENTRY_DSN=your-sentry-dsn
   ```
4. Get it up running with
   ```sh
    yarn run serve
   ```
### Environment variables

| Name                           	|  Type  	| Required 	|         Default        	| Description                                                                                                                                                                          	|
|--------------------------------	|:------:	|:--------:	|:----------------------:	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| VUE_APP_API_BASE_URL                          	|  String  	|   True  	|          None          	| [Weni Integrations Engine](https://github.com/Ilhasoft/weni-integrations-engine) application url.|
| VUE_APP_USE_SENTRY                     	| Bool 	|   False   	|          False          	| Boolean that defines if sentry should be used and notified on errors. |
| VUE_APP_SENTRY_ENVIRONMENT                  	|  String  	|   False  	|          None          	| Environment to be sent to sentry as metadata. |
| VUE_APP_SENTRY_DSN | String | False | None | Sentry's DSN Url |
