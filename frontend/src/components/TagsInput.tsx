import React, { CSSProperties } from 'react';
import Form from 'react-bootstrap/Form';
import { FaTimes } from 'react-icons/fa';
import Tag from './Tag';
// import "./TagsInput.css";

const tag_style: CSSProperties = {
	height: "32px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	// color: "#fff",
	padding: "0 8px",
	fontSize: "14px",
	listStyle: "none",
	borderRadius: "6px",
	margin: "0 8px 8px 0",
    background: "#dddddd"
    // background: "#0052cc"
};
const tag_title_style: CSSProperties =  {
		marginTop: "3px"
};
const tag_close_icon_style: CSSProperties = {
		display: "block",
		width: "16px",
		height: "16px",
		lineHeight: "16px",
		textAlign: "center",
		fontSize: "14px",
		marginLeft: "8px",
		color: "#0052cc",
		borderRadius: "50%",
		// background: "#fff",
		cursor: "pointer"
};

const tags_style: CSSProperties =  {
	display: "flex",
	flexWrap: "wrap",
	padding: "0",
	margin: "8px 0 0 0"
};
const input_style: CSSProperties = {
		flex: "1",
		border: "none",
		height: "46px",
		fontSize: "14px",
		padding: "4px 0 0 0",
        outline: "transparent"
    };
const tags_input_style: CSSProperties = {
	display: "flex",
	alignItems: "flex-start",
	flexWrap: "wrap",
	minHeight: "48px",
	// width: "480px",
	width: "auto",
	padding: "0 8px",
	border: "1px solid rgb(214, 216, 218)",
    borderRadius: "4px"
};



interface TagsInputState {
    newTagId: number;
}
interface TagsInputProps {
    tags: any;
    all_tags: any;
    removeTag: (id: number) => void;
    addTag: (newTag: Tag) => void;
}

class TagsInput extends React.Component<TagsInputProps, TagsInputState>{
    constructor(props: TagsInputProps){
        super(props);
        this.state = {newTagId: -1};
    }
    addTag(event: React.KeyboardEvent<HTMLInputElement>){
        const newTagName: string = (event.target as HTMLInputElement).value.trim();
        if (newTagName !== ""){
            (event.target as HTMLInputElement).value = "";
            if (this.props.tags.find((tag: Tag) => tag.tag_name === newTagName) === undefined){
                let newTag;
                if (this.props.all_tags[newTagName] === undefined){
                    newTag = {id: this.state.newTagId, tag_name: newTagName};
                    this.setState({newTagId: this.state.newTagId - 1});
                } else {
                    newTag = {id: this.props.all_tags[newTagName], tag_name: newTagName};
                }
                this.props.addTag(newTag);
            }
		}
    } 
    render() {
        return (
            <Form.Group>
                <Form.Label> Tags: </Form.Label>
                <div className="tags-input" style={tags_input_style}>
                    <ul id="tags" style={tags_style}>
                        {!this.props.tags ? null : this.props.tags.map((tag: Tag) => (
                            <li key={tag.id} className="tag" style={tag_style}>
                                <span className='tag-title' style={tag_title_style}>{tag.tag_name}</span>
                                <span className='tag-close-icon' style={tag_close_icon_style}
                                    onClick={() => this.props.removeTag(tag.id)}
                        > <FaTimes style={{color: "black"}}/> </span>
                            </li>
                        ))}
                    </ul>
                    <input
                        style={input_style}
                        type="text"
                        onKeyUp={event => event.key === "Enter" ? this.addTag(event) : null}
                        placeholder="Press enter to add tag"
                    />
                </div>
            </Form.Group>
        )
    }
}
export default TagsInput;