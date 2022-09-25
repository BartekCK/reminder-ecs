#!/usr/bin/env bash

create_dynamo_db_table() {
  aws dynamodb create-table \
        --table-name "$TABLE_NAME" \
        --attribute-definitions AttributeName=entityId,AttributeType=S AttributeName=sequence,AttributeType=N \
        --key-schema AttributeName=entityId,KeyType=HASH AttributeName=sequence,KeyType=RANGE \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url=http://localhost:4566 \
        --no-cli-pager
}


echo "START CREATING DATABASE"
create_dynamo_db_table
echo "FINISH CREATING DATABASE"

