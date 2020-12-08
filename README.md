# Soundboy

A sample classification tool for music producers. Intended to make it easier for you to find the sounds you want.

## App Setup

Make sure node and npm are up to date, then it's simple as

```shell
npm ci
npm run build:worker
npm run dev
```

## Python Setup

To get going with the python notebooks for this project, first make sure you have Docker set up, then run

```shell
pushd python/MIR-toolbox-docker
make build
popd
npm run notebooks
```

Visit `http://localhost:8889` and sign in with password `mir`.

### Preparing a Keras Model for Deployment in JS

https://www.tensorflow.org/js/tutorials/conversion/import_keras

```shell
pushd python/saved_models
tensorflowjs_converter --input_format keras soundboy_model_zeros.h5 instrument_prediction_model
popd
```

## Project Structure

Code in `main` and `renderer` corresponds to electron's main and renderer threads. Inside `renderer` there is a next.js website, which is the UI of the application. Inside `main` there is code that manages the renderer, as well as code for DB (NeDB) interactions and heavy computation. Communication between the two processes is done with IPC, a message passing system based on channels and subscriptions. The design and function of the channels can be seen in `main/ipc`. The renderer has an `IpcService` class that handles interaction with the channels. This is made global with React Context and easily accessible with `renderer/hooks/useIpcService`. The main analysis code lives in `worker`, this module is for classification and feature extraction, and is spawned by `main/analyzer.ts`.

The `python` directory contains all things python: sound scraper, ML training & testing, and some Jupyter notebooks for verifying the synchronization of our python and typescript feature extractors.
