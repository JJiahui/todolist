import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import ListItem from './ListItem';
import Card from 'react-bootstrap/Card';
import NewTask from './NewTask';
import * as log from 'loglevel';
import ListMenuBar from './ListMenuBar';
import { isBefore, isAfter } from 'date-fns';

class ListContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {tasks: [], all_tags: [], filter: "Current", showCompleted: true, search_key: ""};
        this.handleTaskCreated = this.handleTaskCreated.bind(this);
        this.handleTaskUpdated = this.handleTaskUpdated.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.toggleShowCompleted = this.toggleShowCompleted.bind(this);
        this.setSearchKey = this.setSearchKey.bind(this);
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
                const tasks = response.data.map(t => {
                    t.due_date = t.due_date ? new Date(t.due_date): null;
                    t.due_time = t.due_time ? new Date(t.due_time): null;
                    return t;
                })
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
    handleFilterChange(eventKey, e){
        this.setState({filter: eventKey});
    }
    toggleShowCompleted(){
        this.setState({showCompleted: !this.state.showCompleted});
    }
    getListItems(tasks, showCompleted, search_key){
        let temp = showCompleted ? tasks: tasks.filter(task => !task.completed);
        temp = search_key !== "" ? this.getSearchedTasks(temp, search_key) : temp;
        return temp.map(task =>
            <ListItem task={task} key={task.id}
                handleDelete={this.handleDelete}
                handleTaskUpdated={this.handleTaskUpdated}
                all_tags={this.state.all_tags}/>);
    }
    getFiltered(compare){
        const now = new Date();
        return this.state.tasks.filter(task => {
            return !task.due_date ||
                (task.due_time
                    ? compare(task.due_time, now)
                    : task.due_date && compare(task.due_date, now));
        });
    }
    setSearchKey(search_key){
        this.setState({search_key});
    }
    getSearchedTasks(tasks, key){
        key = key.trim().toLowerCase();
        return tasks.filter(task =>
            (task.description && task.description.toLowerCase().includes(key))
                || (task.notes && task.notes.toLowerCase().includes(key))
                || (task.tags && task.tags.find(tag => tag.tag_name.toLowerCase().includes(key)))
        );
    }
    render() {
        return (
            <div>
                {/* <Card style={{width: "50%", minWidth: "500px"}}> */}
                <Card>
                    <ListMenuBar
                        showCompleted={this.state.showCompleted}
                        filter={this.state.filter}
                        handleFilterChange={this.handleFilterChange}
                        toggleShowCompleted={this.toggleShowCompleted}
                        setSearchKey={this.setSearchKey}
                        search_key={this.state.search_key}
                        />
                    {/* <Card.Header as="h3">My Todo List</Card.Header> */}
                    <ListGroup variant="flush">
                        {
                            this.getListItems(
                                this.state.filter === "Current"
                                    ? this.getFiltered(isAfter)
                                    : this.state.filter === "Past"
                                        ? this.getFiltered(isBefore)
                                        : this.state.tasks,
                                this.state.showCompleted, this.state.search_key)
                        }
                        <NewTask handleTaskCreated={this.handleTaskCreated} all_tags={this.state.all_tags} />
                    </ListGroup>
                </Card>
            </div>
        );
    }
}
export default ListContainer;