import { Inflow } from "../../domain/inflow/model/Inflow";
import { InflowDynamoDB } from "../entity/InflowDynamoDB.entity";

export class InflowDynamoDBMapper {
    public static toDomainEntity(inflowDynamoDB: InflowDynamoDB): Inflow {
        return {
            createdAt: inflowDynamoDB.created_at.S,
            id: inflowDynamoDB.id.S,
            peopleEntering: inflowDynamoDB.people_entering.N,
            vaccineCenterId: inflowDynamoDB.vaccine_center_id.S,
            is_closed: inflowDynamoDB.is_closed.BOOL
        }

    }
    public static toDomainsEntities(inflowDynamoDB: InflowDynamoDB[]): Inflow[] {
        return inflowDynamoDB.map(e => this.toDomainEntity(e))
    }
}