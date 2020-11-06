import React from 'react';
import { Button, Flex } from 'rebass';

interface FilterPairProps {
    className?: string;
    current: string;
    onChange: (value: string) => void;
    option1: string;
    option2: string;
}

export default function FilterPair({ className, current, onChange, option1, option2 }: FilterPairProps) {
    const createChangeHandler = (value: string) => () => {
        console.log('selecting', value);
        if (value === current) {
            onChange('All');
            return;
        }

        onChange(value);
    };

    return (
        <Flex className={className} style={{ padding: 10 }}>
            <Button
                mr={2}
                onClick={createChangeHandler(option1)}
                variant={current === option1 ? 'primary' : 'outline'}
                style={{
                    cursor: 'pointer',
                    marginRight: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                {option1}
            </Button>
            <Button
                mr={2}
                onClick={createChangeHandler(option2)}
                variant={current === option2 ? 'primary' : 'outline'}
                style={{
                    cursor: 'pointer',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                }}
            >
                {option2}
            </Button>
        </Flex>
    );
}
