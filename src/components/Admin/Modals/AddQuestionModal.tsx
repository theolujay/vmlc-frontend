// import React from 'react'
// import clsx from 'clsx'
// import AppDialog from '@/components/ui/Modals/AppDialog'
// import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
// import { DragDropContext,Droppable,Draggable } from '@hello-pangea/dnd'
// // import { DragDropContext } from 'react-beautiful-dnd'
// export default function AddQuestionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
//       function handleClose() {
//         close(!open)
//     }



//     const [items,setItems] = React.useState([
//         {id:'1',content:'First task'},
//         {id:'2',content:'Second task'},
//         {id:'3',content:'Third task'},
//         {id:'4',content:'four task'},
//         {id:'5',content:'five task'},
//         {id:'6',content:'six task'},
//     ])


//     function onDragEnd(result:any){
//         if(!result.destination) return;
//         const newItems = Array.from(items);
//         const [reorderedItem] = newItems.splice(result.source.index,1);
//         newItems.splice(result.destination.index,0,reorderedItem);
//         setItems(newItems);
//     }
//   return (
//     <AppDialog open={open}>
//         <div className="flex overflow-y-auto bg-[#f0f2f5] rounded-md flex-col  gap-2 ">
//             <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
//                 <h2 className='text-2xl'>Add Question</h2>
//             </div>
//             <div className="p-2">

//             <ResponsiveContainer className='rounded-md p-4'>
//                 <form action="" className="flex flex-col gap-4">
//                      <div className="flex flex-col">
//                         <label htmlFor="exam" className='mb-1'>QUESTION <span className="text-red-500">*</span></label>
//                         <textarea placeholder='Type your question here' required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' name="" id=""/>
//                     </div>
//                    <DragDropContext onDragEnd={onDragEnd}>
//                     <Droppable droppableId='questions'>
//                        {
//                         (provided,snapshot)=>(
//                             <div {...provided.droppableProps} ref={provided.innerRef}>
//                                 {items.map((item,index)=><Draggable key={item.id} index={index} draggableId={item.id}>
//                                     {(provided,snapshot)=><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{item.content}</div>}
//                                 </Draggable>)}
//                                 {provided.placeholder}
//                             </div>
//                         )
//                        } 
//                     </Droppable>
//                    </DragDropContext>
//                    <div className="flex flex-col">
//                         <label htmlFor="exam" className='mb-1'>QUESTION DIFFICULTY <span className="text-red-500">*</span></label>
//                         <select className='outline-none p-2 border border-[#D0D5DD] rounded-lg' name="" id="">
//                             <option value="Easy">Easy</option>
//                             <option value="Medium">Medium</option>
//                             <option value="Hard">Hard</option>
//                         </select>
//                         {/* <textarea placeholder='Type your question here' required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' name="" id=""/> */}
//                     </div>
//                       <div className="flex gap-2 mt-4 w-full">
//                                         <button
//                                             onClick={handleClose}
//                                             className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
//                                         >
//                                             CANCEL
//                                         </button>
//                                         <button         
//                                             className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]" )}
//                                         >
//                                         CREATE EXAM SESSION
//                                         </button>
//                                     </div>
//                 </form>
//             </ResponsiveContainer>
//             </div>
//         </div>
//     </AppDialog>
//   )
// }










// import React from "react"
// import clsx from "clsx"
// import AppDialog from "@/components/ui/Modals/AppDialog"
// import ResponsiveContainer from "@/components/ui/ResponsiveContainer"
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd"

// export default function AddQuestionModal({
//   open,
//   close,
// }: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
//   function handleClose() {
//     close(!open)
//   }

//   const [items, setItems] = React.useState([
//     { id: "1", content: "First task" },
//     { id: "2", content: "Second task" },
//     { id: "3", content: "Third task" },
//     { id: "4", content: "Fourth task" },
//     { id: "5", content: "Fifth task" },
//     { id: "6", content: "Sixth task" },
//   ])

//   // helper to reorder array
//   const reorder = (list: typeof items, startIndex: number, endIndex: number) => {
//     const result = Array.from(list)
//     const [removed] = result.splice(startIndex, 1)
//     result.splice(endIndex, 0, removed)
//     return result
//   }

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return // dropped outside the list
//     const reordered = reorder(items, result.source.index, result.destination.index)
//     setItems(reordered)
//   }

//   return (
//     <AppDialog open={open}>
//       <div className="flex overflow-y-auto max-h-[80vh]  bg-[#f0f2f5] rounded-md flex-col gap-2">
//         <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
//           <h2 className="text-2xl">Add Question</h2>
//         </div>
//         <div className="p-2">
//           <ResponsiveContainer className="rounded-md p-4">
//             <form action="" className="flex flex-col gap-4">
//               {/* Question text */}
//               <div className="flex flex-col">
//                 <label htmlFor="exam" className="mb-1">
//                   QUESTION <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   placeholder="Type your question here"
//                   required
//                   className="border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg"
//                   id="exam"
//                 />
//               </div>

