import React, { useState, useEffect } from 'react';
import Card from './card';
import { VictoryAxis, VictoryTooltip, VictoryZoomContainer, VictoryChart, VictoryScatter } from 'victory';
import Tooltip from './tooltip';
import getFileName from '../../util/getFileName';
import useTheme from '../hooks/useTheme';
import { SOUNDS_PER_PAGE } from '../../constants';
import useAppState from '../hooks/useAppState';

import TsneWorker from 'worker-loader?filename=static/[hash].worker.js!./tsne.worker';

import { Sound } from '../../@types';

const Graph = ({ setPage }: { setPage: (number) => void }) => {
    const { state } = useAppState();
    const sounds = state.sounds.data;
    const nowPlaying = state.sounds.nowPlaying;
    const [data, setData] = useState([]);
    const [error, setError] = useState<number>(0);
    const theme = useTheme();
    useEffect(() => {
        setData([]);
        const names = sounds.map(({ filename }) => getFileName(filename));
        const ids = sounds.map(({ _id }) => _id);
        // Missing chroma and MFCC, pitch
        const features = sounds.map((sound) =>
            [
                sound?.loudness?.mean,
                sound?.loudness?.std,
                sound?.perceptualSpread?.mean,
                sound?.perceptualSpread?.std,
                sound?.rms?.mean,
                sound?.rms?.std,
                sound?.spectralCentroid?.mean,
                sound?.spectralCentroid?.std,
                sound?.spectralFlatness?.mean,
                sound?.spectralFlatness?.std,
                sound?.spectralKurtosis?.mean,
                sound?.spectralKurtosis?.std,
                sound?.spectralRolloff?.mean,
                sound?.spectralRolloff?.std,
                sound?.spectralSkewness?.mean,
                sound?.spectralSkewness?.std,
                sound?.spectralSlope?.mean,
                sound?.spectralSlope?.std,
                sound?.spectralSpread?.mean,
                sound?.spectralSpread?.std,
            ].map((value) => (Number.isNaN(value) ? 0 : value ?? 0))
        );
        const worker = new TsneWorker();
        worker.postMessage({ features });
        worker.onmessage = (event) => {
            const { err, output } = event.data;
            setError(err);
            setData(
                output.map(([x, y, z], i) => ({
                    x,
                    y,
                    size: 6,
                    label: names[i],
                    opacity: (z + 1) / 2,
                    id: i,
                    _id: ids[i],
                }))
            );
        };
    }, [sounds]);
    const padding = 0.5;
    const xAxis = data.map(({ x }) => x);
    const yAxis = data.map(({ y }) => y);
    const xMax = Math.max(...xAxis) + padding;
    const xMin = Math.min(...xAxis) - padding;
    const yMax = Math.max(...yAxis) + padding;
    const yMin = Math.min(...yAxis) - padding;
    if (data.length <= 0) return null;
    return (
        <Card padding={1} maxHeight='280px'>
            <VictoryChart
                height={168}
                domain={{ y: [yMin, yMax] }}
                containerComponent={<VictoryZoomContainer zoomDomain={{ x: [xMin, xMax], y: [yMin, yMax] }} />}
            >
                <VictoryScatter
                    data={data}
                    labelComponent={<VictoryTooltip flyoutComponent={<Tooltip />} />}
                    style={{
                        data: {
                            fill: ({ datum }) =>
                                datum._id === nowPlaying?.sound?._id ? theme.colors.red : theme.colors.primary,
                            opacity: ({ datum }) => (datum._id === nowPlaying?.sound?._id ? 1 : datum.opacity),
                            cursor: () => 'pointer',
                        },
                    }}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onClick: () => [
                                    {
                                        target: 'data',
                                        mutation: (props) => {
                                            const id = props?.datum.id;
                                            setPage(Math.ceil(id / SOUNDS_PER_PAGE));
                                            return null;
                                        },
                                    },
                                ],
                            },
                        },
                    ]}
                />
                <VictoryAxis
                    style={{
                        axis: { stroke: 'transparent' },
                        ticks: { stroke: 'transparent' },
                        tickLabels: { fill: 'transparent' },
                    }}
                />
            </VictoryChart>
        </Card>
    );
};

export default Graph;
