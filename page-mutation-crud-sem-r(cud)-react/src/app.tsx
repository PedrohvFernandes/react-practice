import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'

import * as Dialog from '@radix-ui/react-dialog'

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

  const urlFilter = searchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(urlFilter)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: tagasResponse, isLoading } = useQuery<TagResponse>({
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`
      )
      const data = await response.json()

      await new Promise(resolve => setTimeout(resolve, 2000))

      return data
    },
    queryKey: [`get-tags-${page}`, urlFilter],

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60
  })

  function handleFilterTags() {
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)
      return params
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Dialog.Root>
            <Button variant="primary">
              <Plus className="size-3" />
              Create New
            </Button>
          </Dialog.Root>
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
