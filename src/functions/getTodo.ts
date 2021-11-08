import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .query({
      TableName: "todos",
      IndexName: 'UserIdIndex',
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userid,
      },
    })
    .promise();

  const userTodos = response.Items[0];

  if(userTodos){
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos: response.Items,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Usuário não encontrado",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
