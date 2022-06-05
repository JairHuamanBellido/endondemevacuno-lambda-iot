export type InflowDynamoDB = {
    "id": {
        "S": string
    },
    "vaccine_center_id": {
        "S": string
    },
    "created_at": {
        "S": string
    },
    "people_entering": {
        "N": number
    },
    "is_closed": {
        "BOOL": boolean
    }
}