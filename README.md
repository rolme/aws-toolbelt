# AWS Toolbelt (ATB)

The missing command-line tools for managing and deploying to AWS.

## Usage

This cli allows you to:

- manage aws profile

### Options

```sh
AWS Toolbelt

Options:
  -V, --version             output the version number
  -l, --list                list existing profiles
  -s, --set <profile-name>  set your default profile
  -h, --help                output usage information
```

### Examples

List current AWS credential profiles

`atb -l`

Set one of your credentials as the default

`atb -s profile`

## Getting Started

As a starting point the distribution of this CLI is a bit crude. As updates are made, it's up to you to pull the latest changes from the `master` branch and reinstall the app globally. Let's get started:

### Prerequisites

- [node 10+](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)

Both `node` and `yarn` can be installed with [homebrew](https://brew.sh) on macOS with the following command:

```sh
brew install node yarn
```

### Install

Clone the repo and enter the project directory:

```sh
git clone https://github.com/rolme/aws-toolbelt.git
cd aws-toolbelt
```

Then build and install globally with yarn:

```sh
yarn
yarn global add file:$(pwd)
```

Everything should now be installed. Check your cli options:

```sh
atb --help
```

... or jump straight in:

```sh
atb -l
```

### Update

Pull the latest changes, build, remove atb and reinstall:

```sh
git pull
yarn
yarn global remove aws-toolbelt
yarn global add file:$(pwd)
```

### Uninstall

Remove atb:

```sh
yarn global remove aws-toolbelt
```

## Development

### Prerequisites

In addition to `node` and `yarn`, you need `ts-node` in order to run the application directly.

```sh
yarn global add ts-node
```

### Run Locally

Install the packages and run the app with `ts-node`:

```sh
yarn
ts-node index.ts  --help
```