//               {/* Draggable list */}
//               <DragDropContext onDragEnd={handleDragEnd}>
//                 <Droppable droppableId="questions">
//                   {(provided) => (
//                     <div
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       className="flex flex-col gap-2"
//                     >
//                       {items.map((item, index) => (
//                         <Draggable
//                           key={item.id}
//                           draggableId={item.id}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className={clsx(
//                                 "p-3 rounded-md border bg-white shadow-sm",
//                                 snapshot.isDragging && "bg-blue-100"
//                               )}
//                             >
//                               {item.content}
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </DragDropContext>

//               {/* Question difficulty */}
//               <div className="flex flex-col">
//                 <label htmlFor="difficulty" className="mb-1">
//                   QUESTION DIFFICULTY <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="difficulty"
//                   className="outline-none p-2 border border-[#D0D5DD] rounded-lg"
//                 >
//                   <option value="Easy">Easy</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Hard">Hard</option>
//                 </select>
//               </div>

//               {/* Buttons */}
//               <div className="flex gap-2 mt-4 w-full">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
//                 >
//                   CANCEL
//                 </button>
//                 <button
//                   type="submit"
//                   className={clsx(
//                     "px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]"
//                   )}
//                 >
//                   CREATE EXAM SESSION
//                 </button>
//               </div>
//             </form>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </AppDialog>
//   )
// }



import React from "react"
import clsx from "clsx"
import AppDialog from "@/components/ui/Modals/AppDialog"
import ResponsiveContainer from "@/components/ui/ResponsiveContainer"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"

export default function AddQuestionModal({
  open,
  close,
}: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
  function handleClose() {
    close(!open)
  }

  // options state
  const [options, setOptions] = React.useState([
    { id: "1", label: "Option A", answer: "", type: "" },
    { id: "2", label: "Option B", answer: "", type: "" },
    { id: "3", label: "Option C", answer: "", type: "" },
    { id: "4", label: "Option D", answer: "", type: "" },
  ])

  const reorder = (
    list: typeof options,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = reorder(options, result.source.index, result.destination.index)
    setOptions(reordered)
  }

  const handleChange = (id: string, field: "answer" | "type", value: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    )
  }

  return (
    <AppDialog open={open}>
      <div className="flex overflow-y-auto max-h-[80vh] w-[40vw] bg-[#f0f2f5] rounded-md flex-col gap-2">
        <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
          <h2 className="text-2xl">Add Question</h2>
        </div>
        <div className="p-2">
          <ResponsiveContainer className="rounded-md overflow-hidden p-4">
            <form action="" className="flex flex-col gap-4">
              {/* Question text */}
              <div className="flex flex-col">
                <label htmlFor="exam" className="mb-1">
                  QUESTION <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Type your question here"
                  required
                  className="border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg"
                  id="exam"
                />
              </div>

              {/* Options with drag-drop */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="options">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col relative gap-2"
                    >
                      {options.map((opt, index) => (
                        <Draggable
                          key={opt.id}
                          draggableId={opt.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={clsx(
                                "flex items-center gap-2 p-2 rounded-md  bg-white shadow-sm",
                                snapshot.isDragging && "bg-blue-100"
                              )}
                            >
                              {/* Drag handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab px-2 text-gray-400"
                              >
                                ⋮⋮
                              </div>

                              {/* Option input */}
                              <div className="flex flex-col flex-1">
                                <label className="text-sm font-medium">
                                  {opt.label} <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={opt.answer}
                                  onChange={(e) =>
                                    handleChange(opt.id, "answer", e.target.value)
                                  }
                                  placeholder="Enter answer"
                                  className="p-2 border border-[#D0D5DD] rounded-lg"
                                />
                              </div>

                              {/* Option type */}
                              <div className="flex flex-col w-40">
                                <label className="text-sm font-medium">
                                  OPTION TYPE
                                </label>
                                <select
                                  value={opt.type}
                                  onChange={(e) =>
                                    handleChange(opt.id, "type", e.target.value)
                                  }
                                  className="p-2 border border-[#D0D5DD] rounded-lg"
                                >
                                  <option value="">Select option type</option>
                                  <option value="correct">Correct</option>
                                  <option value="incorrect">Incorrect</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Question difficulty */}
              <div className="flex flex-col">
                <label htmlFor="difficulty" className="mb-1">
                  QUESTION DIFFICULTY <span className="text-red-500">*</span>
                </label>
                <select
                  id="difficulty"
                  className="outline-none p-2 border border-[#D0D5DD] rounded-lg"
                >
                  <option value="">Select question difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className={clsx(
                    "px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]"
                  )}
                >
                  ADD QUESTION
                </button>
              </div>
            </form>
          </ResponsiveContainer>
        </div>
      </div>
    </AppDialog>
  )
}
