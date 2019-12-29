import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlus } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';

class NewTask extends React.Component {
    constructor(props){
        super(props);
        this.state = { creating: false };
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleCreating = this.handleCreating.bind(this);
    }
    handleCreateTask(){
        const description = this.refs.description.value;
        const notes = this.refs.notes.value;
        axios.post( '/api/v1/tasks', { description, notes })
            .then(response => {
                console.log(response)
                this.props.handleTaskCreated(response.data);
                this.setState({ creating: false});
            })
            .catch(error => {
                console.log(error)
            });
    }
    getForm(){
        return (
            <ListGroup.Item>
                <Form>
                    <Form.Group>
                        <Form.Label> Description: </Form.Label>
                        <Form.Control ref='description'
                            placeholder="What will you do?"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> Notes: </Form.Label>
                        <Form.Control as="textarea" rows="3" ref='notes'
                            placeholder="How can you help yourself accomplish this?"/>
                    </Form.Group>
                </Form> 
                <Button variant="dark" onClick={this.handleCreateTask}>{"Create"}</Button>
            </ListGroup.Item>
        );
    }
    getAddBtn(){
        return (
            <ListGroup.Item action onClick={this.handleCreating}>
                <h5><FaPlus/> Add New Task</h5>
            </ListGroup.Item>
        );
    }
    handleCreating(){
        this.setState({ creating: true });
    }
    render() {
        return (
            this.state.creating 
                ? this.getForm()
                : this.getAddBtn()
        );
    }
}
export default NewTask;