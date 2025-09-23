import React from 'react'
import clsx from 'clsx'
import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { DragDropContext,Droppable,Draggable } from '@hello-pangea/dnd'
// import { DragDropContext } from 'react-beautiful-dnd'
export default function AddQuestionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
      function handleClose() {
        close(!open)
    }
    const [items,setItems] = React.useState([
        {id:'1',content:'First task'},
        {id:'2',content:'Second task'},
        {id:'3',content:'Third task'},
        {id:'4',content:'four task'},
        {id:'5',content:'five task'},
        {id:'6',content:'six task'},
    ])
  return (
    <AppDialog open={open}>
        <div className="flex overflow-y-auto bg-[#f0f2f5] rounded-md flex-col  gap-2 ">
            <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                <h2 className='text-2xl'>Add Question</h2>
            </div>
            <div className="p-2">

            <ResponsiveContainer className='rounded-md p-4'>
                <form action="" className="flex flex-col gap-4">
                     <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>QUESTION <span className="text-red-500">*</span></label>
                        <textarea placeholder='Type your question here' required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' name="" id=""/>
                    </div>
                   <DragDropContext onDragEnd={()=>{}}>
                    <Droppable droppableId='questions'>
                       {
                        (provided,snapshot)=>(
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((item,index)=><Draggable key={item.id} index={index} draggableId={item.id}>
                                    {(provided,snapshot)=><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{item.content}</div>}
                                </Draggable>)}
                                {provided.placeholder}
                            </div>
                        )
                       } 
                    </Droppable>
                   </DragDropContext>
                   <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>QUESTION DIFFICULTY <span className="text-red-500">*</span></label>
                        <select className='outline-none p-2 border border-[#D0D5DD] rounded-lg' name="" id="">
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        {/* <textarea placeholder='Type your question here' required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' name="" id=""/> */}
                    </div>
                      <div className="flex gap-2 mt-4 w-full">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                                        >
                                            CANCEL
                                        </button>
                                        <button         
                                            className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]" )}
                                        >
                                        CREATE EXAM SESSION
                                        </button>
                                    </div>
                </form>
            </ResponsiveContainer>
            </div>
        </div>
    </AppDialog>
  )
}
