import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

class TaskForm extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = this.props.task 
            ? {
                description: this.props.task.description,
                notes:this.props.task.notes
            }
            : {
                description: null,
                notes: null
            };
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    handleSubmit(){
        this.props.handleSubmit(this.state);
    }
    render(){
        return (
            <ListGroup.Item>
                <Form>
                    <Form.Group>
                        <Form.Label> Description: </Form.Label>
                        <Form.Control ref='description'
                            name="description"
                            onChange={this.handleChange}
                            placeholder="What will you do?"
                            defaultValue={ this.props.task ? this.props.task.description : "" }/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> Notes: </Form.Label>
                        <Form.Control as="textarea" rows="3" ref='notes'
                            name="notes"
                            onChange={this.handleChange}
                            placeholder="How can you help yourself accomplish this?"
                            defaultValue={ this.props.task ? this.props.task.notes : "" }/>
                    </Form.Group>
                </Form> 
                        <Button variant="dark" onClick={this.handleSubmit}>{this.props.submit_btn_txt}</Button>
                        {" "}
                        <Button variant="dark" onClick={this.props.handleCancel}>Cancel</Button>
            </ListGroup.Item>
        );
    }
}
export default TaskForm;