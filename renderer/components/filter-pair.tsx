import React from 'react';
import { Button, Flex } from 'rebass';

interface FilterPairProps {
    className?: string;
    current: string;
    onChange: (value: string) => void;
    option1: string;
    option2: string;
    option1Count?: number;
    option2Count?: number;
    disabled?: boolean;
}

export default function FilterPair({
    className,
    current,
    onChange,
    option1,
    option2,
    disabled,
    option1Count,
    option2Count,
}: FilterPairProps) {
    const createChangeHandler = (value: string) => () => {
        console.log('selecting', value);
        if (value === current) {
            onChange('All');
            return;
        }

        onChange(value);
    };

    return (
        <Flex className={className} style={{ padding: '10px 0 10px 10px', width: '100%' }}>
            <Button
                mr={2}
                onClick={createChangeHandler(option1)}
                variant={current === option1 ? 'primary' : 'outline'}
                disabled={disabled || option1Count <= 0}
                style={{
                    cursor: 'pointer',
                    marginRight: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: '50%',
                }}
            >
                {option1} {typeof option1Count !== 'undefined' && `(${option1Count})`}
            </Button>
            <Button
                mr={2}
                onClick={createChangeHandler(option2)}
                variant={current === option2 ? 'primary' : 'outline'}
                disabled={disabled || option2Count <= 0}
                style={{
                    cursor: 'pointer',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: '50%',
                }}
            >
                {option2} {typeof option2Count !== 'undefined' && `(${option2Count})`}
            </Button>
        </Flex>
    );
}
