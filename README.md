# Soundboy

A sample classification tool for music producers. Intended to make it easier for you to find the sounds you want.

## Setup

Make sure node and npm are up to date, then it's simple as

```shell
git clone git@github.com:julesyoungberg/soundboy.git
cd soundboy
npm i
npm run build:worker
npm run dev
```

## Project Structure

Code in `main` and `renderer` corresponds to electron's main and renderer threads. Inside `renderer` there is a next.js website, which is the UI of the application. Inside `main` there is code that manages the renderer, as well as code for DB (NeDB) interactions and heavy computation. Communication between the two processes is done with IPC, a message passing system based on channels and subscriptions. The design and function of the channels can be seen in `main/ipc`. The renderer has an `IpcService` class that handles interaction with the channels. This is made global with React Context and easily accessible with `renderer/hooks/useIpcService`. The main analysis code lives in `main/analyzer`, this module spawns a worker for classification and feature extraction.

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
    -   keep track of progress during analyzation
    -   reanalyze button and functionality
    -   analyzation improvements
        -   show progress bar at bottom (maybe show most recently analyzed song in batch)
        -   show pop up after analyzation with any failed songs
    -   design improvments (icons, colors)
    -   filter samples by perceptual features
        -   use buttons to generate NeDB queries
        -   E.g. filtering by `bright` may only return samples with a high enough spectral centroid
    -   drag samples from the list into a DAW or elsewhere
    -   other views/visualizations?
        -   2D view of instrument samples using t-SNE
-   Application
    -   validate sound documents on insert
        -   overwrite documents with same filename
