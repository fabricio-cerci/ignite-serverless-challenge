import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from 'uuid';

interface ICreateTodo{
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const id = uuidV4();

  await document.put({
    TableName: 'todos',
    Item: {
      id,
      user_id: userid,
      title,
      done: false,
      deadline: new Date(deadline).toISOString()
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "todo criado",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
