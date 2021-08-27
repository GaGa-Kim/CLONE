/* dialogflow에 card message를 위한 intent 생성
{
  "card": [
    {
      "link": "https://www.youtube.com/watch?v=SsMn8tT3zBQ",
      "stack": "MERN STACK",
      "description": "Youtube Clone with Mern Stack",
      "image": "https://res.cloudinary.com/jaewon/upload/vi579699015/1.png"
    },
    {
      "stack": "MERN STACK",
      "link": "https://www.youtube.com/watch?v=SsMn8tT3zBQ",
      "description": "Youtube Clone with Mern Stack",
      "image": "https://res.cloudinary.com/jaewon/upload/vi579699015/1.png"
    },
    {
      "stack": "MERN STACK",
      "description": "Youtube Clone with Mern Stack",
      "link": "https://www.youtube.com/watch?v=SsMn8tT3zBQ",
      "image": "https://res.cloudinary.com/jaewon/upload/vi579699015/1.png"
    }
  ]
}
*/

import React from 'react'
import { Card, Icon } from 'antd';

const { Meta } = Card;

function CardComponent(props) {
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <img
                    alt={props.cardInfo.fields.description.stringValue}S
                    src={props.cardInfo.fields.image.stringValue} />
            }
            actions={[
                <a target="_blank" rel="noopener noreferrer" href={props.cardInfo.fields.link.stringValue}>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}
        >     

            <Meta
                title={props.cardInfo.fields.stack.stringValue}
                description={props.cardInfo.fields.description.stringValue}
            />

        </Card>
    )
}

export default CardComponent
