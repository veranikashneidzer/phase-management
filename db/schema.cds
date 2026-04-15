using {cuid} from '@sap/cds/common';

namespace sap.phaseManagement;

entity Customers {
      key ID        : UUID;
      name          : String                       @mandatory;
      accountNumber : String                       @unique;
      contracts     : Composition of many Contracts
                        on contracts.customer = $self;
}

entity Contracts {
      key ID      : UUID;
      description : String;
      startDate   : Date;
      endDate     : Date;
      currency    : String default 'EUR';
      status      : String enum {Active; Inactive; Draft};
      customer    : Association to Customers;
      phases      : Composition of many Phases
                        on phases.contract = $self;
}

entity Phases {
      key ID       : UUID;
      name         : String                       @mandatory;
      startDate    : Date                         @mandatory;
      endDate      : Date                         @mandatory;
      monthlyPrice : Decimal(15,2);
      description  : String;
      contract     : Association to Contracts;
}
