import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'

class ListItem extends React.Component {
    render() {
        return (
            <ListGroup.Item>
                <Row noGutters={true}>
                    <Col sm="auto">
                        <Form.Check type="checkbox" checked={this.props.task.completed}
                            onClick={() => console.log(this.props.task.id)} />
                    </Col>
                    <Col>
                        <Card.Title>
                            {this.props.task.description}
                        </Card.Title>
                        {this.props.task.notes 
                            ? <Card.Text>{this.props.task.notes}</Card.Text>
                            : null}
                    </Col>
                </Row>
            </ListGroup.Item>
        );
    }
}
export default ListItem;