import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'

import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './components/ui/table'
import { Pagination } from './components/pagination'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
// import useDebounceValue from './hooks/use-debounce-value'

// Pra saber o retorno, basta pegar o retorno no console log e jogar nesse site https://transform.tools/json-to-typescript que ele ja vai te falar o type de cada informação do object
export interface TagResponse {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amountOfVideos: number
  id: string
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Se eu tiver filter na minha url eu pego o valor, se não eu seto uma string vazia
  const urlFilter = searchParams.get('filter') ?? ''

  // Ja passo o valor inicial do input como o valor que esta na url. Estado para filtrar no campo do input, passando para a função de filtro
  const [filter, setFilter] = useState(urlFilter)

  // const debounceFilter = useDebounceValue(filter, 1000)

  // Se eu eu tiver page na minha url eu pego o valor, se não eu seto 1
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  // Data é o que eu quero que seja retornado da minha query
  // isLoading é uma variavel que me diz se a minha query está carregando ou não
  // React query possui o onFocus, que é uma função que é chamada toda vez que a pagina é focada, ou seja, toda vez que eu mudo de pagina, ele vai fazer uma nova requisição
  // React query é totalmente SWR
  const { data: tagasResponse, isLoading } = useQuery<TagResponse>({
    // Aqui é a onde eu devolvo os dados da minha query
    queryFn: async () => {
      // Essa rota é uma rota fake que criei para simular uma requisição http. Através de um json(sever.json). Basta criar um objeto de array com objetos dentro, instalar o json-server e rodar o comando npm run server. o Array vira uma rota no caso "tags". O json-server possui um sistema de paginação. pagina 1(a quantidade de paginas vai de acordo com a quantidade que voce tiver, se eu for de 10 em 10 terei 20 paginas) e 10 itens por page
      // Fazendo filtro por titulo, que no caso é um campo do meu objeto
      const response = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`
      )
      const data = await response.json()

      // Simulando um delay de 2 segundos para a requisição, para ver a realidade de uma requisição http
      // await new Promise(resolve => setTimeout(resolve, 2000))

      // https://transform.tools
      console.log(data)
      return data
    },
    // queryKey é um array onde passamos como se fosse um id para cada query http que fizermos na nossa aplicação. A lib salva em cache do navegador do user uma representação(query de dados) de cada pagina, por isso se eu tiver o mesmo id para todas as paginas, ela vai achar que não esta mudando as informações, porque ele esta pegando os mesmos caches desse id
    // queryKey: ['get-tags']

    // Por isso eu passo o page como parametro, para que a cada pagina que eu for, a queryKey mude e a lib entenda que é uma nova pagina, gerando um novo cache com novas informações, sendo armazenado essas infos em cada key que foi gerada com base no numero da pagina, ex: get-tags-1, get-tags-2, get-tags-3...
    // urlFilter vai gerar uma nova key toda vez que eu digitar algo no input, fazendo com que a lib entenda que é uma nova requisição
    queryKey: [`get-tags-${page}`, urlFilter],

    // Isso faz com que não pisque, parecendo ser algo natural, so vai para a proxima pagina quando as infos da proxima pagina estiver carregada
    placeholderData: keepPreviousData,
    // é o tempo que vai ter pra limpar o cache e fazer uma nova requisição, no caso 10 minutos
    staleTime: 1000 * 60 // 1 minute
  })

  // Função que vai ser chamada toda vez que eu clicar no botão de filtro. Ela vai setar o valor do input na url e a pagina para 1
  function handleFilterTags() {
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)
      return params
    })
  }

  if (isLoading) {
    // Basicamente aqui não mostraria nada em tela enquanto na carregasse as informações
    return null
  }

  return (
    // space-y-8 faz com que os elementos filhos tenham um espaçamento de 2rem
    // O tailwind usa multiplo de 4 para espaçamento e tamanho
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant="primary">
            <Plus className="size-3" />
            Create New
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={event => setFilter(event.target.value)}
                value={filter}
              />
            </Input>

            <Button onClick={handleFilterTags}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tagasResponse?.data.map((tag, tagIndex) => {
              return (
                <TableRow key={`${tagIndex}-${tag.id}`}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos > 1 ? 'videos' : 'video'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {/* {
              // Array.from({ length: 10 }) cria um array com 10 posições
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">React</span>
                      <span className="text-xs text-zinc-500">
                        2f9b282e-58be-4ee7-b091-b42047fbc114
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">13 video(s)</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            } */}
            {/* <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">React</span>
                  <span className="text-xs text-zinc-500">
                    2f9b282e-58be-4ee7-b091-b42047fbc114
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-zinc-300">13 video(s)</TableCell>
              <TableCell className='text-right'>
                <Button size='icon'>
                  <MoreHorizontal className='size-4'/>
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">React</span>
                  <span className="text-xs text-zinc-500">
                    2f9b282e-58be-4ee7-b091-b42047fbc114
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-zinc-300">13 video(s)</TableCell>
              <TableCell className='text-right'>
                <Button size='icon'>
                  <MoreHorizontal className='size-4'/>
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">React</span>
                  <span className="text-xs text-zinc-500">
                    2f9b282e-58be-4ee7-b091-b42047fbc114
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-zinc-300">13 video(s)</TableCell>
              <TableCell className='text-right'>
                <Button size='icon'>
                  <MoreHorizontal className='size-4'/>
                </Button>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>

        {tagasResponse && (
          <Pagination
            pages={tagasResponse.pages}
            items={tagasResponse.items}
            page={page}
          />
        )}
      </main>
    </div>
  )
}
