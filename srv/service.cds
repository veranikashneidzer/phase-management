using sap.phaseManagement from '../db/schema.cds';

service PhaseManagement {
    entity Customer as projection on phaseManagement.Customer;
    entity Contract as projection on phaseManagement.Contract;
    entity Phase as projection on phaseManagement.Phase;
}
