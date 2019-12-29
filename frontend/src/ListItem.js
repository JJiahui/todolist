import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import TaskForm from './TaskForm';
import axios from 'axios';

class ListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = { editing: false };
        this.toggleCompleted = this.toggleCompleted.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleNotEditing = this.handleNotEditing.bind(this);
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
    }
    getLayout(){
       return (
            <ListGroup.Item >
                <Row noGutters={true}>
                    <Col sm="auto">
                        <Form.Check type="checkbox" defaultChecked={this.props.task.completed}
                            onClick={this.toggleCompleted} />
                    </Col>
                    <Col >
                        <Card.Title>
                            {this.props.task.description}
                        </Card.Title>
                        {this.props.task.notes 
                            ? <Card.Text>{this.props.task.notes}</Card.Text>
                            : null}
                    </Col>
                    <Col sm="auto">
                        <DropdownButton alignRight variant="light" title="">
                            <Dropdown.Item onClick={this.handleEditing}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.handleDelete(this.props.task.id)}>Delete</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </ListGroup.Item>
       );
    }
    handleEditing(){
        this.setState({ editing: true });
    }
    handleNotEditing(){
        this.setState({ editing: false });
    }
    handleUpdateTask(task){
        axios.put( '/api/v1/tasks/' + task.id, task)
            .then(response => {
                this.props.handleTaskUpdated(task);
                this.handleNotEditing();
            })
            .catch(error => console.log(error));
    }
    handleEdit(task){
        const newTask = {...this.props.task};
        newTask.description = task.description;
        newTask.notes = task.notes;
        this.handleUpdateTask(newTask);
    }
    toggleCompleted(){
        const newTask = {...this.props.task};
        newTask.completed = !this.props.task.completed;
        this.handleUpdateTask(newTask);
    }
    render() {
        return this.state.editing 
            ? <TaskForm submit_btn_txt="Save" 
                    handleCancel={this.handleNotEditing}
                    handleSubmit={this.handleEdit}
                    task={this.props.task} />
            : this.getLayout();
    }
}
export default ListItem;