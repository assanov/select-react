
import { useEffect, useState } from 'react'
import styles from './select.module.css'

export interface SelectOptionI {
    label: string,
    value: any
}

interface SelectProps {
    selected?: SelectOptionI,
    options: SelectOptionI[],
    onChange: (v: SelectOptionI | undefined) => void
}

const Select = ({ selected, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  function clearOptions(e: Event) {
    e.stopPropagation();
    onChange(undefined);
  }

  function selectOption(option: SelectOptionI) {
    if (option !== selected) onChange(option)
  }

  function isOptionSelected(option: SelectOptionI) {
    return selected === option;
  }

  useEffect(() => {
    if(isOpen) setHighlightedIndex(0);
  }, [isOpen])

  return (
    <div tabIndex={0} className={styles.container} onClick={() => setIsOpen(prev => !prev)} onBlur={() => setIsOpen(false)}>
        <span className={styles.value}>{selected?.label}</span>
        <button className={styles['clear-btn']} onClick={e => clearOptions(e)}>&times;</button>
        <div className={styles.divider}></div>  
        <div className={styles.caret}></div>
        <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
            {
                options.map((option, index) => <li
                    key={option.label}
                    className={`
                        ${styles.option}
                        ${isOptionSelected(option) ? styles.selected : ''}
                        ${index === highlightedIndex ? styles.highlighted : ''}
                    `}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={e => {
                        e.stopPropagation();
                        selectOption(option);
                        setIsOpen(false)
                    }
                }>
                    {option.label}
                </li>)
            }
        </ul>
    </div>
  )
}

export default Select