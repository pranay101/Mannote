import Canvas from "@/src/Canvas/Canvas"
type Props = {}

const page = (props: Props) => {
  return (
    <main className='h-screen w-screen bg-gray-100 grid overflow-hidden'>
        <section className="w-full h-16 bg-gray-800 flex justify-center items-center">
           <h1 contentEditable suppressContentEditableWarning className="text-white text-lg focus:outline-none focus:border-b focus:border-b-gray-400">Mood Board Title</h1>
        </section>
        <section className="flex h-full w-full overflow-hidden">
            <Canvas />
        </section>
    </main>
  )
}

export default page