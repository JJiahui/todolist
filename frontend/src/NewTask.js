import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import TaskForm from './TaskForm';

class NewTask extends React.Component {
    constructor(props){
        super(props);
        this.state = { creating: false };
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleCreating = this.handleCreating.bind(this);
        this.handleNotCreating = this.handleNotCreating.bind(this);
    }
    handleCreateTask(task){
        axios.post( '/api/v1/tasks', task)
            .then(response => {
                this.props.handleTaskCreated(response.data);
                this.setState({ creating: false});
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
                        task={null}/>
                : this.getBtnLayout()
        );
    }
}
export default NewTask;