import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import ListItem from './ListItem';
import Card from 'react-bootstrap/Card';
import NewTask from './NewTask';

class ListContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {tasks: []};
        this.handleTaskCreated = this.handleTaskCreated.bind(this);
        this.handleTaskUpdated = this.handleTaskUpdated.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        axios.get('/api/v1/tasks.json')
            .then(response => {
                this.setState({
                    tasks: response.data
                });
            })
            .catch(error => console.log(error));
    }
    handleTaskCreated(task){
        const tasks = [ ...this.state.tasks, task ];
        this.setState({tasks});
    }
    handleTaskUpdated(task){
        const newTasks = this.state.tasks.filter(e => true);
        const task_index = newTasks.findIndex(e => e.id === task.id);
        newTasks[task_index] = task;
        this.setState({ tasks: newTasks});
    }
    handleDelete(id){
        axios.delete( '/api/v1/tasks/' + id )
            .then(response => {
                const tasks = this.state.tasks.filter(
                    task => task.id !== id
                )
                this.setState({tasks});
            })
            .catch(error => console.log(error));
    }
    render() {
        return (
            <div>
                <Card>
                    <Card.Header as="h3">My Todo List</Card.Header>
                    <ListGroup variant="flush">
                        {this.state.tasks.map(task => {
                            return (
                                <ListItem task={task} key={task.id} 
                                    handleDelete={this.handleDelete}
                                    handleTaskUpdated={this.handleTaskUpdated}/>
                            );
                        })}
                        <NewTask handleTaskCreated={this.handleTaskCreated}/>
                    </ListGroup>
                </Card>
            </div>
        );
    }
}
export default ListContainer;