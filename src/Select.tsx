import { useEffect, useRef, useState } from 'react'
import styles from './select.module.css'

export interface SelectOptionI {
    label: string,
    value: number
}

interface SingleSelectProps {
  multiple?: false,
  selected?: SelectOptionI,
  onChange: (v: SelectOptionI | undefined) => void
}

interface MultipleSelectProps {
  multiple: true,
  selected: SelectOptionI[],
  onChange: (v: SelectOptionI[]) => void
}

type SelectProps = {
  options: SelectOptionI[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, selected, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const refContainer = useRef<HTMLDivElement>(null);

  //@ts-ignore
  function clearOptions(e) {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined)

  }

  function selectOption(option: SelectOptionI) {
    if (multiple) {
      if (selected.includes(option)) {
        onChange(selected.filter(o => o !== option))
      } else {
        onChange([...selected, option])
      }
    } else {
      if (option !== selected) onChange(option)
    }
  }

  function isOptionSelected(option: SelectOptionI) {
    if(multiple) {
      return selected.includes(option)
    } else {
      return selected === option;
    }
    
  }

  useEffect(() => {
    if(isOpen) setHighlightedIndex(0);
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== refContainer.current) return
      console.log(e.code)
      switch(e.code) {
        case "Enter":
        case "Space":
          setIsOpen(prev => !prev)
          if (isOpen) selectOption(options[highlightedIndex])
          break
        case 'ArrowDown':
        case "ArrowUp":
          if(!isOpen) {
            setIsOpen(true)
            break
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break;
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    refContainer.current?.addEventListener('keydown', handler)

    return () => {
      refContainer.current?.removeEventListener('keydown', handler)
    }
  }, [isOpen, highlightedIndex, options])

  return (
    <div
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen(prev => !prev)}
      onBlur={() => setIsOpen(false)}
      ref={refContainer}
    >
        <span className={styles.value}>
          { multiple ? selected.map(v => (
            <button key={v.value} className={styles['option-badge']} onClick={e => {
              e.stopPropagation()
              selectOption(v)
            }}>
              {v.label}
              <span className={styles['remove-btn']}>&times;</span>
            </button>
          )) : selected?.label }
        </span>
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