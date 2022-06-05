export interface InflowPayload {
    vaccine_center_id: string;
    data: number;
    type: 'in' | 'out';
}
