import { Inflow } from '../../domain/inflow/model/Inflow';
import { dynamoDB } from '../database/DynamoDB';
import { InflowDynamoDB } from '../entity/InflowDynamoDB.entity';
import { InflowDynamoDBMapper } from '../mapper/InflowDynamoDBMapper';

export class InflowDynamoDBRepository {
    private readonly inflowTableAlias = 'inflow';

    public async getLastOne(): Promise<Inflow> {
        const inflowsDynamoDB = await (
            await dynamoDB
                .scan({
                    TableName: this.inflowTableAlias,
                    ScanFilter: {
                        is_closed: { ComparisonOperator: 'EQ', AttributeValueList: [{ BOOL: false }] },
                    },
                })
                .promise()
        ).Items;
        if (inflowsDynamoDB.length === 0) {
            return undefined;
        }
        const inflowStringfly = JSON.stringify(inflowsDynamoDB);

        return InflowDynamoDBMapper.toDomainEntity(JSON.parse(inflowStringfly)[0] as InflowDynamoDB);
    }

    public async getBetweenDates(startDate: string, endDate: string): Promise<Inflow[]> {
        const inflowsDynamoDB = await (
            await dynamoDB
                .scan({
                    TableName: this.inflowTableAlias,
                    ScanFilter: {
                        created_at: {
                            ComparisonOperator: 'BETWEEN',
                            AttributeValueList: [{ S: startDate }, { S: endDate }],
                        },
                    },
                })
                .promise()
        ).Items;
        const inflowStringfly = JSON.stringify(inflowsDynamoDB);

        return InflowDynamoDBMapper.toDomainsEntities(JSON.parse(inflowStringfly) as InflowDynamoDB[]);
    }

    public async createEntity(inflow: Inflow): Promise<any> {
        return await dynamoDB
            .putItem({
                TableName: this.inflowTableAlias,
                Item: {
                    ['id']: { S: inflow.id },
                    ['created_at']: { S: inflow.createdAt },
                    ['is_closed']: { BOOL: false },
                    ['people_entering']: { N: inflow.peopleEntering.toString() },
                    ['vaccine_center_id']: { S: inflow.vaccineCenterId },
                },
            })
            .promise();
    }

    public async updateEntity(inflow: Inflow, isClosed: boolean) {
        return await dynamoDB
            .updateItem({
                TableName: this.inflowTableAlias,
                Key: {
                    id: { S: inflow.id },
                },
                AttributeUpdates: {
                    is_closed: {
                        Action: 'PUT',
                        Value: { BOOL: isClosed },
                    },
                    people_entering: {
                        Action: 'PUT',
                        Value: { N: inflow.peopleEntering.toString() },
                    },
                },
            })
            .promise();
    }
}
