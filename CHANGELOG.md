## **3.0.0** <sub><sup>2024-10-22 (69c40f1...69c40f1)</sup></sub>

### BREAKING CHANGES

- new versions of @cosmotech/azure now require to use at least v4 of the Cosmo Tech API

### Bug Fixes

- adapt scenario DTO to API v4 runners new structure ([69c40f1](https://github.com/Cosmo-Tech/webapp-component-azure/commit/69c40f1))

## **2.0.1** <sub><sup>2024-10-22 (0667f8b...2340885)</sup></sub>

### Bug Fixes

- \[SDCOSMO\-1886\] fix behavior of dynamic filters when selection list is empty ([0667f8b](https://github.com/Cosmo-Tech/webapp-component-azure/commit/0667f8b))
- \[PROD\-14001\] add missing dynamic filter for scenario run id ([2340885](https://github.com/Cosmo-Tech/webapp-component-azure/commit/2340885))

## **2.0.0** <sub><sup>2024-07-15 (1f7e2d3...f1f6bf6)</sup></sub>

### Features

- add MSAL initialization step in setConfig function ([7efd6ba](https://github.com/Cosmo-Tech/webapp-component-azure/commit/7efd6ba))

### Bug Fixes

- force removal of MSAL interaction status if it exists in session storage ([bebff11](https://github.com/Cosmo-Tech/webapp-component-azure/commit/bebff11))

### BREAKING CHANGES

- setConfig is now an async function and must be called with the `await` keyword ([7efd6ba](https://github.com/Cosmo-Tech/webapp-component-azure/commit/7efd6ba))

## **1.3.5** <sub><sup>2024-06-24 (6988b2e...5214e79)</sup></sub>

### Bug Fixes

- fix redirection URL after login for AuthMSAL provider ([5214e79](https://github.com/Cosmo-Tech/webapp-component-azure/commit/5214e79))

## **1.3.4** <sub><sup>2023-10-09 (f1fc84f...f1fc84f)</sup></sub>

### Bug Fixes

- fix login error (revert upgrade of @azure/msal-browser, going back from 3.x to 2.x)

## **1.3.3** <sub><sup>2023-10-06 (923b441...15b0be6)</sup></sub>

- update dependencies

## **1.3.2** <sub><sup>2023-08-28 (7940f43...0fba394)</sup></sub>

### Bug Fixes

- prevent 'silent sign\-in in request' error message ([0fb4731](https://github.com/Cosmo-Tech/webapp-component-azure/commit/0fb4731))

## **1.3.1** <sub><sup>2023-04-27 (ed15212...f39eb27)</sup></sub>

- update dependencies

## **1.3.0** <sub><sup>2023-01-13</sup></sub>

### Features

- add new PowerBI filters on scenarios

## **1.2.1** <sub><sup>2022-11-04 (81676ee...81676ee)</sup></sub>

- update dependencies

## **1.2.0** <sub><sup>2022-10-12 (d8c20f9...b298459)</sup></sub>

### Features

- add user email in auth data ([b298459](https://github.com/Cosmo-Tech/webapp-component-azure/commit/b298459))

## **1.1.22** <sub><sup>2022-09-16 (03011f1...0dccd67)</sup></sub>

- update dependencies

## **1.1.21** <sub><sup>2022-08-12 (7f8e9d1...bdf9630)</sup></sub>

- update dependencies

## **1.1.20** <sub><sup>2022-05-19 (69825f4...9aa473b)</sup></sub>

### Bug Fixes

- improve handling of errors during authentication ([a11487c](https://github.com/Cosmo-Tech/webapp-component-azure/commit/a11487c))

## **1.1.19** <sub><sup>2022-04-29</sup></sub>

- update dependencies

## **1.1.18** <sub><sup>2022-04-04</sup></sub>

- update dependencies

## **1.1.17** <sub><sup>2022-03-16</sup></sub>

- update dependencies

## **1.1.16** <sub><sup>2022-03-07</sup></sub>

- update dependencies

## **1.1.15** <sub><sup>2022-02-28</sup></sub>

- update dependencies

## **1.1.14** <sub><sup>2022-02-21</sup></sub>

- update dependencies

## **1.1.13** <sub><sup>2022-02-14</sup></sub>

- update dependencies

## **1.1.12** <sub><sup>2022-02-07</sup></sub>

- update dependencies

## **1.1.11** <sub><sup>2022-01-31</sup></sub>

- update dependencies

## **1.1.10** <sub><sup>2022-01-24</sup></sub>

- update dependencies

## **1.1.9** <sub><sup>2022-01-17</sup></sub>

- update dependencies

## **1.1.8** <sub><sup>2022-01-05</sup></sub>

- update dependencies

## **1.1.7** <sub><sup>2021-12-20</sup></sub>

- update dependencies
- move some dependencies to dev dependencies ([e56aca3](https://github.com/Cosmo-Tech/webapp-component-azure/commit/e56aca3))

## **1.1.6** <sub><sup>2021-12-13</sup></sub>

- update dependencies

## **1.1.5** <sub><sup>2021-12-06</sup></sub>

- update dependencies

## **1.1.4** <sub><sup>2021-11-29</sup></sub>

- update dependencies

## **1.1.3** <sub><sup>2021-11-22</sup></sub>

- update dependencies

## **1.1.2** <sub><sup>2021-11-19</sup></sub>

### Features

- add getUserRoles default function ([0b8df9c](https://github.com/Cosmo-Tech/webapp-component-azure/commit/0b8df9c))

## **1.1.1** <sub><sup>2021-11-15</sup></sub>

- update dependencies

## **1.1.0** <sub><sup>2021-11-10</sup></sub>

### Features

- add acquireTokensByRequest function ([c13398f](https://github.com/Cosmo-Tech/webapp-component-azure/commit/c13398f))

## **1.0.3** <sub><sup>2021-11-08</sup></sub>

- update dependencies

## **1.0.2** <sub><sup>2021-11-02</sup></sub>

- update dependencies

## **1.0.1** <sub><sup>2021-10-25</sup></sub>

- update dependencies

## **1.0.0** <sub><sup>2021-10-15</sup></sub>

### Features

- auth provider for MSAL
- add utilities for SimplePowerBIReportEmbed
