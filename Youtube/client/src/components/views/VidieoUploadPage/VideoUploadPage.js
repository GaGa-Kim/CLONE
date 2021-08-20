import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd'; // 디자인을 위해 사용
import Dropzone from 'react-dropzone';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]

function VideoUploadPage() {
    // value들을 state에 넣어서 한꺼번에 보내기
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) // private면 0, public이면 1
    const [Category, setCategory] = useState("File & Animation")

    // state 변경 시켜주기
    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value)
    }

    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value)
    }

    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value)
    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload</Title>
            </div>

            <Form onSubmit>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {/* Drop zone */}
                    <Dropzone onDrop
                    onDrop
                    multiple
                    maxSize>
                        {({getRootProps, getInputProps}) => (
                      <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                          <input {...getInputProps()} />
                          <Icon type="plus" style={{ fontSize: '3rem'}} />
                      </div>  
                    )}
                    </Dropzone>

                    {/* Thumbnail */}
                    <div>
                        <img src alt />
                    </div>
                </div>

                <br /><br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br /><br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (  // map에는 key가 필요
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />

                <select onChange={onCategoryChange}>
                     {CategoryOptions.map((item, index) => (
                         <option key={index} value={item.value}>{item.label}</option>
                     ))}       
                </select>
                <br /><br />
 
                <Button type="primary" size="large" onClick>
                    Submit
                </Button>
            </Form>    
        </div>
    )
}

export default VideoUploadPage
