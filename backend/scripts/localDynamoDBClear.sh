#!/usr/bin/env bash

clear_dynamo_db_table() {
  aws dynamodb delete-table \
        --table-name "$TABLE_NAME" \
        --endpoint-url=http://localhost:4566 \
        --no-cli-pager

}


echo "START DELETING DYNAMO_DB TABLE"
clear_dynamo_db_table
echo "FINISH DELETING DYNAMO_DB TABLE"

