import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'

// Search parms nada mais é que os parametros que estão na URL depois da interrogação. Dessa maneira conseguimos fazer a paginação, e pegar o estado da URL(State url)
import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

interface PaginationProps {
  pages: number
  items: number
  page: number
}

export function Pagination({ items, page, pages }: PaginationProps) {
  // const [searchParams, setSearchParams] = useSearchParams()
  const [, setSearchParams] = useSearchParams()

  const LIMITPAGEINCREMENT = page + 1 > pages

  const LIMITPAGEDECREMENT = page - 1 <= 0

  // Eu quero que o usuario clique no botão e ele vá para a primeira pagina
  function firstPage() {
    setSearchParams(params => {
      // Setamos o param page para 1. Ex: http://localhost:5173/?page=1
      params.set('page', '1')

      return params
    })
  }

  function previousPage() {
    // Se a pagina for menor ou igual a 0, não faz nada
    if (LIMITPAGEDECREMENT) {
      return
    }

    // Se não, setamos o param page para a pagina atual - 1. Ex: http://localhost:5173/?page=2 da 2 para 1
    setSearchParams(params => {
      params.set('page', String(page - 1))

      return params
    })
  }

  function nextPage() {
    // Se a pagina for maior ou igual a pagina total, não faz nada
    if (LIMITPAGEINCREMENT) {
      return
    }

    // Se não, setamos o param page para a pagina atual + 1. Ex: http://localhost:5173/?page=2 da 2 para 3
    setSearchParams(params => {
      params.set('page', String(page + 1))

      return params
    })
  }

  function lastPage() {
    // Vai para a ultima pagina que é o total de paginas que eu possuo
    setSearchParams(params => {
      params.set('page', String(pages))

      return params
    })
  }

  return (
    <div className="flex text-sm items-center justify-between text-zinc-500">
      <span>Showing 10 of {items} items</span>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>

          <Select defaultValue="10">
            <SelectTrigger aria-label="Page" />
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>
          {/* 
            Ex: Page 1 of 3
          */}
          Page {page} of {pages}
        </span>

        <div className="space-x-1.5">
          <Button onClick={firstPage} size="icon" disabled={LIMITPAGEDECREMENT}>
            <ChevronsLeft className="size-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            onClick={previousPage}
            size="icon"
            disabled={LIMITPAGEDECREMENT}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button onClick={nextPage} size="icon" disabled={LIMITPAGEINCREMENT}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button onClick={lastPage} size="icon" disabled={LIMITPAGEINCREMENT}>
            <ChevronsRight className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
