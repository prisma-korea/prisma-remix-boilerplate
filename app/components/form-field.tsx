import {useEffect, useState} from "react"

interface FormFieldProps {
  htmlFor: string
  label: string
  className?: string;
  type?: string
  value: any
  onChange?: (...args: any) => any
  error?: string
}

export function FormField({htmlFor, label, type = 'text', value, onChange = () => { }, error = "", className}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error)
  useEffect(() => {
    setErrorText(error)
  }, [error])

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-black dark:text-white">
        {label}
      </label>
      <input onChange={e => {
        onChange(e)
        setErrorText('')
      }} type={type} id={htmlFor} name={htmlFor} value={value} className="
        w-full p-3 rounded my-2 outline outline-1 focus:outline-2 outline-black
      "/>
      <div className="text-xs tracking-wide text-red w-full">
        {errorText || ''}
      </div>
    </div>
  )
}
