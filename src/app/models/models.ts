export interface Curve {
    id: string;
    beta_0: number;
    beta_1: number;
    beta_2: number;
    tau: number;
    beta_0_r?: number;
    beta_1_r?: number;
    beta_2_r?: number;
    tau_r?: number;
    days: number;
}