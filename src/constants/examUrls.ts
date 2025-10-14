export const examUrls={
    take_exam:(id:number)=>`/exams/${id}/take-exam/`,
    create_exam:'/exams/',
    list_exams:'/exams/',
    VIEW_QUESTIONS:(exam_id:number)=>`/exams/${exam_id}/questions/`
}