import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus } from 'react-icons/fa';
import TaskForm from './TaskForm';
import * as log from 'loglevel';
import Task from "./Task";
import Tag from "./Tag";

log.setDefaultLevel("debug");

interface NewTaskProps {
    all_tags: any;
    handleTaskCreated: (task: Task, createdTags: Tag[]) => void;
    handleCreateTask: (task: Task, callback: () => void) => void;
}
interface NewTaskState {
    creating: boolean;
}

class NewTask extends React.Component<NewTaskProps, NewTaskState> {
    constructor(props: NewTaskProps){
        super(props);
        this.state = { creating: false };
        this.handleCreating = this.handleCreating.bind(this);
        this.handleNotCreating = this.handleNotCreating.bind(this);
    }
    handleCreating(){
        this.setState({ creating: true });
    }
    handleNotCreating(){
        this.setState({ creating: false });
    }
    getBtnLayout(){
        return (
            <ListGroup.Item action onClick={this.handleCreating}>
                <h5><FaPlus/> Add New Task</h5>
            </ListGroup.Item>
        );
    }
    render() {
        return (
            this.state.creating 
                ? <TaskForm submit_btn_txt="Create" 
                        handleCancel={this.handleNotCreating}
                        handleSubmit={task => this.props.handleCreateTask(task, this.handleNotCreating)} 
                        task={null}
                        all_tags={this.props.all_tags}/>
                : this.getBtnLayout()
        );
    }
}
export default NewTask;