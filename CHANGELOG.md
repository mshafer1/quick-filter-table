# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Added Jest test infrastructure and new test work in progress (`copilot: setup tests`, `copilot: tests`, and follow-up overhaul).
- Updated package version metadata after `1.1.3` (`update version number`).
- Make changing search value reset the current page to 1
- Fix issue where non-string, truthy values caused text filter to error.
- Fix issue where debounce was being constructed repeatedly (instead of debouncing)

## [1.1.3] - 2026-03-21

### Changed
- Small UI cleanups.
- Added support for `rows_per_page_options`.
- Updated package version metadata for release (`update package version`).

## [1.1.2] - 2026-03-14

### Fixed
- Distinct filter now highlights correctly when active.

### Changed
- Included related package updates alongside the distinct-filter fix (`add active tag to distinct filter`).

## [1.1.1] - 2026-03-14

### Added
- Expanded documentation at project docs site.
- Added `multiDistinct` filter type to match rows containing any of multiple values.

### Changed
- Dependency and maintenance updates included in release (`axios` security upgrade and Renovate maintenance updates).
- Version alignment and packaging updates for the `1.1.1` line (`Dev/1 1 1 (#34)`, `actually mark library as 1.1.0`, vulnerability reduction in `package.json`).

## [1.1.0] - 2026-03-13

### Added
- Initial filter options feature set introduced.
- Initial project docs publishing workflow.

### Changed
- Packaging/build output updates associated with filter introduction (`Add filter options`).

## [1.0.1] - 2025-12-10

### Changed
- Packaging follow-up release to include distribution output in repository (`Try adding the dist to the repo`).

## [1.0.0] - 2025-12-10

### Added
- First full published release.

[Unreleased]: https://github.com/mshafer1/quick-filter-table/compare/1.1.3...main
[1.1.3]: https://github.com/mshafer1/quick-filter-table/compare/1.1.2...1.1.3
[1.1.2]: https://github.com/mshafer1/quick-filter-table/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/mshafer1/quick-filter-table/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/mshafer1/quick-filter-table/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/mshafer1/quick-filter-table/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/mshafer1/quick-filter-table/commits/1.0.0
