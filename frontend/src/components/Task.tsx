import Tag from "./Tag";
export default interface Task {
    id?: number;
    description?: string | null;
    notes?: string | null;
    completed?: boolean;
    due_date?: Date | null;
    due_time?: Date | null;
    tags?: Tag[];
}
