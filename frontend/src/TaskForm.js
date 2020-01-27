import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import TagsInput from './TagsInput';
import { KeyboardDatePicker, KeyboardTimePicker  } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class TaskForm extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        const t = this.props.task;
        this.state = t 
            ? { description: t.description, notes: t.notes, 
                tags: t.tags, due_date: t.due_date, due_time: t.due_time}
            : { description: null, notes: null, tags: [], due_date: null, due_time: null};
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }
    addTag(newTag){
        const newState = {tags: [...this.state.tags, newTag]};
        this.setState(newState);
    }
    removeTag(id){
        const newState = {tags: this.state.tags.filter(tag => tag.id !== id)};
        this.setState(newState);
    }
    render(){
        return (
            <ListGroup.Item>
                <Form>
                    <Form.Group>
                        <Form.Label> Description: </Form.Label>
                        <Form.Control ref='description'
                            autoFocus
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Form.Group>
                        <Form.Label> Due-by: </Form.Label>
                        <div>
                            <KeyboardDatePicker clearable disablePast autoOk
                                format="dd/MM/yyyy"
                                placeholder="dd/MM/yyyy"
                                inputVariant="outlined"
                                value={this.state.due_date} 
                                onChange={date => {
                                    if (date === null){
                                        this.setState({due_date: date, due_time: null});
                                    } else {
                                        this.setState({due_date: date});
                                    }
                                } }/>
                            {" "}
                            <KeyboardTimePicker clearable 
                                disabled={this.state.due_date === null}
                                placeholder="00:00 AM"
                                inputVariant="outlined"
                                value={this.state.due_time} 
                                minutesStep={5}
                                onChange={date => { this.setState({due_time: date});}}/>
                        </div>
                    </Form.Group>
        </MuiPickersUtilsProvider>
                    <TagsInput tags={this.state.tags} removeTag={this.removeTag} addTag={this.addTag}
                                all_tags={this.props.all_tags}/>
                </Form> 
                        <Button variant="dark" onClick={() => this.props.handleSubmit(this.state)}>{this.props.submit_btn_txt}</Button>{" "}
                        <Button variant="dark" onClick={this.props.handleCancel}>Cancel</Button>
            </ListGroup.Item>
        );
    }
}
export default TaskForm;