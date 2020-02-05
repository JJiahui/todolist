import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import TaskForm from './TaskForm';
import * as log from 'loglevel';
import Task from "./Task";
import Tag from "./Tag";

log.setDefaultLevel("debug");

interface NewTaskProps {
    all_tags: any;
    handleTaskCreated: (task: Task, createdTags: Tag[]) => void;
}
interface NewTaskState {
    creating: boolean;
}

class NewTask extends React.Component<NewTaskProps, NewTaskState> {
    constructor(props: NewTaskProps){
        super(props);
        this.state = { creating: false };
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleCreating = this.handleCreating.bind(this);
        this.handleNotCreating = this.handleNotCreating.bind(this);
    }
    handleCreateTask(task: Task){
        log.debug("Sending request to server: CREATE task")
        log.debug(task);
        axios.post( '/api/v1/tasks', task)
            .then(response => {
                log.debug("Server response: task created");
                log.debug(response.data);
                const newTask = response.data.task;
                newTask.due_date = newTask.due_date ? new Date(newTask.due_date): null;
                newTask.due_time = newTask.due_time ? new Date(newTask.due_time): null;
                newTask.tags = response.data.createdTags.concat(response.data.existingTags);
                this.props.handleTaskCreated(newTask, response.data.createdTags);
                this.handleNotCreating();
            })
            .catch(error => {
                console.log(error)
            });
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
                        handleSubmit={this.handleCreateTask} 
                        task={null}
                        all_tags={this.props.all_tags}/>
                : this.getBtnLayout()
        );
    }
}
export default NewTask;