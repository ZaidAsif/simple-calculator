'use client';

import { useEffect, useState } from "react";
import styles from '@/components/calculator/calculator-style.module.css';

export default function Calculator() {
    const [prevInput, setPrevInput] = useState<string>('');
    const [currentInput, setCurrentInput] = useState<string>('');
    const [operator, setOperator] = useState('');
    const [isClearing, setIsClearing] = useState(false);
    const [error, setError] = useState(false);

    const handleClear = () => {
        setIsClearing(true);
        setTimeout(() => {
            setPrevInput('');
            setCurrentInput('');
            setOperator('');
            setIsClearing(false);
            setError(false);
        }, 500);
    };

    const giveOutput = (value: string) => {
        if (value === 'c') {
            handleClear();
        } else if (value === '=') {
            if (operator === '/' && parseFloat(currentInput) === 0) {
                setError(true)
            }
            else {
            const result = makeCalculations(parseFloat(prevInput), operator, parseFloat(currentInput));
            if (typeof result === 'number') {
                setCurrentInput(result.toString());
            } else {
                setCurrentInput('Error');
            }
            setPrevInput('');
            setOperator('');
        }
        } else if (['+', '-', '*', '/', '^'].includes(value)) {
            setPrevInput(currentInput);
            setCurrentInput('');
            setOperator(value);
        } else if (value === '%') {
            const result = parseFloat(currentInput) / 100;
            setCurrentInput(result.toString());
        } else if (value === '√') {
            const num = parseFloat(currentInput)
            if (num < 0) {
                setError(true)
                setCurrentInput('');

            }
            else {
            const result = Math.sqrt(num);
            setCurrentInput(result.toString());
            }
        } else {
            setCurrentInput(currentInput + value);
        }
    };

    const makeCalculations = (prevNum: number, op: string, currNum: number) => {
        switch (op) {
            case '+': return prevNum + currNum;
            case '-': return prevNum - currNum;
            case '*': return prevNum * currNum;
            case '/': return currNum === 0 ? ''  : prevNum / currNum;
            case '^': return Math.pow(prevNum, currNum);
            default: return currNum;
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (error) return;

            const key = event.key;
            const keyToButtonValue: { [key: string]: string } = {
                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
                '6': '6', '7': '7', '8': '8', '9': '9', '+': '+', '-': '-',
                '*': '*', '/': '/', '=': '=', 'Enter': '=', 'Backspace': 'c',
                '.': '.', '%': '%', 'r': '√', 'R': '√', '^': '^', 'e': '^',
            };

            if (keyToButtonValue[key]) {
                giveOutput(keyToButtonValue[key]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentInput, prevInput, operator, error]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false);
            }, 3000);
        }

    }, [error]);

    return (
        <div className={`${styles.calculator}`} id="calculator">
            <input
                type="text"
                value={error ? 'Error' : currentInput}
                className={`${styles.display} ${isClearing ? styles.vanish : ''}`}
                style={{ background: '#333' }}
                readOnly
            />
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => giveOutput('7')}>7</button>
                <button className={styles.button} onClick={() => giveOutput('8')}>8</button>
                <button className={styles.button} onClick={() => giveOutput('9')}>9</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('/')}>/</button>

                <button className={styles.button} onClick={() => giveOutput('4')}>4</button>
                <button className={styles.button} onClick={() => giveOutput('5')}>5</button>
                <button className={styles.button} onClick={() => giveOutput('6')}>6</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('*')}>*</button>

                <button className={styles.button} onClick={() => giveOutput('1')}>1</button>
                <button className={styles.button} onClick={() => giveOutput('2')}>2</button>
                <button className={styles.button} onClick={() => giveOutput('3')}>3</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('-')}>-</button>

                <button className={styles.button} onClick={() => giveOutput('0')}>0</button>
                <button className={styles.button} onClick={() => giveOutput('.')}>.</button>
                <button className={styles.buttonClear} onClick={() => giveOutput('c')}>C</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('+')}>+</button>

                <button className={styles.buttonOperator} onClick={() => giveOutput('%')}>%</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('√')}>√</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('^')}>^</button>
                <button className={styles.buttonOperator} onClick={() => giveOutput('=')}>=</button>
            </div>
        </div>
    );
}
