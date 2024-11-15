# Rspack Project

## Deps

* Dépendances front-end

react react-dom

@types/react @types/react-dom
react-refresh


* Dépendances tauri

@tauri-apps/api @tauri-apps/plugin-shell

@tauri-apps/cli cross-env

* Rspack

@rspack/cli @rspack/core @rspack/plugin-react-refresh


Install the dependencies:

```bash
npm install
```

## Config

Voir...

rspack.config.mjs
src-tauri/tauri.config.json

## Get Started

Start the dev server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

## Tauri 2

Il est possible d'ajouter tauri 2 au projet rspack

Il est possible de spécifier un workspace en ajoutant un fichier Cargo.toml à la racine

```toml
[workspace]
members = ["src-tauri"]
resolver = "2"
```