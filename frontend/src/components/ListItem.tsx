import React, { CSSProperties } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import TaskForm from './TaskForm';
import axios from 'axios';
import * as log from 'loglevel';
import { format } from 'date-fns';
import Task from './Task';
import Tag from "./Tag";


const tag_style: CSSProperties = {
	height: "26px",
	textAlign: "center",
	padding: "0 8px",
	fontSize: "14px",
	borderRadius: "14px",
	margin: "0 8px 8px 0",
    background: "#eeeeee"
};

interface ListItemProps {
    task: Task;
    all_tags: any;
    handleDelete: (id?: number) => void;
    handleTaskUpdated: (task: Task, createdTags: Tag[], deletedTags: Tag[]) => void;
}
interface ListItemState {
    editing: boolean;
}

class ListItem extends React.Component<ListItemProps, ListItemState> {
    constructor(props: ListItemProps){
        super(props);
        this.state = { editing: false };
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleNotEditing = this.handleNotEditing.bind(this);
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
    }
    getLayout(){
       return (
            <ListGroup.Item >
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexDirection: "row", marginRight: "10px"}}>
                        <Form.Check type="checkbox" defaultChecked={this.props.task.completed}
                            onClick={this.toggleCompleted} />
                        <div>
                            <h5 style={{wordWrap: "break-word"}}>
                                {this.props.task.description} 
                            </h5>
                            <h6>
                                {this.props.task.notes 
                                    ? <Card.Text>{this.props.task.notes}</Card.Text>
                                    : null}
                            </h6>
                                {this.props.task.due_date 
                                    ? "Due by: " + format(this.props.task.due_date, "do LLLL yyyy") : null}
                                {this.props.task.due_time 
                                    ? ", at " + format(this.props.task.due_time, "hh:mm a") : null}
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{display: "flex", flexFlow: "row-reverse wrap"}}>
                            {!this.props.task.tags ? null : 
                                this.props.task.tags.map(tag => 
                                    <span key={tag.id} style={tag_style}>{tag.tag_name}</span>)}
                        </div>
                        <DropdownButton id="" alignRight variant="light" title="">
                            <Dropdown.Item onClick={this.handleEditing}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.handleDelete(this.props.task.id)}>Delete</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            </ListGroup.Item>
       );
    }
    handleEditing(){
        this.setState({ editing: true });
    }
    handleNotEditing(){
        this.setState({ editing: false });
    }
    handleUpdateTask(task: Task){
        if (task.tags && this.props.task.tags){ // don't send tags to server if not changed
            const s1 = JSON.stringify(this.props.task.tags.map(t => t.id).sort());
            const s2 = JSON.stringify(task.tags.map(t => t.id).sort());
            if (s1 === s2) task.tags = undefined;
        }
        log.debug("Sending request to server: UPDATE task")
        log.debug(task);
        axios.put( '/api/v1/tasks/' + this.props.task.id, task)
            .then(response => {
                log.debug("Server response: task updated");
                log.debug(response.data);
                const newTask = response.data.task;
                newTask.due_date = newTask.due_date ? new Date(newTask.due_date): null;
                newTask.due_time = newTask.due_time ? new Date(newTask.due_time): null;
                newTask.tags = response.data.tags;
                this.props.handleTaskUpdated(newTask, response.data.createdTags, response.data.deletedTags);
                this.handleNotEditing();
            })
            .catch(error => console.log(error));
    }
    toggleCompleted(){
        this.handleUpdateTask({completed: !this.props.task.completed});
    }
    render() {
        return this.state.editing 
            ? <TaskForm submit_btn_txt="Save" 
                    handleCancel={this.handleNotEditing}
                    handleSubmit={this.handleUpdateTask}
                    task={this.props.task} 
                    all_tags={this.props.all_tags}/>
            : this.getLayout();
    }
}
export default ListItem;