import { useState } from "react";
import Select, { SelectOptionI } from "./Select"

const options = [
  {
    label: 'One',
    value: 1
  },
  {
    label: 'Two',
    value: 2
  },
  {
    label: 'Three',
    value: 3
  },
  {
    label: 'Four',
    value: 4
  },
  {
    label: 'Five',
    value: 5
  }
]

function App() {
  const [value, setValue] = useState<SelectOptionI | undefined>(options[0]);
  const [multipleValues, setMultipleValues] = useState<SelectOptionI[]>([options[0]]);
  return <div>
    <Select multiple options={options} selected={multipleValues} onChange={options => setMultipleValues(options)} />
    <br />
    <Select options={options} selected={value} onChange={option => setValue(option)} />
  </div>
}

export default App
