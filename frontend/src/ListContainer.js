import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import ListItem from './ListItem';
import Card from 'react-bootstrap/Card';

class ListContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {tasks: []};
    }
    componentDidMount() {
        axios.get('/api/v1/tasks.json')
            .then(response => {
                console.log(response);
                this.setState({
                    tasks: response.data
                });
            })
            .catch(error => console.log(error));
    }
    render() {
        return (
            <div>
                <h1 className="header">My Todo List</h1>
                <Card>
                    {/* <Card.Header></Card.Header> */}
                    <ListGroup>
                        {this.state.tasks.map(task => {
                            return (
                                <ListItem task={task} key={task.id}/>
                            );
                        })}
                    </ListGroup>
                </Card>
            </div>
        );
    }
}
export default ListContainer;