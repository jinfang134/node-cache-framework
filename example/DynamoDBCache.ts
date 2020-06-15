import AWS = require("aws-sdk");
import { initCache, Cache } from '../src/public-api'
import { DocumentClient, GetItemInput } from 'aws-sdk/clients/dynamodb';

AWS.config.update({
    region: "ap-northeast-1",
});


export class DynamoDBCache implements Cache {
    readonly name: string;
    private cache: Map<string, any> = new Map<string, any>();
    private tableName: string = 'dev-cache';
    private client: DocumentClient;

    constructor(name: string) {
        this.name = name;
        this.client = new AWS.DynamoDB.DocumentClient();
    }

    keys(): string[] {
        throw new Error('Method not implemented.');
    }

    clear(): void {
        const params = {
            TableName: this.tableName,
            Key: {
                "tenant": 'hrtommt-develop#' + this.name,
            }
        };
        this.client.delete(params)
    }

    evict(key: string): void {
        const params = {
            TableName: this.tableName,
            Key: {
                "tenant": 'hrtommt-develop#' + this.name,
                id: key,
            }
        };
        this.client.delete(params)
    }

    async get<T>(key: string): Promise<T> {
        const params = {
            TableName: this.tableName,
            Key: {
                "tenant": 'hrtommt-develop#' + this.name,
                id: key,
            }
        };
        const data = await this.client.get(params).promise();
        console.log(data)
        if (data && data.Item) {
            return data.Item.value
        }
        return undefined;
    }

    put<T>(key: string, value: T): void {
        const params = {
            TableName: this.tableName,
            Item: {
                "tenant": 'hrtommt-develop#' + this.name,
                id: key,
                value
            }
        };
        this.client.put(params)
    }
}