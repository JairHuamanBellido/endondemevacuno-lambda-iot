import { InflowPayload } from './src/domain/dto/application/InflowPayload';
import { InsertInflowService } from './src/domain/inflow/service/InsertFlowService';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const insertInflow = new InsertInflowService();
export const lambdaHandler = async (event: InflowPayload) => {
    await insertInflow.execute({ data: event.data, vaccine_center_id: event.vaccine_center_id, type: event.type });
    return { status: '200' };
};
