import boto3
import AwsS3
# Table Name
table_name = 'Posts'

# dynamoDB client
dynamodb_client = boto3.client('dynamodb')




# item scarface movie
item_post = {

    'Title': 'My first post'

}



if __name__ == "__main__":
    resp = dynamodb_client.put_item(TableName=table_name, Item=item_post)
    print(resp)