import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import ListItem from './ListItem';
import Card from 'react-bootstrap/Card';
import NewTask from './NewTask';
import * as log from 'loglevel';

class ListContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {tasks: [], all_tags: []};
        this.handleTaskCreated = this.handleTaskCreated.bind(this);
        this.handleTaskUpdated = this.handleTaskUpdated.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        this.getTasks();
    }
    getTasks(){
        log.debug("Sending request to server: GET tasks")
        axios.get('/api/v1/tasks.json')
            .then(response => {
                log.debug("Server response: tasks data");
                log.debug(response.data);
                this.getTags();
                this.setState({
                    tasks: response.data
                });
            })
            .catch(error => console.log(error));
    }
    getTags(){
        log.debug("Sending request to server: GET tags")
        axios.get('/api/v1/tags.json')
            .then(response => {
                log.debug("Server response: tags data");
                const tags_data = response.data;
                const newTasks = this.state.tasks.map((task, i) => {
                    task.tags = tags_data[i];
                    return task;
                });
                const newTags = {};
                tags_data.slice(newTasks.length).forEach(tag => {
                    newTags[tag.tag_name] = tag.id;
                });
                log.debug(newTags);
                this.setState({
                    tasks: newTasks,
                    all_tags: newTags
                });
                console.log(newTasks);
            })
            .catch(error => console.log(error));
    }
    handleTaskCreated(task, createdTags){
        const newTasks = [ ...this.state.tasks, task ];
        const newTags = {...this.state.all_tags};
        createdTags.forEach(tag => {
            newTags[tag.tag_name] = tag.id;
        });
        this.setState({tasks: newTasks, all_tags: newTags});
    }
    handleTaskUpdated(task, createdTags, deletedTags){
        const newTasks = this.state.tasks.filter(e => true);
        const task_index = newTasks.findIndex(e => e.id === task.id);
        newTasks[task_index] = task;

        const newTags = {...this.state.all_tags};
        createdTags.forEach(tag => {
            newTags[tag.tag_name] = tag.id;
        });
        deletedTags.forEach(tag => {
            newTags[tag.tag_name] = undefined;
        });

        this.setState({ tasks: newTasks, all_tags: newTags});
    }
    handleDelete(id){
        log.debug("Sending request to server: DELETE task")
        axios.delete( '/api/v1/tasks/' + id )
            .then(response => {
                log.debug("Server response: task deleted");
                log.debug(response.data);
                const newTasks = this.state.tasks.filter(
                    task => task.id !== id
                );
                const newTags = {...this.state.all_tags};
                response.data.deletedTags.forEach(tag => {
                    newTags[tag.tag_name] = undefined;
                });
                this.setState({tasks: newTasks, all_tags: newTags});
            })
            .catch(error => console.log(error));
    }
    render() {
        return (
            <div>
                {/* <Card style={{width: "50%", minWidth: "500px"}}> */}
                <Card>
                    <Card.Header as="h3">My Todo List</Card.Header>
                    <ListGroup variant="flush">
                        {this.state.tasks.map(task => {
                            return (
                                <ListItem task={task} key={task.id} 
                                    handleDelete={this.handleDelete}
                                    handleTaskUpdated={this.handleTaskUpdated}
                                    all_tags={this.state.all_tags}/>
                            );
                        })}
                        <NewTask handleTaskCreated={this.handleTaskCreated} all_tags={this.state.all_tags} />
                    </ListGroup>
                </Card>
            </div>
        );
    }
}
export default ListContainer;