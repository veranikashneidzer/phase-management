using sap.phaseManagement from '../db/schema.cds';

service PhaseManagement {
    entity Customers as projection on phaseManagement.Customers;
    entity Contracts as projection on phaseManagement.Contracts;
    entity Phases as projection on phaseManagement.Phases;
}
