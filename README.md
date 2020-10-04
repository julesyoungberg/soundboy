# Soundboy

A sample classification tool for music producers. Intended to make it easier for you to find the sounds you want. 

## Setup

Make sure node and npm are up to date, then it's simple as

```shell
git clone git@github.com:julesyoungberg/soundboy.git
cd soundboy
npm i
npm run dev
```


## Project Structure

Code in `main` and `renderer` corresponds to electron's main and renderer threads. Inside `renderer` there is a next.js website, which is the UI of the application. Inside `main` there is code that manages the renderer, as well as code for DB (NeDB) interactions and heavy computation. Communication between the two processes is done with IPC, a message passing system based on channels and subscriptions. The design and function of the channels can be seen in `main/ipc`. The renderer has an `IpcService` class that handles interaction with the channels. This is made global with React Context and easily accessible with `renderer/hooks/useIpcService`. The main analysis code lives in `main/analyzer`, this module spawns a worker for classification and feature extraction.

There will also need to be a directory for python data collection and training.


## Todos

- Instrument Classification
    - research instrument classification with ML
    - collect large amount of samples (probably doable with a script and the freesound.org API)
    - train an ML model for instrument classification, preferably we can find a pretrained model to adjust with our own samples.
    - load the model into the analyzer worker for sample library classication
- Feature Extraction
    - extract features from each sample (maybe using meyda - already installed)
    - save features to the DB
        - Document schema should be typed properly (currently lots of `Record<string, any>`)
- Interface
    - need a way to select a folder for analysis
        - send folder name as a filename to the analyzer, recursively explore directories in the worker
    - need a way to view a list of samples and filter by perceptual features
        - E.g. filtering by `bright` may only return samples with a high enough spectral centroid
        - need to be able to drag samples from the list into a DAW or elsewhere
    - other views/visualizations?
- IPC
    - need a new method in `IpcService` for sending a single message and expecting a stream of messages back (for the analysis process)
