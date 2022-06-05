import { InflowDynamoDBRepository } from '../../../infrastructure/repository/InflowDynamoDBRepository';
import { InflowPayload } from '../../dto/application/InflowPayload';
import { Inflow } from '../model/Inflow';
import { randomUUID } from 'crypto';
import { IotData } from 'aws-sdk';

export class InsertInflowService {
    private readonly dynamoDBRepository: InflowDynamoDBRepository;
    constructor() {
        this.dynamoDBRepository = new InflowDynamoDBRepository();
    }

    public async execute(payload: InflowPayload) {
        const isLastInflowExist = await this.dynamoDBRepository.getLastOne();
        const iotPublisher = new IotData({ endpoint: process.env.AWS_ENDPOINT });

        if (!isLastInflowExist) {
            const actualDate = new Date();
            actualDate.setHours(actualDate.getHours() - 5);
            const inflow: Inflow = {
                createdAt: actualDate.toISOString(),
                id: randomUUID(),
                is_closed: false,
                peopleEntering: payload.data,
                vaccineCenterId: payload.vaccine_center_id,
            };

            await this.dynamoDBRepository.createEntity(inflow);
            await iotPublisher
                .publish({
                    topic: 'esp32/second',
                    payload: `{"enviado": ${payload.data} }`,
                })
                .promise()
                .then((e) => {
                    console.log('[SENSOR ENTRADA 1] Enviado');
                });
        } else {
            const inflow: Inflow = {
                createdAt: isLastInflowExist.createdAt,
                id: isLastInflowExist.id,
                is_closed: true,
                peopleEntering: parseInt(isLastInflowExist.peopleEntering.toString()) + payload.data,
                vaccineCenterId: payload.vaccine_center_id,
            };

            if (payload.type === 'in') {
                console.log('[SENSOR ENTRADA 2] Enviando');
                const res = await this.dynamoDBRepository.updateEntity(inflow, false);
                await iotPublisher
                    .publish({
                        topic: 'esp32/third',
                        payload: `{"enviado": ${payload.data} }`,
                    })
                    .promise()
                    .then((e) => {
                        console.log('[SENSOR ENTRADA 2] Enviado!');
                    });
                return res;
            } else if (payload.type === 'out') {
                console.log('[SENSOR SALIDA] Enviando');
                const res = await this.dynamoDBRepository.updateEntity(inflow, true);
                console.log('[SENSOR SALIDA] Enviado!');
                return res;
            }
        }
    }
}
