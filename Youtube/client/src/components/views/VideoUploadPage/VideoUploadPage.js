import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd'; // 디자인을 위해 사용
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

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

function VideoUploadPage(props) {
    // 리덕스 훅을 사용해서 비디오를 업로드한 유저의 정보 가져오기
    const user = useSelector(state => state.user);
    // value들을 state에 넣어서 한꺼번에 보내기
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) // private면 0, public이면 1
    const [Category, setCategory] = useState("File & Animation")
    // 썸네일 관련
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

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

    const onDrop = (files) => {

        // request를 서버에 이를 같이 보내야 파일을 보낼 때 오류가 생기지 않음 
        // 파일에 대한 정보를 알기 위해 헤더 필요
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        // 파일을 서버에 보내기
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {  // 처리 후 resposen 가져오기
            if(response.data.success) {
                console.log(response.data)
                
                // 썸네일 보내기
                let valiable = {
                    filePath: response.data.url,
                    fileName: response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', valiable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    } else {
                        alert('썸네일 생성에 실패했습니다.')
                    }
                })
            } else {
                alert('비디오 업로드를 실패했습니다.')
            }
        })

    }

    const onSubmit = (evnet) => {
        evnet.preventDefault();

        // 리덕스를 통해 가져오기
        const variables = {
            writer: user.userData._id,
            title:  VideoTitle,
            description: Description,
            privacy:  Private,
            filePath : FilePath,
            catogory: Category,
            duration : Duration,
            thumbnail: ThumbnailPath,
        }

        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success) {
                message.success('성공적으로 업로드를 했습니다.')
                // 3초 후 랜딩페이지로
                setTimeout(() => {
                    props.history.push('/')
                }, 3000)
            } else {
                alert('비디오 업로드에 실패 했습니다.')
            }
        })
    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {/* Drop zone - 파일 올리기 */}
                    <Dropzone 
                    onDrop={onDrop}
                    multiple={false} // 한 번에 파일을 많이 올리지 못하도록
                    maxSize={100000000}>
                        {({getRootProps, getInputProps}) => (
                      <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                          <input {...getInputProps()} />
                          <Icon type="plus" style={{ fontSize: '3rem'}} />
                      </div>  
                    )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {ThumbnailPath && // 썸네일이 있을 때만 보여짐
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                    </div>
                    }
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
 
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>    
        </div>
    )
}

export default VideoUploadPage
