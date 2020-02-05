import React from 'react';
import Card from 'react-bootstrap/Card';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import * as log from 'loglevel';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

log.setDefaultLevel("debug");

interface ListMenuBarProps {
    filter: "Current" | "All" | "Past";
    showCompleted: boolean;
    search_key: string;
    handleFilterChange: (eventKey: string, e: any) => void;
    toggleShowCompleted: () => void;
    setSearchKey: (search_key: string) => void;
}

class ListMenuBar extends React.Component<ListMenuBarProps, {}>  {
    render() {
        return (
            <Card.Header>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <span style={{fontSize:"24px"}}> My Todo List </span>
                    <div>
                        <div style={{display: "flex", marginBottom: "6px"}}>
                        <DropdownButton id="" alignRight variant="light" title={this.props.filter}>
                            <Dropdown.Item active={this.props.filter === "Current"} eventKey="Current" onSelect={this.props.handleFilterChange}>Current</Dropdown.Item>
                            <Dropdown.Item active={this.props.filter === "All"} eventKey="All" onSelect={this.props.handleFilterChange}>All</Dropdown.Item>
                            <Dropdown.Item active={this.props.filter === "Past"} eventKey="Past" onSelect={this.props.handleFilterChange}>Past</Dropdown.Item>
                        </DropdownButton>
                        <div style={{display: "flex", margin: "5px"}}>
                            <Form.Check type="checkbox" defaultChecked={this.props.showCompleted}
                                onClick={this.props.toggleShowCompleted} />
                            Show Completed Tasks
                        </div>
                        </div>
                        <InputGroup>
                            <FormControl placeholder="Search..." onChange={(e: React.KeyboardEvent<HTMLInputElement>) => this.props.setSearchKey((e.target as HTMLInputElement).value)} value={this.props.search_key}/>
                            <InputGroup.Append>
                                <Button onClick={() => this.props.setSearchKey("")} variant="outline-secondary">X</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>
            </Card.Header>
        );
    }
} 
export default ListMenuBar;