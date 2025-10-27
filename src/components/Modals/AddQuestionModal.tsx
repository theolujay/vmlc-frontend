import React, { useState } from "react"
import clsx from "clsx"
import AppDialog from "@/components/ui/Modals/AppDialog"
import ResponsiveContainer from "@/components/ui/ResponsiveContainer"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import useCreateQuestion from "@/hooks/useCreateQuestion"
import { FormProvider } from "react-hook-form"
import Spinner from "../ui/spinner/spinner"

export default function AddQuestionModal({
  open,
  close,
}: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
  function handleClose() {
    close(!open)
  }


  const { onSubmit, isPending, form } = useCreateQuestion(handleClose)

  // options state
  const [options, setOptions] = useState([
    { id: "1", label: "Option A",value:"A", answer: "", type: "" },
    { id: "2", label: "Option B",value:"B", answer: "", type: "" },
    { id: "3", label: "Option C",value:"C", answer: "", type: "" },
    { id: "4", label: "Option D",value:"D", answer: "", type: "" },
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
            <FormProvider {...form}>

              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
               
                <div className="flex flex-col">
                  <label htmlFor="exam" className="mb-1">
                    QUESTION <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...form.register("text")}
                    placeholder="Type your question here"
                    required
                    className="border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg"
                    id="exam"
                  />
                </div>

                
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

                             
                                <div className="flex flex-col flex-1">
                                  <label className="text-sm font-medium">
                                    {opt.label} <span className="text-red-500">*</span>
                                  </label>
                                  <input

                                    {...form.register(
                                      index === 0
                                        ? "option_a"
                                        : index === 1
                                          ? "option_b"
                                          : index === 2
                                            ? "option_c"
                                            : "option_d"
                                    )}
                                    type="text"
                                    value={opt.answer}
                                    onChange={(e) =>
                                      handleChange(opt.id, "answer", e.target.value)
                                    }
                                    placeholder="Enter answer"
                                    className="p-2 border border-[#D0D5DD] rounded-lg"
                                  />
                                </div>

                                
                                <div className="flex flex-col w-40">
                                  <label htmlFor="select-form" className="text-sm font-medium">
                                    OPTION TYPE
                                  </label>
                                  {/* <select

                                    {...form.register("correct_answer")}
                                    id="select-form"
                                    defaultValue="wrong"
                                    value={opt.type}
                                    onChange={(e) =>
                                      handleChange(opt.id, "type", e.target.value)
                                    }
                                    className="p-2 border border-[#D0D5DD] rounded-lg"
                                  >
                                    <option value="">Select option type</option>
                                    <option value="correct">Correct</option>
                                    <option value="wrong">Wrong</option>
                                  </select> */}
                                  <select
  id="select-form"
  value={opt.type}
  onChange={(e) => {
    const value = e.target.value;
    // If selecting "correct", make sure only one option is correct
    if (value === "correct") {
      setOptions((prev) =>
        prev.map((o) =>
          o.id === opt.id ? { ...o, type: "correct" } : { ...o, type: "wrong" }
        )
      );
      // also set it in the form
      form.setValue("correct_answer", opt.value);
    } else {
      handleChange(opt.id, "type", value);
    }
  }}
  className="p-2 border border-[#D0D5DD] rounded-lg"
>
  <option value="">Select option type</option>
  <option value="correct">Correct</option>
  <option value="wrong">Wrong</option>
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

                
                <div className="flex flex-col">
                  <label htmlFor="difficulty" className="mb-1">
                    QUESTION DIFFICULTY <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...form.register("difficulty")}
                    id="difficulty"
                    className="outline-none p-2 border border-[#D0D5DD] rounded-lg"
                  >
                    <option value="">Select question difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

              
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
                    {isPending?<Spinner/>:
                    'ADD QUESTION'
                    }
                  </button>
                </div>
              </form>
            </FormProvider>
          </ResponsiveContainer>
        </div>
      </div>
    </AppDialog>
  )
}
