"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Wand2, Trash2, Edit, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import MagicCursor from "@/components/magic-cursor"

// Tipo para as tarefas
type Tarefa = {
  id: number
  texto: string
  concluida: boolean
  casa: "grifinoria" | "sonserina" | "corvinal" | "lufa-lufa"
}

export default function Home() {
  // Estado para armazenar as tarefas
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    // Carregar tarefas do localStorage se disponível
    if (typeof window !== "undefined") {
      const salvas = localStorage.getItem("harry-potter-tarefas")
      return salvas ? JSON.parse(salvas) : []
    }
    return []
  })

  const [novaTarefa, setNovaTarefa] = useState("")
  const [casaSelecionada, setCasaSelecionada] = useState<"grifinoria" | "sonserina" | "corvinal" | "lufa-lufa">(
    "grifinoria",
  )
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null)
  const [textoEditado, setTextoEditado] = useState("")
  const [showMagic, setShowMagic] = useState(false)
  const { toast } = useToast()

  // Salvar tarefas no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem("harry-potter-tarefas", JSON.stringify(tarefas))
  }, [tarefas])

  // Adicionar nova tarefa
  const adicionarTarefa = () => {
    if (novaTarefa.trim() === "") return

    const novaTarefaObj: Tarefa = {
      id: Date.now(),
      texto: novaTarefa,
      concluida: false,
      casa: casaSelecionada,
    }

    setTarefas([...tarefas, novaTarefaObj])
    setNovaTarefa("")

    // Mostrar animação de magia
    setShowMagic(true)
    setTimeout(() => setShowMagic(false), 1500)

    // Mostrar toast
    toast({
      title: "Feitiço adicionado!",
      description: `"${novaTarefa}" foi adicionado à sua lista.`,
    })
  }

  // Alternar status de conclusão da tarefa
  const alternarConclusao = (id: number) => {
    const tarefa = tarefas.find((t) => t.id === id)
    const novoStatus = tarefa ? !tarefa.concluida : false

    setTarefas(tarefas.map((tarefa) => (tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa)))

    if (novoStatus) {
      // Mostrar animação de magia quando concluir
      setShowMagic(true)
      setTimeout(() => setShowMagic(false), 1500)

      // Mostrar toast
      toast({
        title: "Feitiço concluído!",
        description: "Muito bem! Você completou uma tarefa.",
        variant: "success",
      })
    }
  }

  // Excluir tarefa
  const excluirTarefa = (id: number) => {
    const tarefaExcluida = tarefas.find((t) => t.id === id)
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id))

    toast({
      title: "Feitiço removido",
      description: tarefaExcluida ? `"${tarefaExcluida.texto}" foi removido da sua lista.` : "Uma tarefa foi removida.",
      variant: "destructive",
    })
  }

  // Iniciar edição de tarefa
  const iniciarEdicao = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa)
    setTextoEditado(tarefa.texto)
  }

  // Salvar edição de tarefa
  const salvarEdicao = () => {
    if (!tarefaEditando || textoEditado.trim() === "") return

    setTarefas(tarefas.map((tarefa) => (tarefa.id === tarefaEditando.id ? { ...tarefa, texto: textoEditado } : tarefa)))

    setTarefaEditando(null)

    toast({
      title: "Feitiço atualizado",
      description: "As alterações foram salvas com sucesso.",
    })
  }

  // Obter cor da casa
  const corCasa = (casa: string) => {
    switch (casa) {
      case "grifinoria":
        return "from-red-600 to-yellow-500"
      case "sonserina":
        return "from-green-600 to-emerald-400"
      case "corvinal":
        return "from-blue-600 to-sky-400"
      case "lufa-lufa":
        return "from-yellow-600 to-amber-400"
      default:
        return "from-red-600 to-yellow-500"
    }
  }

  // Obter nome da casa em português
  const nomeCasa = (casa: string) => {
    switch (casa) {
      case "grifinoria":
        return "Grifinória"
      case "sonserina":
        return "Sonserina"
      case "corvinal":
        return "Corvinal"
      case "lufa-lufa":
        return "Lufa-Lufa"
      default:
        return "Grifinória"
    }
  }

  // Filtrar tarefas por status
  const tarefasPendentes = tarefas.filter((tarefa) => !tarefa.concluida)
  const tarefasConcluidas = tarefas.filter((tarefa) => tarefa.concluida)

  return (
    <main className="min-h-screen bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Harry%20Potter%20wallpaper%20hd-fXMXpMfUEO3s0GSeKyq3J4xvy2wfBq.jpeg')] bg-cover bg-center bg-fixed cursor-none">
      {/* Cursor personalizado de varinha */}
      <MagicCursor />

      {/* Animação de partículas mágicas */}
      <AnimatePresence>{showMagic && <MagicParticles />}</AnimatePresence>

      <div className="container mx-auto py-8 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-4xl mx-auto backdrop-blur-md bg-black/40 text-white border border-amber-500/30 shadow-xl shadow-amber-500/10 rounded-xl overflow-hidden">
            <CardHeader className="text-center border-b border-amber-500/20 pb-4 bg-gradient-to-b from-amber-500/20 to-transparent">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
                className="relative"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hp%281%29%281%29.jpg-hy2qVuXA7lBQgyTsuwh3raFAOJ9eFq.jpeg"
                  alt="Harry Potter, Hermione e Ron"
                  width={1200}
                  height={400}
                  className="w-full h-auto mx-auto mb-4 rounded-lg shadow-lg shadow-amber-500/20 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg w-full"></div>
              </motion.div>
              <CardTitle className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Lista de Feitiços e Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    type="text"
                    placeholder="Adicione um novo feitiço ou tarefa..."
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
                    className="flex-1 bg-gray-800/60 border-amber-500/30 text-white placeholder:text-gray-400 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300"
                  />

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 transition-all duration-300"
                        >
                          Casa
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900/95 backdrop-blur-md border-amber-500/50 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 text-center">
                            Escolha uma Casa
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Button
                            className={`bg-gradient-to-r from-red-600 to-yellow-500 hover:opacity-90 transition-all duration-300 ${casaSelecionada === "grifinoria" ? "ring-2 ring-white" : ""}`}
                            onClick={() => setCasaSelecionada("grifinoria")}
                          >
                            Grifinória
                          </Button>
                          <Button
                            className={`bg-gradient-to-r from-green-600 to-emerald-400 hover:opacity-90 transition-all duration-300 ${casaSelecionada === "sonserina" ? "ring-2 ring-white" : ""}`}
                            onClick={() => setCasaSelecionada("sonserina")}
                          >
                            Sonserina
                          </Button>
                          <Button
                            className={`bg-gradient-to-r from-blue-600 to-sky-400 hover:opacity-90 transition-all duration-300 ${casaSelecionada === "corvinal" ? "ring-2 ring-white" : ""}`}
                            onClick={() => setCasaSelecionada("corvinal")}
                          >
                            Corvinal
                          </Button>
                          <Button
                            className={`bg-gradient-to-r from-yellow-600 to-amber-400 hover:opacity-90 transition-all duration-300 ${casaSelecionada === "lufa-lufa" ? "ring-2 ring-white" : ""}`}
                            onClick={() => setCasaSelecionada("lufa-lufa")}
                          >
                            Lufa-Lufa
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={adicionarTarefa}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 text-black font-medium transition-all duration-300"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="todas" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6 bg-gray-800/60 rounded-lg overflow-hidden">
                    <TabsTrigger
                      value="todas"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-400 data-[state=active]:text-black transition-all duration-300"
                    >
                      Todas ({tarefas.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pendentes"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-400 data-[state=active]:text-black transition-all duration-300"
                    >
                      Pendentes ({tarefasPendentes.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="concluidas"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-400 data-[state=active]:text-black transition-all duration-300"
                    >
                      Concluídas ({tarefasConcluidas.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="todas" className="mt-0">
                    <ListaTarefas
                      tarefas={tarefas}
                      alternarConclusao={alternarConclusao}
                      excluirTarefa={excluirTarefa}
                      iniciarEdicao={iniciarEdicao}
                      corCasa={corCasa}
                      nomeCasa={nomeCasa}
                    />
                  </TabsContent>

                  <TabsContent value="pendentes" className="mt-0">
                    <ListaTarefas
                      tarefas={tarefasPendentes}
                      alternarConclusao={alternarConclusao}
                      excluirTarefa={excluirTarefa}
                      iniciarEdicao={iniciarEdicao}
                      corCasa={corCasa}
                      nomeCasa={nomeCasa}
                    />
                  </TabsContent>

                  <TabsContent value="concluidas" className="mt-0">
                    <ListaTarefas
                      tarefas={tarefasConcluidas}
                      alternarConclusao={alternarConclusao}
                      excluirTarefa={excluirTarefa}
                      iniciarEdicao={iniciarEdicao}
                      corCasa={corCasa}
                      nomeCasa={nomeCasa}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Diálogo de edição */}
              {tarefaEditando && (
                <Dialog open={!!tarefaEditando} onOpenChange={(open) => !open && setTarefaEditando(null)}>
                  <DialogContent className="bg-gray-900/95 backdrop-blur-md border-amber-500/50 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                        Editar Tarefa
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        className="bg-gray-800/60 border-amber-500/30 text-white focus:ring-amber-400 focus:border-amber-400"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setTarefaEditando(null)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={salvarEdicao}
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 text-black transition-all duration-300"
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}

// Componente para a lista de tarefas
function ListaTarefas({
  tarefas,
  alternarConclusao,
  excluirTarefa,
  iniciarEdicao,
  corCasa,
  nomeCasa,
}: {
  tarefas: Tarefa[]
  alternarConclusao: (id: number) => void
  excluirTarefa: (id: number) => void
  iniciarEdicao: (tarefa: Tarefa) => void
  corCasa: (casa: string) => string
  nomeCasa: (casa: string) => string
}) {
  if (tarefas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8 border border-dashed border-amber-500/30 rounded-lg backdrop-blur-sm bg-black/20"
      >
        <Wand2 className="mx-auto h-12 w-12 text-amber-500/50 mb-2" />
        <p className="text-amber-400">Nenhuma tarefa encontrada. Adicione um novo feitiço!</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      <ul className="space-y-3">
        {tarefas.map((tarefa) => (
          <motion.li
            key={tarefa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            whileHover={{ scale: 1.01 }}
            className="backdrop-blur-md bg-gray-800/40 rounded-lg p-4 border-l-4 border-amber-500/70 flex items-center justify-between gap-2 shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => alternarConclusao(tarefa.id)}
                className="h-8 w-8 rounded-full text-white hover:text-amber-400 hover:bg-transparent transition-all duration-300"
              >
                {tarefa.concluida ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-gray-400" />
                )}
              </Button>

              <span className={`flex-1 ${tarefa.concluida ? "line-through text-gray-500" : "text-white"}`}>
                {tarefa.texto}
              </span>

              <Badge className={`bg-gradient-to-r ${corCasa(tarefa.casa)} text-white font-medium px-3 py-1`}>
                {nomeCasa(tarefa.casa)}
              </Badge>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => iniciarEdicao(tarefa)}
                className="h-8 w-8 text-amber-400 hover:bg-amber-500/20 transition-all duration-300"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => excluirTarefa(tarefa.id)}
                className="h-8 w-8 text-red-400 hover:bg-red-500/20 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  )
}

// Componente de partículas mágicas
function MagicParticles() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: "50vw",
            y: "50vh",
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "easeOut",
          }}
        >
          <Sparkles
            className="text-amber-400"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
