import { Check, Loader2, X } from 'lucide-react'
// Lib para forms
import { useForm } from 'react-hook-form'
// Validador de informações
import { z } from 'zod'
// Integração do zod com o react hook form
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './button'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Aqui dita qual é o formato dos campos do meu formulario. Recebendo um objeto com a tipagem e as validações
const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters.' })
})

// Criando uma inferência, criar uma tipagem a partir de uma variavel existente.
// Essa tipagem vai tanto para o form, com isso nos register vou saber o que colocar; vai para a função que cria a tag
type CreateTagSchema = z.infer<typeof createTagSchema>

function getSlugFromString(input: string = ''): string {
  const inputFormatted = input
    //  Normalize tira toda parte de acentos. o normalize separa os acentos das letras, cada um em um caractere
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // Faz replace tudo o que não são palavras
    .replace(/[^\w\s]/g, '')
    // E tudo que são espaços ele coloca um hífen
    .replace(/\s+/g, '-')
  return inputFormatted
}

export function CreateTagForm() {
  // O query client é um objeto que possui metodos
  const queryClient = useQueryClient()

  // Essa função recebe o resolver, o resolver diz basicamente para o form qual estrategia de validação vamos usar
  // Pegamos duas funções, a register e a handleSubmit, a register basicamente so registra os campos inputs, dizendo que esses inputs pertencem a determinado formulário, a handleSubmit é a função que vai ser usada para dar submit no forms
  // O watch serve para observar as mudanças
  // O formState é o estado do form, por exemplo se ele foi enviado: formState.isSubmitting, ou erros...
  const { register, handleSubmit, watch, formState } = useForm<CreateTagSchema>(
    {
      resolver: zodResolver(createTagSchema)
    }
  )

  // O watch vai ficar observando o campo name, so que o diferente que agora o name vai ficar formatado de maneira correta por conta da função de formatação
  const slug = watch('title') ? getSlugFromString(watch('title')) : ''

  // O useMutation do react-query vai revalidar o cache da pagina, executando nossa função de criar uma tag nova
  const { mutateAsync } = useMutation({
    mutationFn: async ({ title }: CreateTagSchema) => {
      // delay 2s para simular um api de verdade
      await new Promise(resolve => setTimeout(resolve, 2000))

      await fetch('http://localhost:3333/tags', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug,
          amountOfVideos: 0
        })
      })
    },
    onSuccess: () => {
      // A listagem de cache do react-query é global para toda a aplicação, então é necessário fazer isso:
      // Usaremos a função de invalidação, que os dados retornados pela minha aplicação não são mais validos, e a partir do momento que eu falo que não é mais valido ele atualiza sozinho. Eu passo a tag que eu quero atualizar, e mesmo que você não passe os demais caches(campos, query-keys) como urlFilter, page, ele invalida todos os caches de todas as paginas(query-keys, campos, filtros)
      queryClient.invalidateQueries({
        queryKey: ['get-tags']
        // So não passar o exact como true, que por padrão é false ele vai ignorar as demais keys
        // exact:true
      })
    }
  })

  async function createTag({ title }: CreateTagSchema) {
    // O mutateAsync so chama a função que esta dentro dele
    await mutateAsync({ title })
  }

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit(createTag)}>
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="title">
          Tag Name
        </label>
        <input
          {...register('title')}
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full"
          id="title"
          type="text"
        />
        {formState.errors?.title && (
          <p className="text-sm text-red-400">
            {formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {/* 
          Slug é representação unica de titulo um texto ou algo assim para ser usada na url, enquanto no nome voce pode colocar espaço, símbolos...
        */}
        <label className="text-sm font-medium block" htmlFor="slug">
          Slug
        </label>
        {/* 
          o readOnly não deixa o usuario preencher, irei gerar automaticamente ele a partir do nome da tag
        */}
        <input
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full"
          id="slug"
          type="text"
          value={slug}
          readOnly
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button">
            <X className="size-3" />
            cancel
          </Button>
        </Dialog.Close>

        <Button
          disabled={formState.isSubmitting}
          className="bg-teal-400 text-teal-950"
          type="submit"
        >
          {formState.isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  )
}
