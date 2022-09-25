#!/bin/bash

aws dynamodb create-table \
      --table-name events \
      --attribute-definitions AttributeName=entityId,AttributeType=S AttributeName=sequence,AttributeType=N \
      --key-schema AttributeName=entityId,KeyType=HASH AttributeName=sequence,KeyType=RANGE \
      --billing-mode PAY_PER_REQUEST \
      --endpoint-url=http://localhost:4566
