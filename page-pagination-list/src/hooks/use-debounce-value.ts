import { useEffect, useState } from 'react'

// Debounce é basicamente pra causar um delay na execução de uma função. Ex: Quando eu digito no input, eu quero que ele faça uma requisição, mas eu não quero que ele faça uma requisição a cada letra que eu digito, eu quero que ele faça uma requisição a cada 2 segundos que eu pare de digitar. Outro ex: pegar o tamanho da tela so quando o usuario parar de redimensionar a tela...
export default function useDebounceValue<T = unknown>(value: T, delay: number) {
  // Passando o value do state que voce quer observar e o delay que voce quer que ele espere para executar a função
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
