# Soundboy

A sample classification tool for music producers. Intended to make it easier for you to find the sounds you want.

## App Setup

Make sure node and npm are up to date, then it's simple as

```shell
git clone --recursive git@github.com:julesyoungberg/soundboy.git
cd soundboy
npm i
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

Visit `http://localhost:8888` and sign in with password `mir`.

### Preparing a Keras Model for Deployment in JS

https://www.tensorflow.org/js/tutorials/conversion/import_keras

## Project Structure

Code in `main` and `renderer` corresponds to electron's main and renderer threads. Inside `renderer` there is a next.js website, which is the UI of the application. Inside `main` there is code that manages the renderer, as well as code for DB (NeDB) interactions and heavy computation. Communication between the two processes is done with IPC, a message passing system based on channels and subscriptions. The design and function of the channels can be seen in `main/ipc`. The renderer has an `IpcService` class that handles interaction with the channels. This is made global with React Context and easily accessible with `renderer/hooks/useIpcService`. The main analysis code lives in `worker`, this module is for classification and feature extraction, and is spawned by `main/analyzer.ts`.

There will also need to be a directory for python data collection and training.

## Todos

-   Instrument Classification
    -   train an ML model for instrument classification, preferably we can find a pretrained model to adjust with our own samples.
    -   load the model into the analyzer worker for sample library classication
-   Feature Extraction
    -   segmentation
        -   determine if melodic or one hit
    -   rhythm
-   Interface
    -   reanalyze button and functionality
    -   filter samples by perceptual features
        -   use buttons to generate NeDB queries
        -   E.g. filtering by `bright` may only return samples with a high enough spectral centroid
    -   drag samples from the list into a DAW or elsewhere
    -   other views/visualizations?
        -   2D view of instrument samples using t-SNE
-   ML
    -   More Feature Exrtraction:
        -   Explore timbre space: all examples seem to centre around the centroid + 2 other features
            -   centroid, roughness, log attack time
            -   centroid, flux, etc....
        -   Librosa's other features: means + std devs
            -   centroid, bandwidth, contrasts, flatness, rolloff, zcf
    -   Explore Keras builtins: VGG19 + VGGish feature extraction
    -   Standardization of data
    -   Principal Component Analysis
    -   Other ML models to explore:
        -   k-nearest neighbour
        -   SVM (Support Vector Machine) and RBFNN (radial basis functions NNs)
