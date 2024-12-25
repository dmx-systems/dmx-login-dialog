# DMX 5 Login Dialog

## Version History

**3.1** -- Dec 25, 2024

* Compatible with DMX 5.3.5
    * Depends on `dmx-api` 3.1 (account management)

**3.0.1** -- Jul 11, 2024

* Fix: package.json

**3.0.0** -- Jul 10, 2024

* BREAKING CHANGES
    * Remove hardcoded 'Basic' authentication method 

**2.0.1** -- Jun 14, 2021

* Chore: remove debug log

**2.0** -- Dec 30, 2020

* BREAKING CHANGES
    * Make use of `dmx-api` 2.0
    * Various `dm5` -> `dmx` renamings
* Improvements:
    * Dialog is extensible by custom Vue components (new component attribute `extensions`)
    * Make dialog movable and remove mask
    * Wording: "Login/out" -> "Sign in/out"
* Chore:
    * Adapt URLs to `github.com/dmx-systems`
    * Code run through `eslint`

**1.0.1** -- Aug 5, 2020

* Fix imports

**1.0** -- Aug 5, 2020

* Chore: rename this package `dm5-login-dialog` -> `dmx-login-dialog`

**0.1** -- Mar 30, 2020

* 1st release
